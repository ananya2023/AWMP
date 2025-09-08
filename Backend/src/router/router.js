const express = require('express');
const router = express.Router();
const pantryController = require('../controller/Controller');

const notificationController = require('../controller/notificationController');
const profileController = require('../controller/profileController');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });



// USER ROUTES

// Get Profile Route
router.get('/profile/:user_id', profileController.getProfile);

// Update Profile Route
router.put('/update-profile', profileController.updateProfile);

// POST /api/users - Create new user (Sign up)
router.post('/create-user', pantryController.createUser);

// GET /api/users/:user_id - Get user details by user_id
router.get('/users/:user_id', pantryController.getUserById);

// PANTRY ITEM ROUTES 
// Scan Pantry Items
router.post('/upload-receipt', upload.single('receiptImage'), pantryController.uploadReceipt);

// POST /api/pantry-items - Create new pantry item
router.post('/pantry-items', pantryController.createPantryItems);

// GET /api/pantry-items?user_id=123 - Get all pantry items for a user
router.get('/pantry-items', pantryController.getPantryItemsByUserId);

// DELETE /api/pantry-items/:item_id - Delete a pantry item
router.delete('/pantry-items/:item_id', pantryController.deletePantryItem);

// PUT /api/pantry-items/:item_id - Update a pantry item
router.put('/pantry-items/:item_id', pantryController.updatePantryItem);

router.post('/send-expiry-notification', notificationController.sendExpiryNotification);

// SAVED RECIPES ROUTES
// POST /api/saved-recipes - Save a recipe
router.post('/saved-recipes', pantryController.saveRecipe);

// GET /api/saved-recipes?user_id=123 - Get saved recipes for a user
router.get('/saved-recipes', pantryController.getSavedRecipes);

// DELETE /api/saved-recipes/:user_id/:recipe_id - Delete a saved recipe
router.delete('/saved-recipes/:user_id/:recipe_id', pantryController.deleteSavedRecipe);

// MEAL PLANS ROUTES
// POST /api/meal-plans - Save a meal plan
router.post('/meal-plans', pantryController.saveMealPlan);

// GET /api/meal-plans?user_id=123&start_date=2024-01-01&end_date=2024-01-07 - Get meal plans
router.get('/meal-plans', pantryController.getMealPlans);

// PUT /api/meal-plans/:user_id/:meal_plan_id - Update a meal plan
router.put('/meal-plans/:user_id/:meal_plan_id', pantryController.updateMealPlan);

// DELETE /api/meal-plans/:user_id/:meal_plan_id - Delete a meal plan
router.delete('/meal-plans/:user_id/:meal_plan_id', pantryController.deleteMealPlan);

module.exports = router;