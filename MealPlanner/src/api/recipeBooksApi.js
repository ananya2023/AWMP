const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 'http://localhost:3008/api/awmp';

export const createRecipeBook = async (user_id, bookData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, ...bookData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create recipe book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating recipe book:', error);
    throw error;
  }
};

export const getRecipeBooks = async (user_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-books?user_id=${user_id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get recipe books');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error getting recipe books:', error);
    throw error;
  }
};

export const updateRecipeBook = async (bookId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update recipe book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating recipe book:', error);
    throw error;
  }
};

export const deleteRecipeBook = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-books/${bookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete recipe book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting recipe book:', error);
    throw error;
  }
};

export const addRecipeToBook = async (bookId, recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-books/${bookId}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipe_id: recipeId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add recipe to book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding recipe to book:', error);
    throw error;
  }
};

export const removeRecipeFromBook = async (bookId, recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-books/${bookId}/recipes/${recipeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove recipe from book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing recipe from book:', error);
    throw error;
  }
};

export const getRecipesInBook = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-books/${bookId}/recipes`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get recipes in book');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error getting recipes in book:', error);
    throw error;
  }
};

export const createCustomRecipe = async (user_id, recipeData) => {
  try {
    const url = `${API_BASE_URL}/recipes`;
    const payload = { user_id, ...recipeData };
    
    console.log('API URL:', url);
    console.log('API Payload:', payload);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.message || 'Failed to create recipe');
      } catch {
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    }

    const result = await response.json();
    console.log('API Result:', result);
    return result;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const getCustomRecipes = async (user_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes?user_id=${user_id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get recipes');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error getting recipes:', error);
    throw error;
  }
};

export const updateCustomRecipe = async (recipeId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update recipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

export const deleteCustomRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete recipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};