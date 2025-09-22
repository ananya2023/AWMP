const recipeBooksService = require('../service/recipeBooksService');

const createRecipeBook = async (req, res) => {
  try {
    const { user_id, name, description, color, icon, isPublic } = req.body;
    
    if (!user_id || !name) {
      return res.status(400).json({ message: 'User ID and name are required' });
    }

    const bookData = {
      user_id,
      name,
      description: description || '',
      color: color || 'from-emerald-500 to-teal-500',
      icon: icon || '📚',
      is_public: isPublic || false,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await recipeBooksService.createRecipeBook(bookData);
    res.status(201).json({ message: 'Recipe book created successfully', data: result });
  } catch (error) {
    console.error('Error creating recipe book:', error);
    res.status(500).json({ message: 'Failed to create recipe book' });
  }
};

const getRecipeBooks = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const books = await recipeBooksService.getRecipeBooksByUserId(user_id);
    res.status(200).json({ data: books });
  } catch (error) {
    console.error('Error fetching recipe books:', error);
    res.status(500).json({ message: 'Failed to fetch recipe books' });
  }
};

const updateRecipeBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updateData = { ...req.body, updated_at: new Date() };

    const result = await recipeBooksService.updateRecipeBook(bookId, updateData);
    res.status(200).json({ message: 'Recipe book updated successfully', data: result });
  } catch (error) {
    console.error('Error updating recipe book:', error);
    res.status(500).json({ message: 'Failed to update recipe book' });
  }
};

const deleteRecipeBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    await recipeBooksService.deleteRecipeBook(bookId);
    res.status(200).json({ message: 'Recipe book deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe book:', error);
    res.status(500).json({ message: 'Failed to delete recipe book' });
  }
};

const addRecipeToBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { recipe_id } = req.body;

    if (!recipe_id) {
      return res.status(400).json({ message: 'Recipe ID is required' });
    }

    const result = await recipeBooksService.addRecipeToBook(bookId, recipe_id);
    res.status(201).json({ message: 'Recipe added to book successfully', data: result });
  } catch (error) {
    console.error('Error adding recipe to book:', error);
    res.status(500).json({ message: 'Failed to add recipe to book' });
  }
};

const removeRecipeFromBook = async (req, res) => {
  try {
    const { bookId, recipeId } = req.params;
    
    await recipeBooksService.removeRecipeFromBook(bookId, recipeId);
    res.status(200).json({ message: 'Recipe removed from book successfully' });
  } catch (error) {
    console.error('Error removing recipe from book:', error);
    res.status(500).json({ message: 'Failed to remove recipe from book' });
  }
};

const getRecipesInBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const recipes = await recipeBooksService.getRecipesInBook(bookId);
    res.status(200).json({ data: recipes });
  } catch (error) {
    console.error('Error fetching recipes in book:', error);
    res.status(500).json({ message: 'Failed to fetch recipes in book' });
  }
};

const createCustomRecipe = async (req, res) => {
  try {
    const { user_id, name, description, tags, prep_time, servings, ingredients, steps, notes } = req.body;
    
    if (!user_id || !name) {
      return res.status(400).json({ message: 'User ID and name are required' });
    }

    const recipeData = {
      user_id,
      name,
      description: description || '',
      tags: tags || [],
      prep_time: prep_time || 0,
      servings: servings || 1,
      ingredients: ingredients || [],
      steps: steps || [],
      notes: notes || '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await recipeBooksService.createCustomRecipe(recipeData);
    res.status(201).json({ message: 'Recipe created successfully', data: result });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Failed to create recipe' });
  }
};

const getCustomRecipes = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const recipes = await recipeBooksService.getCustomRecipesByUserId(user_id);
    res.status(200).json({ data: recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

const updateCustomRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const updateData = { ...req.body, updated_at: new Date() };

    const result = await recipeBooksService.updateCustomRecipe(recipeId, updateData);
    res.status(200).json({ message: 'Recipe updated successfully', data: result });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Failed to update recipe' });
  }
};

const deleteCustomRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    await recipeBooksService.deleteCustomRecipe(recipeId);
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Failed to delete recipe' });
  }
};

module.exports = {
  createRecipeBook,
  getRecipeBooks,
  updateRecipeBook,
  deleteRecipeBook,
  addRecipeToBook,
  removeRecipeFromBook,
  getRecipesInBook,
  createCustomRecipe,
  getCustomRecipes,
  updateCustomRecipe,
  deleteCustomRecipe
};