// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const functions = require('@google-cloud/functions'); // For Google Cloud Functions
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
// const { processReceipt } = require('./documentAI/scanner'); 

// Import the Google Generative AI client library
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load API key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable not set.');
    console.error('Please set it before running the server: export GEMINI_API_KEY="YOUR_API_KEY_HERE"');
    process.exit(1); // Exit if API key is missing
}
const FATSECRET_CONSUMER_KEY = process.env.FATSECRET_CONSUMER_KEY;
const FATSECRET_CONSUMER_SECRET = process.env.FATSECRET_CONSUMER_SECRET;

if (!FATSECRET_CONSUMER_KEY || !FATSECRET_CONSUMER_SECRET) {
    console.error("FATSECRET_CONSUMER_KEY and FATSECRET_CONSUMER_SECRET must be set!");
    process.exit(1); // Exit if API key is missing
    // In a real app, you'd want to gracefully handle this or prevent deployment
}

const FATSECRET_API_URL = 'https://platform.fatsecret.com/rest/server.api';

const oauth = OAuth({
  consumer: {
    key: FATSECRET_CONSUMER_KEY,
    secret: FATSECRET_CONSUMER_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // Use 1.5 Pro for vision capabilities



const app = express();
const port = 3001; // Port for our backend server
const corsOptions = {
  origin: '*',
};
// Enable CORS for your React app
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // **CHANGE THIS TO YOUR REACT APP'S DOMAIN IN PRODUCTION!**
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Use CORS to allow communication from your React app (which runs on a different port)
app.use(cors(corsOptions));

// Configure Multer to handle file uploads. It will save files temporarily.
const upload = multer({ dest: 'uploads/' });

// Helper function to convert local file to GoogleGenerativeAI.Part object
async function fileToGenerativePart(filePath, mimeType) {
  const data = await fs.readFile(filePath);
  return {
      inlineData: {
          data: Buffer.from(data).toString('base64'),
          mimeType
      },
  };
}

// OCR endpoint with prompt-based extraction
app.post('/upload-receipt', upload.single('receiptImage'), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
  }

  const imagePath = req.file.path;
  const mimeType = req.file.mimetype;

  try {
      console.log(`Processing image with Gemini 1.5 Pro: ${imagePath}`);

      const imagePart = await fileToGenerativePart(imagePath, mimeType);

      // --- The 'Prompt' for Prompt-Based OCR ---
      const prompt = `You are a highly accurate receipt data extractor.
      Analyze the provided receipt image and extract the following information.
      For each item, determine if it is an edible grocery item (food, beverages, fresh produce, spices, dairy, snacks, etc.). Exclude non-edible items like cleaning supplies, toiletries, paper products, pet food, batteries, etc.
      Format the output as a JSON object inside a Markdown code block.
      {
        "vendor_name": "string or null",
        "date": "YYYY-MM-DD or null",
        "items": [
          {
            "name": "string",
            "quantity": "number",
            "unit": "string (e.g., 'pieces', 'kg', 'ml', 'doz' or 'null' if not specified)",
            "price": "string (e.g., '$12.34', 'Rs. 50.00')"
          }
        ],
        "subtotal": "string (e.g., '$12.34' or null)",
        "tax": "string (e.g., '$1.23' or null)",
        "total": "string (e.g., '$13.57' or null)"
      }
      
      If a field is not found, use null. For quantities and prices, if a currency symbol is present, include it in the price string.
      Be very careful with item names and ensure they are distinct. Combine quantity and unit if necessary (e.g., "1kg Sugar").
      For "unit", infer based on context if not explicitly mentioned (e.g., eggs are typically 'doz' or 'pieces', milk 'liters'/'ml', but default to 'pieces' if unsure).`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Clean up the uploaded image after processing
      await fs.unlink(imagePath);

      console.log('Gemini Response Text:\n', text);

      // Attempt to extract JSON from the Markdown code block
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      let extractedData = {};
      if (jsonMatch && jsonMatch[1]) {
          try {
              extractedData = JSON.parse(jsonMatch[1]);
          } catch (jsonError) {
              console.error('Error parsing JSON from Gemini response:', jsonError);
              // Fallback to sending raw text if JSON parsing fails
              return res.status(500).json({
                  message: 'AI processing successful, but failed to parse JSON.',
                  ocrText: text, // Send raw AI response
                  extractedData: null
              });
          }
      } else {
          console.warn('No JSON Markdown block found in Gemini response. Sending raw text.');
          return res.status(500).json({
              message: 'AI processing successful, but JSON format not detected.',
              ocrText: text, // Send raw AI response
              extractedData: null
          });
      }


      res.json({
          message: 'Prompt-based OCR successful using Gemini 1.5 Pro',
          ocrText: text, // You can still show the full AI response for debugging
          extractedData: extractedData
      });

  } catch (error) {
      console.error('Error during AI processing:', error.message);
      // Clean up the uploaded image in case of error
      try {
          await fs.unlink(imagePath);
      } catch (unlinkErr) {
          console.error('Error deleting temp file on error:', unlinkErr);
      }
      res.status(500).json({ message: 'Error processing receipt with AI.', error: error.message });
  }
});


app.get('/', (req, res) => {
  res.status(200).send('Meal Rescue API is up and running! Ready to scan receipts.');
});

app.listen(port, () => {
  console.log(`Meal Rescue backend listening on http://localhost:${port}`);
});

/**
 * Cloud Function to search for recipes on FatSecret.
 * Triggered by an HTTP request from the React frontend.
 */
app.post('/getRecipeFromFatSecret', async (req, res) => {
  const { searchExpression } = req.body; // e.g., "chicken and rice", "vegetarian pasta"

  if (!searchExpression) {
    return res.status(400).json({ error: "Missing search expression." });
  }

  const request_data = {
    url: FATSECRET_API_URL,
    method: 'POST', // FatSecret often prefers POST for method-based API calls
    data: {
      method: 'recipes.search.v3', // Use v3 for better filtering if available, otherwise v2 or v1
      search_expression: searchExpression,
      format: 'json',
      max_results: 3, // Get a few results
      // Add other parameters as needed, e.g., 'must_have_images': true, 'recipe_type': 'Main Dishes'
    }
  };

  const authorization = oauth.authorize(request_data);

  try {
    const response = await axios({
      url: request_data.url,
      method: request_data.method,
      headers: oauth.toHeader(authorization),
      data: request_data.data, // For POST requests, parameters go in the body
    });

    const data = response.data;
    console.log("FatSecret API Raw Response:", JSON.stringify(data, null, 2));

    if (data.recipes && data.recipes.recipe && data.recipes.recipe.length > 0) {
      const recipes = Array.isArray(data.recipes.recipe) ? data.recipes.recipe : [data.recipes.recipe];
      const formattedRecipes = recipes.map(r => ({
        id: r.recipe_id,
        name: r.recipe_name,
        description: r.recipe_description || 'No description available.',
        imageUrl: r.recipe_image,
        sourceUrl: r.recipe_url, // URL on FatSecret's site
        // You might need to call recipe.get for full ingredients and instructions
        // For now, we'll indicate if full details are needed from sourceUrl
      }));

      res.json({ success: true, recipes: formattedRecipes });
    } else {
      res.json({ success: true, recipes: [], message: "No recipes found for your ingredients." });
    }

  } catch (error) {
    console.error("Error calling FatSecret API:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: "Failed to fetch recipes from FatSecret." });
  }
});

// --- Export the Express app as a Cloud Function ---
exports.fatsecretApiGateway = app;

// How to run cloud functions
// gcloud functions deploy fatsecretApiGateway \
//   --runtime nodejs20 \
//   --trigger-http \
//   --allow-unauthenticated \
//   --entry-point fatsecretApiGateway \
//   --set-secrets=FATSECRET_CONSUMER_KEY=FATSECRET_CONSUMER_KEY:latest,FATSECRET_CONSUMER_SECRET=FATSECRET_CONSUMER_SECRET:latest \
//   --region=us-central1 # Use your desired region
// Define the API endpoint for scanning receipts  - Document AI
// app.post('/api/scan-receipt', upload.single('receipt'), async (req, res) => {
//   // 'receipt' is the field name we'll use in the frontend
//   if (!req.file) {
//     return res.status(400).json({ error: 'No receipt file uploaded.' });
//   }

//   try {
//     console.log(`Processing file: ${req.file.path}`);
//     // Call our Document AI processing function
//     const items = await processReceipt(req.file.path, req.file.mimetype);

//     // Send the extracted items back to the frontend
//     res.json(items);

//   } catch (error) {
//     console.error('Error processing document:', error);
//     res.status(500).json({ error: 'Failed to process document.' });
//   } finally {
//     // Clean up the uploaded file after processing
//     await fs.unlink(req.file.path);
//   }
// });

