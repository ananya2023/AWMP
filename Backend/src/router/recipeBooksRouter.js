const express = require('express');
const router = express.Router();
const recipeBooksController = require('../controller/recipeBooksController');

// Recipe Books routes
router.post('/recipe-books', recipeBooksController.createRecipeBook);
router.get('/recipe-books', recipeBooksController.getRecipeBooks);
router.put('/recipe-books/:bookId', recipeBooksController.updateRecipeBook);
router.delete('/recipe-books/:bookId', recipeBooksController.deleteRecipeBook);

// Recipe-Book relationship routes
router.post('/recipe-books/:bookId/recipes', recipeBooksController.addRecipeToBook);
router.delete('/recipe-books/:bookId/recipes/:recipeId', recipeBooksController.removeRecipeFromBook);
router.get('/recipe-books/:bookId/recipes', recipeBooksController.getRecipesInBook);

// Custom Recipe routes
router.post('/recipes', recipeBooksController.createCustomRecipe);
router.get('/recipes', recipeBooksController.getCustomRecipes);
router.put('/recipes/:recipeId', recipeBooksController.updateCustomRecipe);
router.delete('/recipes/:recipeId', recipeBooksController.deleteCustomRecipe);

module.exports = router;