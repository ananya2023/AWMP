const API_BASE_URL = 'http://localhost:3001/api/awmp';

export const saveRecipe = async (user_id, recipe) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, recipe }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save recipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

export const getSavedRecipes = async (user_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-recipes?user_id=${user_id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get saved recipes');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    throw error;
  }
};

export const deleteSavedRecipe = async (user_id, recipe_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-recipes/${user_id}/${recipe_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete saved recipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting saved recipe:', error);
    throw error;
  }
};