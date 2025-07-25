// routes/example.router.js
const express = require('express');
const router = express.Router();
const pantryController = require('../controller/Controller.js');

// Define routes
router.get('/pantry', pantryController.getPantryList);
router.post('/pantry', pantryController.createPantryItems);



module.exports = router;