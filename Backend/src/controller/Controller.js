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

exports.deletePantryItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    if (!item_id) {
      return res.status(400).json({ message: 'item_id is required' });
    }
    
    await pantryService.deletePantryItem(item_id);
    res.status(200).json({
      message: 'Pantry item deleted successfully'
    });
  } catch (error) {
    console.error("Error in deletePantryItem:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updatePantryItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const updateData = req.body;
    
    if (!item_id) {
      return res.status(400).json({ message: 'item_id is required' });
    }
    
    const updatedItem = await pantryService.updatePantryItem(item_id, updateData);
    res.status(200).json({
      message: 'Pantry item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error("Error in updatePantryItem:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.saveRecipe = async (req, res) => {
  try {
    const { user_id, recipe } = req.body;
    
    if (!user_id || !recipe) {
      return res.status(400).json({ message: 'user_id and recipe are required' });
    }
    
    const savedRecipe = await pantryService.saveRecipe(user_id, recipe);
    res.status(201).json({
      message: 'Recipe saved successfully',
      data: savedRecipe
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedRecipes = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
    
    const savedRecipes = await pantryService.getSavedRecipes(user_id);
    res.status(200).json({
      message: 'Saved recipes retrieved successfully',
      data: savedRecipes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSavedRecipe = async (req, res) => {
  try {
    const { user_id, recipe_id } = req.params;
    
    if (!user_id || !recipe_id) {
      return res.status(400).json({ message: 'user_id and recipe_id are required' });
    }
    
    await pantryService.deleteSavedRecipe(user_id, parseInt(recipe_id));
    res.status(200).json({
      message: 'Recipe removed from saved recipes'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveMealPlan = async (req, res) => {
  try {
    const { user_id, meal_plan } = req.body;
    
    if (!user_id || !meal_plan) {
      return res.status(400).json({ message: 'user_id and meal_plan are required' });
    }
    
    const savedMealPlan = await pantryService.saveMealPlan(user_id, meal_plan);
    res.status(201).json({
      message: 'Meal plan saved successfully',
      data: savedMealPlan
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMealPlans = async (req, res) => {
  try {
    const { user_id, start_date, end_date } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
    
    const mealPlans = await pantryService.getMealPlans(user_id, start_date, end_date);
    res.status(200).json({
      message: 'Meal plans retrieved successfully',
      data: mealPlans
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    const { user_id, meal_plan_id } = req.params;
    const updateData = req.body;
    
    if (!user_id || !meal_plan_id) {
      return res.status(400).json({ message: 'user_id and meal_plan_id are required' });
    }
    
    const updatedMealPlan = await pantryService.updateMealPlan(user_id, meal_plan_id, updateData);
    res.status(200).json({
      message: 'Meal plan updated successfully',
      data: updatedMealPlan
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    const { user_id, meal_plan_id } = req.params;
    
    if (!user_id || !meal_plan_id) {
      return res.status(400).json({ message: 'user_id and meal_plan_id are required' });
    }
    
    await pantryService.deleteMealPlan(user_id, meal_plan_id);
    res.status(200).json({
      message: 'Meal plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};