import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import YouTube from "react-youtube";
import Lottie from 'lottie-react';

// Initialize Gemini with your API key (ensure .env setup)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

// YouTube Data API Key from .env
const YOUTUBE_API_KEY = import.meta.env.VITE_APP_YOUTUBE_API_KEY;
console.log("YouTube API Key:", YOUTUBE_API_KEY);
console.log("Gemini API Key:", import.meta.env.VITE_APP_GEMINI_API_KEY);

const VoiceRecipeAssistant = () => {
  const [transcript, setTranscript] = useState("");
  const [youtubeRecipes, setYoutubeRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  // Removed searchType as it will always be 'video' for fetching,
  // though we might still use it internally for prompt clarity if needed.

  // --- State for Conversational Flow ---
  const [conversationPhase, setConversationPhase] = useState("awaiting_input"); // 'awaiting_input' or 'processing'
  const [currentRecipeQuery, setCurrentRecipeQuery] = useState(""); // Stores the main dish/ingredients
  const [currentRecipePreferences, setCurrentRecipePreferences] = useState({}); // Stores collected preferences

  // Assistant's spoken/displayed message
  const [assistantMessage, setAssistantMessage] = useState("Hello! I'm Cooksy, your friendly food rescuer! What recipe video are you craving, or what ingredients do you have for a video recipe?");

  // Use useEffect to speak the initial assistant message once on load
  useEffect(() => {
    // Only speak initial message if it's the very first load and not already spoken
    if (assistantMessage.includes("Hello! I'm Cooksy") && !localStorage.getItem("cooksy_intro_spoken")) {
        speak(assistantMessage);
        localStorage.setItem("cooksy_intro_spoken", "true");
    }
  }, []);


  // --- Helper to speak text ---
  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Speech Synthesis not supported in this browser.");
      return;
    }
    synth.cancel(); // Cancel any ongoing speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.volume = 1;
    utter.rate = 1;
    utter.pitch = 1;
    synth.speak(utter);
  };


  // --- Function to fetch YouTube recipes ---
  const fetchYouTubeRecipes = async (query, preferences = {}) => {
    if (!YOUTUBE_API_KEY) {
      setError("YouTube API Key is not configured. Please check your .env file.");
      console.error("YouTube API Key is missing.");
      return [];
    }

    let finalQuery = query;
    if (preferences.type === 'quick') {
      finalQuery = `quick ${finalQuery}`;
    } else if (preferences.type === 'course') {
      finalQuery = `${finalQuery} full course meal`;
    }
    if (preferences.cuisine && preferences.cuisine !== 'none') {
      finalQuery = `${preferences.cuisine} ${finalQuery}`;
    }
    if (preferences.dietary && preferences.dietary !== 'none') {
      finalQuery = `${preferences.dietary} ${finalQuery}`;
    }

    // Adjust videoDuration based on 'type' preference
    const videoDurationParam = preferences.type === 'quick' ? 'short' : 'any';

    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      finalQuery + ' recipe video' // Always append ' recipe video' for better search results
    )}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}&videoDuration=${videoDurationParam}`;

    try {
      const response = await fetch(youtubeApiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || `YouTube API error: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      console.log("YouTube API Response:", data);

      return data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`, // Correct YouTube video URL
        source: "YouTube" // Explicitly add source
      }));
    } catch (err) {
      console.error("Error fetching YouTube recipes:", err);
      setError(`❌ Failed to fetch video recipes from YouTube: ${err.message}`);
      return [];
    }
  };


  // --- Unified function to process user input and manage conversation ---
  const processUserInput = async (voiceInput) => {
    setTranscript(voiceInput);
    setError(""); // Clear previous errors
    setLoading(true);
    setConversationPhase("processing"); // Indicate processing state
    setYoutubeRecipes([]); // Clear previous YouTube results

    try {
      // 1. Ask Gemini to analyze the user's full request and extract all relevant info
      //    It also needs to suggest the next question if info is missing.
      const conversationAnalysisPrompt = `You are Cooksy, an AI assistant helping users find **YouTube video recipes**.
        The user said: "${voiceInput}".
        Current main recipe query: "${currentRecipeQuery}".
        Current collected preferences: ${JSON.stringify(currentRecipePreferences)}.

        Your task is to:
        1. **Extract Core Query**: What is the main dish, ingredients, or general recipe idea (e.g., "chicken biryani", "pasta", "dessert")? If no specific dish, output "general recipe" if it's very vague or just a greeting.
        2. **Extract/Update Preferences**: Update the following preferences based on the current input. If a preference is mentioned, *always* update it, even if it was previously "none". If not mentioned in *this* turn, retain previous preference or keep as "none".
           - **type**: "quick" (for quick/easy/fast/simple meals), "course" (for elaborate/main dish/full course), or "none".
           - **cuisine**: (e.g., "Indian", "Italian", "Mexican"), or "none".
           - **dietary**: (e.g., "vegetarian", "vegan", "gluten-free"), or "none".
        3. **Identify Missing Info**: Based on the *combined* current and previous input, what preferences are *still* unknown and would be helpful for finding the best video recipe? Consider type, cuisine, and dietary. Prioritize gathering the core query first. If core_query is "general recipe", that should be the first thing to clarify.
        4. **Generate Next Question**: If there's missing helpful information, formulate a *single, intelligent, and friendly question* to ask the user to gather it. If all crucial info is gathered (core_query is specific and missing_info is empty), respond with "READY".

        Format your response as a JSON string with these keys:
        {
          "core_query": "extracted_main_query",
          "preferences": {
            "type": "quick/course/none",
            "cuisine": "cuisine_name/none",
            "dietary": "restriction_name/none"
          },
          "missing_info": ["type", "cuisine", "dietary"], // Array of missing preference types
          "next_question": "question_string / READY"
        }

        Examples:
        - User: "I want a video for chicken"
          Output: {"core_query": "chicken", "preferences": {"type": "none", "cuisine": "none", "dietary": "none"}, "missing_info": ["type", "cuisine", "dietary"], "next_question": "Great! Are you looking for a quick chicken dish video, or something more elaborate? And any specific cuisine or dietary needs?"}

        - User: "make it quick and Indian" (after previous "chicken" query)
          Output: {"core_query": "chicken", "preferences": {"type": "quick", "cuisine": "Indian", "dietary": "none"}, "missing_info": ["dietary"], "next_question": "Perfect! Do you have any dietary preferences like vegetarian or vegan for this quick Indian chicken video recipe?"}

        - User: "show me a video for quick vegan pasta"
          Output: {"core_query": "pasta", "preferences": {"type": "quick", "cuisine": "none", "dietary": "vegan"}, "missing_info": [], "next_question": "READY"}

        - User: "Hello Cooksy"
          Output: {"core_query": "general recipe", "preferences": {"type": "none", "cuisine": "none", "dietary": "none"}, "missing_info": ["core_query"], "next_question": "Hello there! What kind of video recipe are you looking for today, or what ingredients do you have on hand for a video?"}

        - User: "I have eggs and cheese"
          Output: {"core_query": "eggs and cheese", "preferences": {"type": "none", "cuisine": "none", "dietary": "none"}, "missing_info": ["type", "cuisine", "dietary"], "next_question": "Fantastic! With eggs and cheese, we can find lots of video ideas! Are you looking for something quick, or a full meal video? Any cuisine in mind?"}
        `;

      const result = await model.generateContent(conversationAnalysisPrompt);
      const jsonResponseText = await result.response.text();
      console.log("Gemini Analysis Response JSON:", jsonResponseText);

      let analysisResult;
      try {
        const cleanedJson = jsonResponseText.replace(/```json|```/g, '').trim();
        analysisResult = JSON.parse(cleanedJson);
      } catch (jsonErr) {
        console.error("JSON parsing error from Gemini analysis:", jsonErr);
        setError("I'm having trouble understanding. Could you please rephrase your request clearly?");
        setLoading(false);
        setConversationPhase("awaiting_input");
        setAssistantMessage("What recipe video are you craving, or what ingredients do you have for a video recipe?");
        return;
      }

      // Update states based on Gemini's analysis for the next turn's context
      setCurrentRecipeQuery(analysisResult.core_query);
      setCurrentRecipePreferences(analysisResult.preferences);

      if (analysisResult.next_question === "READY") {
        // All info gathered, proceed to fetch and display YouTube videos
        setAssistantMessage(`Alright, let's find you some video recipes for "${analysisResult.core_query}"!`);
        speak(`Alright, let's find you some video recipes for "${analysisResult.core_query}"!`);
        await fetchAndDisplayRecipes(
          analysisResult.core_query, // No longer need 'type' as it's fixed to video
          analysisResult.preferences
        );
      } else {
        // More info needed, ask the generated question
        setAssistantMessage(analysisResult.next_question);
        speak(analysisResult.next_question);
        setConversationPhase("awaiting_input"); // Go back to awaiting input for the next turn
      }

    } catch (err) {
      console.error("Error in processUserInput:", err);
      setError(`❌ Oh dear! Something unexpected went wrong: ${err.message}. Please try speaking again.`);
      setLoading(false);
      setConversationPhase("awaiting_input"); // Reset for safety
      setAssistantMessage("What recipe video are you craving, or what ingredients do you have for a video recipe?");
    } finally {
      setLoading(false);
    }
  };

  // Simplified fetchAndDisplayRecipes as it only handles YouTube now
  const fetchAndDisplayRecipes = async (query, preferences) => {
    setLoading(true);
    setYoutubeRecipes([]); // Clear previous results
    setError(""); // Clear any previous errors

    try {
      const videos = await fetchYouTubeRecipes(query, preferences);
      setYoutubeRecipes(videos);
      if (videos.length === 0) {
        setAssistantMessage(`Hmm, I couldn't find any video recipes for "${query}" with those preferences. Please try a different query.`);
        speak(`Hmm, I couldn't find any video recipes for "${query}" with those preferences. Please try a different query.`);
      } else {
        setAssistantMessage(`Here are some video recipes for "${query}" from YouTube!`);
        speak(`Here are some video recipes for "${query}" from YouTube.`);
      }
    } catch (err) {
      console.error("Error fetching/displaying recipes:", err);
      setError(`Couldn't retrieve video recipes at this moment: ${err.message}`);
    } finally {
      setLoading(false);
      // After displaying, reset context for a new conversation, ready for a new query
      setConversationPhase("awaiting_input");
      setCurrentRecipeQuery("");
      setCurrentRecipePreferences({});
    }
  };

  // --- Speech Recognition setup ---
  const startListening = () => {
    setTranscript("");
    setError("");
    setYoutubeRecipes([]); // Clear videos on new listening session

    const recognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!recognition) {
      alert("Speech Recognition not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const mic = new recognition();
    mic.lang = "en-US";
    mic.start();
    setListening(true);
    setAssistantMessage("Listening...");

    mic.onresult = async (event) => {
      const voiceInput = event.results[0][0].transcript.toLowerCase();
      setListening(false); // Stop listening after result
      await processUserInput(voiceInput); // Call the unified processing function
    };

    mic.onerror = (e) => {
      console.error("Speech Recognition error:", e);
      setListening(false);
      setError("Speech recognition error. Please try again.");
      setAssistantMessage("Sorry, I didn't catch that. Can you please repeat?");
      setConversationPhase("awaiting_input"); // Reset state on error
    };

    mic.onend = () => {
      if (listening) { // Only if mic was actively listening and not manually stopped
          setListening(false);
      }
    };
  };

  // Options for react-youtube player
  const youtubePlayerOpts = {
    height: '300',
    width: '100%',
    playerVars: {
      autoplay: 0,
      rel: 0,
      modestbranding: 1,
    },
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <Lottie 
          animationData={{
            "v": "5.7.4",
            "fr": 30,
            "ip": 0,
            "op": 120,
            "w": 150,
            "h": 150,
            "nm": "cooking-pot",
            "ddd": 0,
            "assets": [],
            "layers": [{
              "ddd": 0,
              "ind": 1,
              "ty": 4,
              "nm": "pot",
              "sr": 1,
              "ks": {
                "o": {"a": 0, "k": 100},
                "r": {"a": 1, "k": [{"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0]}, {"t": 60, "s": [10]}, {"t": 120, "s": [0]}]},
                "p": {"a": 0, "k": [75, 75, 0]},
                "a": {"a": 0, "k": [0, 0, 0]},
                "s": {"a": 1, "k": [{"i": {"x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833]}, "o": {"x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167]}, "t": 0, "s": [100, 100, 100]}, {"t": 30, "s": [110, 110, 100]}, {"t": 60, "s": [100, 100, 100]}]}
              },
              "ao": 0,
              "shapes": [{
                "ty": "el",
                "p": {"a": 0, "k": [0, 0]},
                "s": {"a": 0, "k": [50, 50]},
                "fill": {"c": {"a": 0, "k": [0.8, 0.4, 0.2, 1]}}
              }],
              "ip": 0,
              "op": 120,
              "st": 0
            }]
          }}
          style={{ width: 80, height: 80, margin: '0 auto' }}
          loop
        />
      </div>
      <h2 style={{ textAlign: "center", color: "#333" }}>🎙️ Cooksy: Your Culinary Companion </h2>

      {/* Assistant Message Display */}
      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        border: "1px solid #c8e6c9",
        borderRadius: "8px",
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "1.1rem"
      }}>
        {assistantMessage}
      </div>

      {/* Main Action Button */}
      <button
        onClick={startListening}
        disabled={listening || loading}
        style={{
          display: "block",
          margin: "1rem auto",
          padding: "15px 30px",
          backgroundColor: listening ? "#ffc107" : "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "1.1rem",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          transition: "background-color 0.3s ease",
        }}
      >
        {listening ? "Listening..." : loading ? "Processing..." : "🎤 Start Talking"}
      </button>

      {/* User Transcript Display */}
      {transcript && (
        <div style={{ marginTop: "1.5rem", border: "1px solid #eee", padding: "1rem", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <strong style={{ color: "#555" }}>🗣️ You said:</strong>
          <p style={{ fontStyle: "italic", color: "#666" }}>"{transcript}"</p>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <p style={{ textAlign: "center", marginTop: "1rem", color: "#039BE5" }}>⏳ Cooksy is searching YouTube for videos...</p>}

      {/* Error Message */}
      {error && (
        <p style={{ color: "red", marginTop: "1rem", textAlign: "center", fontWeight: "bold" }}>{error}</p>
      )}

      {/* YouTube Video Recipes Display */}
      {youtubeRecipes.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <strong style={{ fontSize: "1.2rem", color: "#333" }}>📺 Video Recipes from YouTube:</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
            {youtubeRecipes.map((video) => (
              <div key={video.id} style={{ border: "1px solid #eee", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <YouTube videoId={video.id} opts={youtubePlayerOpts} />
                <div style={{ padding: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem", color: "#333" }}>{video.title}</h4>
                  <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>By: {video.channelTitle}</p>
                  <p style={{ margin: "0.5rem 0 0", color: "#888", fontSize: "0.8rem", fontWeight: "bold" }}>Source: {video.source}</p>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "0.8rem",
                      padding: "8px 15px",
                      backgroundColor: "#FF0000",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "5px",
                      fontSize: "0.9rem",
                    }}
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Fallback buttons removed as text recipe option is gone */}
    </div>
  );
};

export default VoiceRecipeAssistant;