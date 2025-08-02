const express = require('express');
const router = express.Router();
const pantryController = require('../controller/Controller');

// USER ROUTES

// POST /api/users - Create new user (Sign up)
router.post('/create-user', pantryController.createUser);

// GET /api/users/:user_id - Get user details by user_id
router.get('/users/:user_id', pantryController.getUserById);

// PANTRY ITEM ROUTES

// POST /api/pantry-items - Create new pantry item
router.post('/pantry-items', pantryController.createPantryItem);

// GET /api/pantry-items?user_id=123 - Get all pantry items for a user
router.get('/pantry-items', pantryController.getPantryItemsByUserId);

module.exports = router;