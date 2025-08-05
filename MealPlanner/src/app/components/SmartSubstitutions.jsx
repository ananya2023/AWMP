import React, { useState, useEffect } from 'react';
import { Search, Lightbulb, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserProfile } from '../../api/userApi';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const SmartSubstitutions = () => {
  const [ingredient, setIngredient] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [substitutions, setSubstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [dietaryPrefs, setDietaryPrefs] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const userDataFromStorage = JSON.parse(localStorage.getItem('user_data'));
      if (userDataFromStorage?.user_id) {
        const response = await getUserProfile(userDataFromStorage.user_id);
        setAllergies(response.data.allergies || []);
        setDietaryPrefs(response.data.dietaryPreferences || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to empty arrays
      setAllergies([]);
      setDietaryPrefs([]);
    } finally {
      setProfileLoading(false);
    }
  };

  const getSubstitutions = async () => {
    if (!ingredient.trim()) return;
    
    setLoading(true);
    try {
      const allergyText = allergies.length > 0 ? `AVOID ingredients containing: ${allergies.join(', ')}. ` : '';
      const dietaryText = dietaryPrefs.length > 0 ? `Must be suitable for: ${dietaryPrefs.join(', ')} diet. ` : '';
      
      const prompt = `Suggest 3-4 practical and healthy substitutes for "${ingredient}" in a ${recipeName || 'general'} recipe. 
      ${allergyText}${dietaryText}
      For each substitute, provide:
      1. The substitute ingredient
      2. The conversion ratio
      3. Brief reason why it works
      
      Format as JSON array:
      [{"substitute": "ingredient name", "ratio": "conversion", "reason": "why it works"}]`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      
      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const parsedSubstitutions = JSON.parse(cleanedResponse);
      
      setSubstitutions(parsedSubstitutions);
    } catch (error) {
      console.error('Error getting substitutions:', error);
      setSubstitutions([{
        substitute: "Unable to get substitutions",
        ratio: "Try again",
        reason: "Please check your connection and try again"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb size={24} className="text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Smart Recipe Substitutions
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Missing Ingredient
            </label>
            <input
              type="text"
              placeholder="e.g., heavy cream, eggs, butter"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipe Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., pasta sauce, cake, soup"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Your Profile:
            </p>
            {profileLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500">Loading preferences...</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allergies.length > 0 ? (
                  allergies.map((allergy) => (
                    <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                      Allergic to {allergy}
                    </span>
                  ))
                ) : null}
                {dietaryPrefs.length > 0 ? (
                  dietaryPrefs.map((pref) => (
                    <span key={pref} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                      {pref}
                    </span>
                  ))
                ) : null}
                {allergies.length === 0 && dietaryPrefs.length === 0 && (
                  <span className="text-sm text-gray-500">No dietary preferences or allergies set</span>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={getSubstitutions}
            disabled={loading || !ingredient.trim()}
            className="flex items-center gap-2 w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {loading ? 'Finding Substitutes...' : 'Get Substitutions'}
          </button>
        </div>

        {substitutions.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Suggested Substitutes:
            </h3>
            <div className="space-y-3">
              {substitutions.map((sub, index) => (
                <div key={index} className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {sub.substitute}
                    </span>
                    <span className="text-sm text-gray-600">
                      {sub.ratio}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {sub.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSubstitutions;