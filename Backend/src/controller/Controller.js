const pantryService = require('../service/Service');
const fs = require('fs/promises')
const db = require('../config/firebase');

exports.createUser = async (req, res) => {
  try {
  
    const { user_id, email, isEmailVerified } = req.body;
    if (!email  || !user_id) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, age, user_id' 
      });
    }

    const newUser = await pantryService.createUser(req.body);
    res.status(201).json({
      message: 'User created successfully',
      data: newUser
    });
    console.log("createUser controller finished");
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log("Getting user by ID:", user_id);
    
    const user = await pantryService.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ message: error.message });
  }
};



exports.uploadReceipt = async (req, res) => {
  console.log("REQ FILE =>", req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const imagePath = req.file.path;
  const mimeType = req.file.mimetype;

  try {
    const { ocrText, extractedData } = await pantryService.processReceiptImage(imagePath, mimeType);

    res.json({
      message: 'Prompt-based OCR successful using Gemini 1.5 Pro',
      ocrText,
      extractedData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing receipt with AI.', error: error.message });
  }
};



// pantryController.js
exports.createPantryItems = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { user_id, items } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: user_id, items[]' });
    }

    // Fetch pantry_id from user_id
    const userSnapshot = await db.collection('users').where('user_id', '==', user_id).limit(1).get();
    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'User not found. Please create a user account first.' });
    }

    const pantry_id = userSnapshot.docs[0].data().pantry_id;
    console.log(pantry_id , "----------------------------------------")

    const createdItems = [];
    for (const item of items) {
      console.log(item , "item")
      const { name, categories, quantity, unit, expiryDate, notes, image_url } = item;

      // Validation
      if (!name || !categories || !quantity || !unit || !expiryDate) {
        return res.status(400).json({ message: 'Missing required fields for an item: name, category, quantity, unit, expiry_date' });
      }

      const itemData = {
        user_id,
        pantry_id,
        item_name: name,
        category : categories,
        quantity,
        unit,
        expiry_date: expiryDate,
        notes: notes || '',
        image_url: image_url || null
      };

      const savedItem = await pantryService.createPantryItem(itemData);
      createdItems.push(savedItem);
    }

    res.status(201).json({
      message: 'Pantry items added successfully',
      data: createdItems
    });

  } catch (error) {
    console.error("Error in createPantryItems:", error);
    res.status(500).json({ message: error.message });
  }
};



exports.getPantryItemsByUserId = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required as query parameter' });
    }
    
    console.log("Getting pantry items for user:", user_id);
    const pantryItems = await pantryService.getPantryItemsByUserId(user_id);
    console.log("Pantry items retrieved:", pantryItems.length);
    res.status(200).json({
      message: 'Pantry items retrieved successfully',
      count: pantryItems.length,
      data: pantryItems
    });
  } catch (error) {
    console.error("Error in getPantryItemsByUserId:", error);
    res.status(500).json({ message: error.message });
  }
};