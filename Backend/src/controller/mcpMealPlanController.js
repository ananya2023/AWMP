const { model } = require('../utils/geminiHelper');

const getRecipesByIngredients = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { ingredients, mealType } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      console.log('Invalid ingredients:', ingredients);
      return res.status(400).json({ error: 'Ingredients array is required' });
    }
    
    console.log('Using ingredients:', ingredients, 'for meal type:', mealType);
    const mealTypeFilter = mealType ? `Focus on ${mealType} recipes. ` : '';
    const prompt = `Generate 10 detailed recipes using PRIMARILY these available ingredients: ${ingredients.join(', ')}. 
    ${mealTypeFilter}IMPORTANT: Each recipe should use at least 2-3 of the provided ingredients as main components.
    
    Return ONLY a JSON array with this exact structure for each recipe:
    {
      "name": "Recipe Name",
      "description": "Brief appetizing description",
      "cookTime": "25 min",
      "difficulty": "Easy|Medium|Hard",
      "servings": 4,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "mealTypes": ["breakfast", "lunch", "dinner"],
      "wasteReduced": 85,
      "image": "RECIPE_IMAGE_PLACEHOLDER",
      "category": "soup|pasta|bowl|breakfast|main",
      "rating": 4.5,
      "nutritionInfo": {
        "calories": 350,
        "protein": "15g",
        "carbs": "45g",
        "fat": "12g"
      },
      "tips": ["Cooking tip 1", "Storage tip 2"]
    }
    
    Make sure each recipe clearly indicates which meal types it's suitable for (breakfast, lunch, or dinner).`
    
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().replace(/```json\n?|```\n?/g, '').trim();
    
    // Extract JSON array from response
    const jsonStart = responseText.indexOf('[');
    const jsonEnd = responseText.lastIndexOf(']') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      responseText = responseText.substring(jsonStart, jsonEnd);
    }
    
    const recipes = JSON.parse(responseText);
    
    // Generate appropriate images for each recipe
    const recipesWithImages = recipes.map(recipe => {
      const recipeName = recipe.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      const imageUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
      
      // Use different food images based on meal type and category
      let specificImageUrl;
      if (recipe.mealTypes?.includes('breakfast')) {
        specificImageUrl = 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop&crop=center&q=80';
      } else if (recipe.category === 'soup') {
        specificImageUrl = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center&q=80';
      } else if (recipe.category === 'pasta') {
        specificImageUrl = 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop&crop=center&q=80';
      } else if (recipe.category === 'bowl') {
        specificImageUrl = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center&q=80';
      } else {
        specificImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center&q=80';
      }
      
      return {
        ...recipe,
        image: specificImageUrl
      };
    });
    
    console.log('Generated recipes count:', recipesWithImages.length);
    
    res.json(recipesWithImages);
  } catch (error) {
    console.error('Error in getRecipesByIngredients:', error);
    res.status(500).json({ error: error.message });
  }
};

const generateWeeklyMealPlan = async (req, res) => {
  try {
    const { recipes, preferences } = req.body;
    const mealType = preferences?.mealType;
    
    // Filter recipes by meal type if specified
    let filteredRecipes = recipes;
    if (mealType && Array.isArray(recipes)) {
      filteredRecipes = recipes.filter(recipe => 
        recipe.mealTypes && recipe.mealTypes.includes(mealType)
      );
      
      // If no recipes match the meal type, use all recipes
      if (filteredRecipes.length === 0) {
        filteredRecipes = recipes;
      }
    }
    
    const prompt = `Create a detailed weekly meal plan using these recipes: ${JSON.stringify(filteredRecipes.slice(0, 5))}
    Preferences: ${JSON.stringify(preferences)}
    ${mealType ? `Focus on ${mealType} recipes.` : ''}
    
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
          "image": "MEAL_IMAGE_PLACEHOLDER",
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
    
    // Add appropriate images to each meal
    const mealPlanWithImages = {};
    Object.keys(mealPlan).forEach(day => {
      if (day === 'wasteReductionTips') {
        mealPlanWithImages[day] = mealPlan[day];
        return;
      }
      
      mealPlanWithImages[day] = {};
      Object.keys(mealPlan[day]).forEach(mealType => {
        const meal = mealPlan[day][mealType];
        if (meal && typeof meal === 'object') {
          let imageUrl;
          if (mealType === 'breakfast') {
            imageUrl = 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop&crop=center&q=80';
          } else if (mealType === 'lunch') {
            imageUrl = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center&q=80';
          } else if (mealType === 'dinner') {
            imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center&q=80';
          } else {
            imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center&q=80';
          }
          
          mealPlanWithImages[day][mealType] = {
            ...meal,
            image: imageUrl
          };
        } else {
          mealPlanWithImages[day][mealType] = meal;
        }
      });
    });
    
    res.json(mealPlanWithImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createShoppingList = async (req, res) => {
  try {
    const { mealPlan, fridgeInventory } = req.body;
    
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