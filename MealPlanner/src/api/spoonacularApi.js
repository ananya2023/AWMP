const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export const getRandomRecipes = async (number = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/random?apiKey=${SPOONACULAR_API_KEY}&number=${number}`
    );
    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
};

export const searchRecipes = async (query, number = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${query}&number=${number}&addRecipeInformation=true`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

export const getRecipesByIngredients = async (ingredients, number = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${ingredients}&number=${number}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    throw error;
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

export const getRecipesByType = async (type, number = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}/complexSearch?apiKey=${SPOONACULAR_API_KEY}&type=${type}&number=${number}&addRecipeInformation=true`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching recipes by type:', error);
    throw error;
  }
};