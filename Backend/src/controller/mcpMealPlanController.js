const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate 10 detailed recipes using these ingredients: ${ingredients.join(', ')}. 
    Return ONLY a JSON array with this exact structure for each recipe:
    {
      "name": "Recipe Name",
      "description": "Brief appetizing description",
      "cookTime": "25 min",
      "difficulty": "Easy|Medium|Hard",
      "servings": 4,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "mealTypes": ["breakfast|lunch|dinner"],
      "wasteReduced": 85,
      "image": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      "category": "soup|pasta|bowl|breakfast|main",
      "rating": 4.5,
      "nutritionInfo": {
        "calories": 350,
        "protein": "15g",
        "carbs": "45g",
        "fat": "12g"
      },
      "tips": ["Cooking tip 1", "Storage tip 2"]
    }`
    
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().replace(/```json\n?|```\n?/g, '').trim();
    
    // Extract JSON array from response
    const jsonStart = responseText.indexOf('[');
    const jsonEnd = responseText.lastIndexOf(']') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      responseText = responseText.substring(jsonStart, jsonEnd);
    }
    
    const recipes = JSON.parse(responseText);
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateWeeklyMealPlan = async (req, res) => {
  try {
    const { recipes, preferences } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Create a detailed weekly meal plan using these recipes: ${JSON.stringify(recipes.slice(0, 5))}
    Preferences: ${JSON.stringify(preferences)}
    
    Return ONLY JSON with this exact structure:
    {
      "monday": {
        "breakfast": {
          "name": "Recipe Name",
          "description": "Brief description",
          "cookTime": "20 min",
          "difficulty": "Easy",
          "servings": 2,
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["Step 1", "Step 2"],
          "wasteReduced": 85,
          "image": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
          "nutritionInfo": {"calories": 350, "protein": "15g"},
          "status": "planned"
        },
        "lunch": {...},
        "dinner": {...}
      },
      "tuesday": {...},
      "wednesday": {...},
      "thursday": {...},
      "friday": {...},
      "saturday": {...},
      "sunday": {...},
      "wasteReductionTips": ["tip1", "tip2"]
    }
    
    Use quick recipes (≤30min) for weekdays, elaborate (≤90min) for weekends. Include complete recipe details.`
    
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().replace(/```json\n?|```\n?/g, '').trim();
    
    // Extract JSON object from response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      responseText = responseText.substring(jsonStart, jsonEnd);
    }
    
    const mealPlan = JSON.parse(responseText);
    
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createShoppingList = async (req, res) => {
  try {
    const { mealPlan, fridgeInventory } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Create shopping list for meal plan: ${JSON.stringify(mealPlan)}
    Current fridge: ${JSON.stringify(fridgeInventory)}
    
    Return JSON array of items needed: [{"item": "name", "quantity": "amount", "category": "type"}]`;
    
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().replace(/```json\n?|```\n?/g, '').trim();
    
    // Extract JSON array from response
    const jsonStart = responseText.indexOf('[');
    const jsonEnd = responseText.lastIndexOf(']') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      responseText = responseText.substring(jsonStart, jsonEnd);
    }
    
    const shoppingList = JSON.parse(responseText);
    
    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRecipesByIngredients,
  generateWeeklyMealPlan,
  createShoppingList
};