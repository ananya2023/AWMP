const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 'http://localhost:3008/api/awmp';

// MCP Server Functions for Intelligent Meal Planning

export const get_fridge_inventory = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pantry?user_id=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch fridge inventory');
    const result = await response.json();
    const data = result.data || [];
    return data.map(item => ({
      name: item.item_name || item.name,
      quantity: item.quantity,
      expiryDate: item.expiry_date,
      category: item.category
    }));
  } catch (error) {
    console.error('Error fetching fridge inventory:', error);
    throw error;
  }
};

export const get_recipes_by_ingredients = async (ingredients) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/by-ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients }),
    });
    if (!response.ok) throw new Error('Failed to fetch recipes by ingredients');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    throw error;
  }
};

export const generate_weekly_meal_plan = async (recipes, preferences) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plan/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipes, preferences }),
    });
    if (!response.ok) throw new Error('Failed to generate meal plan');
    return await response.json();
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

export const create_shopping_list = async (mealPlan, fridgeInventory) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping-list/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealPlan, fridgeInventory }),
    });
    if (!response.ok) throw new Error('Failed to create shopping list');
    return await response.json();
  } catch (error) {
    console.error('Error creating shopping list:', error);
    throw error;
  }
};

// AI Orchestrator Function
export const generateIntelligentMealPlan = async (userId, preferences = {}) => {
  try {
    // Step 1: Get fridge inventory
    const fridgeInventory = await get_fridge_inventory(userId);
    
    // Step 2: Extract available ingredients
    const availableIngredients = fridgeInventory.map(item => item.name);
    
    // Step 3: Get recipes that can be made with available ingredients
    const possibleRecipes = await get_recipes_by_ingredients(availableIngredients);
    
    // Step 4: Generate weekly meal plan with smart preferences
    const defaultPreferences = {
      servings: 2,
      dietaryRestrictions: [],
      weekdayComplexity: 'quick',
      weekendComplexity: 'elaborate',
      wasteReduction: true,
      ...preferences
    };
    
    const mealPlan = await generate_weekly_meal_plan(possibleRecipes, defaultPreferences);
    
    // Step 5: Create shopping list for missing ingredients
    const shoppingList = await create_shopping_list(mealPlan, fridgeInventory);
    
    return {
      mealPlan,
      shoppingList,
      fridgeInventory,
      wasteReductionTips: mealPlan.wasteReductionTips || []
    };
  } catch (error) {
    console.error('Error in intelligent meal planning:', error);
    throw error;
  }
};