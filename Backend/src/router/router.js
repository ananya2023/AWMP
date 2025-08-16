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


module.exports = router;