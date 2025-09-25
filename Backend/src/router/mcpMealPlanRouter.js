const express = require('express');
const { getRecipesByIngredients, generateWeeklyMealPlan, createShoppingList } = require('../controller/mcpMealPlanController');

const router = express.Router();

router.post('/recipes/by-ingredients', getRecipesByIngredients);
router.post('/meal-plan/generate', generateWeeklyMealPlan);
router.post('/shopping-list/generate', createShoppingList);

module.exports = router;