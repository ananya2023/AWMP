const db = require('../config/firebase');

const VALID_CATEGORIES = [
  'Proteins', 'Dairy', 'Vegetables', 'Grains', 
  'Canned Goods', 'Spices', 'Condiments', 'Gluten' , 'Fruits'
];

const VALID_UNITS = ['grams', 'ml', 'pieces','Dozen'];

const getNextPantryId = async () => {
  try {
    const userSnapshot = await db.collection('users')
      .orderBy('pantry_id', 'desc')
      .limit(1)
      .get();
    
    if (userSnapshot.empty) {
      return 1;  // Start from 1 instead of 100
    }
    
    const highestUser = userSnapshot.docs[0].data();
    return highestUser.pantry_id + 1;
  } catch (error) {
    console.error("Error getting next pantry ID:", error);
    // Fallback to timestamp-based ID starting from 1
    return 1 + (Date.now() % 1000);
  }
};


// USER SERVICES

exports.createUser = async (data) => {
  try {
    console.log("Creating user:", data);
    
    // Validate required fields
    const {  email, isEmailVerified, user_id } = data;
    if ( !email || !user_id) {
      throw new Error('Missing required fields: name, email, password, age, user_id');
    }

    // Check if user already exists
    const existingUserSnapshot = await db.collection('users')
      .where('user_id', '==', parseInt(user_id))
      .limit(1)
      .get();

    if (!existingUserSnapshot.empty) {
      throw new Error('User already exists with this user_id');
    }

    // Check if email already exists
    const existingEmailSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingEmailSnapshot.empty) {
      throw new Error('User already exists with this email');
    }

    // Generate unique pantry_id
    const pantryId = await getNextPantryId();

    // Create user data
    const userData = {
      name: data?.name ?  data?.name : "",
      email: data.email,
      created_at: new Date(),
      pantry_id: pantryId,
      user_id: user_id,
      is_email_verified : isEmailVerified
    };

    const userRef = await db.collection('users').add(userData);
    const userDoc = await userRef.get();
    
    console.log("Created user with ID:", userRef.id, "and pantry_id:", pantryId);
    
    return {
      user_document_id: userRef.id,
      user_data: { id: userRef.id, ...userDoc.data() }
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(`Error creating user: ${error.message}`);
  }
};

exports.getUserById = async (user_id) => {
  try {
    console.log("Getting user by user_id:", user_id);
    
    const userSnapshot = await db.collection('users')
      .where('user_id', '==', parseInt(user_id))
      .limit(1)
      .get();
    
    if (userSnapshot.empty) {
      console.log("User not found with user_id:", user_id);
      return null;
    }

    const userDoc = userSnapshot.docs[0];
    console.log("Found user:", userDoc.id);
    
    return {
      user_document_id: userDoc.id,
      user_data: { id: userDoc.id, ...userDoc.data() }
    };
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new Error(`Error getting user by ID: ${error.message}`);
  }
};

exports.getAllUsers = async () => {
  try {
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      return [];
    }
    
    return usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        user_id: data.user_id,
        email: data.email,
        name: data.name || 'User'
      };
    });
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error(`Error getting all users: ${error.message}`);
  }
};


const fs = require('fs/promises');
const { fileToGenerativePart, model } = require('../utils/geminiHelper'); // Adjust path accordingly

exports.processReceiptImage = async (imagePath, mimeType) => {
  try {
    console.log(`Processing image with Gemini 1.5 Pro: ${imagePath}`);
    
    // Check if file exists before processing
    try {
      await fs.access(imagePath);
    } catch (accessError) {
      throw new Error(`File not found: ${imagePath}`);
    }
    
    const imagePart = await fileToGenerativePart(imagePath, mimeType);

   const prompt = `
        You are a highly accurate receipt data extractor.
        Extract the following information from the receipt image.

        For each item, infer:
        - name
        - quantity
        - unit (like 'pieces', 'grams', 'ml')
        - categories (can be multiple from: Proteins, Dairy, Vegetables, Grains, Canned Goods, Spices, Condiments, Gluten)

        Format response as:
        \`\`\`json
        {
          "vendor_name": "string or null",
          "date": "YYYY-MM-DD or null",
          "items": [
            {
              "name": "string",
              "quantity": "number",
              "unit": "string",
              "categories": ["string", "string", ...],
              "price": "string"
            }
          ],
          "subtotal": "string or null",
          "tax": "string or null",
          "total": "string or null"
        }
        \`\`\`

        If any field is not found, use null. Categories should be an array, even if it's empty.
        `;


    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini Response Text:\n', text);

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let extractedData = {};
    if (jsonMatch && jsonMatch[1]) {
      extractedData = JSON.parse(jsonMatch[1]);
    } else {
      throw new Error('No JSON Markdown block found in Gemini response.');
    }

    return { ocrText: text, extractedData };

  } catch (error) {
    console.error('Error in processReceiptImage:', error.message);
    throw error;
  } finally {
    // Always clean up file
    try {
      await fs.unlink(imagePath);
      console.log(`Successfully deleted file: ${imagePath}`);
    } catch (unlinkError) {
      console.warn(`Failed to delete file ${imagePath}:`, unlinkError.message);
      // Don't throw error for cleanup failure
    }
  }
};


exports.createPantryItem = async (data) => {
  try {
    console.log("Creating pantry item:", data);

    const { user_id, item_name, category, quantity, unit, expiry_date, notes, image_url } = data;
    if (!user_id || !item_name || !category || !quantity || !unit) {
      throw new Error('Missing required fields: user_id, item_name, category, quantity, unit');
    }

    // Validate categories array
    const categories = Array.isArray(category) ? category : [category];
    const invalidCategories = categories.filter(cat => !VALID_CATEGORIES.includes(cat));

    if (invalidCategories.length > 0) {
      throw new Error(`Invalid categories found: ${invalidCategories.join(', ')}. Valid categories are: ${VALID_CATEGORIES.join(', ')}`);
    }

    // Validate unit
    if (!VALID_UNITS.includes(unit)) {
      throw new Error(`Invalid unit. Must be one of: ${VALID_UNITS.join(', ')}`);
    }

    console.log("userSnapshot")

    // Fetch User to get pantry_id
    const userSnapshot = await db.collection('users')
      .where('user_id', '==', user_id)  // Removed parseInt
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      throw new Error('User not found. Please create user account first.');
    }

    const userData = userSnapshot.docs[0].data();
    const pantryId = userData.pantry_id;

    // Create the pantry item
    const itemRef = db.collection('items').doc(); // Generate doc ID
    const now = new Date();

    const itemData = {
      id: itemRef.id,
      pantry_item_id: pantryId,
      item_name: item_name,
      category: categories,  // Store as array
      quantity: parseFloat(quantity),
      unit: unit,
      expiry_date: expiry_date || null,
      notes: notes || null,
      image_url: image_url || "https://t4.ftcdn.net/jpg/09/43/48/93/360_F_943489384_zq3u5kkefFjPY3liE6t81KrX8W3lvxSz.jpg",
      date_added: now,
      last_modified: now
    };

    await itemRef.set(itemData);
    const itemDoc = await itemRef.get();
    const savedData = itemDoc.data();

    // Convert Firestore Timestamp to ISO string
    savedData.date_added = savedData.date_added.toDate().toISOString();
    savedData.last_modified = savedData.last_modified.toDate().toISOString();

    return {
      item_id: itemRef.id,
      pantry_id: pantryId,
      item_data: { id: itemRef.id, ...savedData }
    };

  } catch (error) {
    console.error("Error creating pantry item:", error);
    throw new Error(`Error creating pantry item: ${error.message}`);
  }
};

exports.getPantryItemsByUserId = async (user_id, daysUntilExpiry = null) => {
  try {
    console.log("Getting pantry items for user:", user_id);

    // Get user's pantry_id
    const userSnapshot = await db.collection('users')
      .where('user_id', '==', user_id)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      console.log("User not found:", user_id);
      return [];
    }

    const userData = userSnapshot.docs[0].data();
    const pantryId = userData.pantry_id;

    console.log("User's pantry_id:", pantryId);

    // Get all items for this user's pantry
    const itemsSnapshot = await db.collection('items')
      .where('pantry_item_id', '==', pantryId)
      .get();

    if (itemsSnapshot.empty) {
      console.log("No items found for pantry_id:", pantryId);
      return [];
    }

    const today = new Date();

    let pantryItems = itemsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        pantry_item_id: data.pantry_item_id,
        item_name: data.item_name,
        category: data.category,
        quantity: data.quantity,
        unit: data.unit,
        expiry_date: data.expiry_date ? new Date(data.expiry_date) : null,
        notes: data.notes || null,
        image_url: data.image_url || null,
        date_added: data.date_added ? new Date(data.date_added) : null,
        last_modified: data.last_modified ? new Date(data.last_modified) : null
      };
    });

    // Filter if 'daysUntilExpiry' is provided
    if (daysUntilExpiry !== null) {
      pantryItems = pantryItems.filter(item => {
        if (!item.expiry_date) return false;
        const diffTime = item.expiry_date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= daysUntilExpiry;
      });
    }

    // Sort by expiry_date (ascending)
    pantryItems.sort((a, b) => {
      if (!a.expiry_date) return 1;
      if (!b.expiry_date) return -1;
      return a.expiry_date - b.expiry_date;
    });

    console.log(`Found ${pantryItems.length} items for user ${user_id}`);
    return pantryItems;

  } catch (error) {
    console.error("Error getting pantry items:", error);
    throw new Error(`Error getting pantry items: ${error.message}`);
  }
};

exports.deletePantryItem = async (item_id) => {
  try {
    console.log("Deleting pantry item:", item_id);
    
    const itemRef = db.collection('items').doc(item_id);
    const itemDoc = await itemRef.get();
    
    if (!itemDoc.exists) {
      throw new Error('Pantry item not found');
    }
    
    await itemRef.delete();
    console.log("Pantry item deleted successfully:", item_id);
    
  } catch (error) {
    console.error("Error deleting pantry item:", error);
    throw new Error(`Error deleting pantry item: ${error.message}`);
  }
};

exports.updatePantryItem = async (item_id, updateData) => {
  try {
    console.log("Updating pantry item:", item_id, updateData);
    
    const itemRef = db.collection('items').doc(item_id);
    const itemDoc = await itemRef.get();
    
    if (!itemDoc.exists) {
      throw new Error('Pantry item not found');
    }
    
    const updatedData = {
      ...updateData,
      last_modified: new Date()
    };
    
    await itemRef.update(updatedData);
    
    const updatedDoc = await itemRef.get();
    const result = updatedDoc.data();
    
    console.log("Pantry item updated successfully:", item_id);
    return { id: item_id, ...result };
    
  } catch (error) {
    console.error("Error updating pantry item:", error);
    throw new Error(`Error updating pantry item: ${error.message}`);
  }
};

exports.saveRecipe = async (user_id, recipeData) => {
  try {
    const { id, title, image, readyInMinutes, servings, sourceUrl, summary, extendedIngredients, analyzedInstructions, spoonacularScore, vegetarian, vegan, glutenFree, dairyFree, healthScore } = recipeData;
    
    const existingRecipe = await db.collection('saved_recipes')
      .where('user_id', '==', user_id)
      .where('recipe_id', '==', id)
      .limit(1)
      .get();
    
    if (!existingRecipe.empty) {
      throw new Error('Recipe already saved');
    }
    
    const recipeRef = db.collection('saved_recipes').doc();
    const savedRecipeData = {
      id: recipeRef.id,
      user_id: user_id,
      recipe_id: id,
      title: title,
      image: image || null,
      ready_in_minutes: readyInMinutes || null,
      servings: servings || null,
      source_url: sourceUrl || null,
      summary: summary || null,
      extended_ingredients: extendedIngredients || null,
      analyzed_instructions: analyzedInstructions || null,
      spoonacular_score: spoonacularScore || null,
      vegetarian: vegetarian || false,
      vegan: vegan || false,
      gluten_free: glutenFree || false,
      dairy_free: dairyFree || false,
      health_score: healthScore || null,
      date_saved: new Date()
    };
    
    await recipeRef.set(savedRecipeData);
    return { id: recipeRef.id, ...savedRecipeData };
    
  } catch (error) {
    throw new Error(`Error saving recipe: ${error.message}`);
  }
};

exports.getSavedRecipes = async (user_id) => {
  try {
    const recipesSnapshot = await db.collection('saved_recipes')
      .where('user_id', '==', user_id)
      .orderBy('date_saved', 'desc')
      .get();
    
    if (recipesSnapshot.empty) {
      return [];
    }
    
    return recipesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        user_id: data.user_id,
        recipe_id: data.recipe_id,
        title: data.title,
        image: data.image,
        ready_in_minutes: data.ready_in_minutes,
        servings: data.servings,
        source_url: data.source_url,
        summary: data.summary,
        extendedIngredients: data.extended_ingredients,
        analyzedInstructions: data.analyzed_instructions,
        spoonacularScore: data.spoonacular_score,
        vegetarian: data.vegetarian,
        vegan: data.vegan,
        glutenFree: data.gluten_free,
        dairyFree: data.dairy_free,
        healthScore: data.health_score,
        date_saved: data.date_saved ? data.date_saved.toDate() : null
      };
    });
    
  } catch (error) {
    throw new Error(`Error getting saved recipes: ${error.message}`);
  }
};

exports.deleteSavedRecipe = async (user_id, recipe_id) => {
  try {
    const recipeSnapshot = await db.collection('saved_recipes')
      .where('user_id', '==', user_id)
      .where('recipe_id', '==', recipe_id)
      .limit(1)
      .get();
    
    if (recipeSnapshot.empty) {
      throw new Error('Saved recipe not found');
    }
    
    await recipeSnapshot.docs[0].ref.delete();
    
  } catch (error) {
    throw new Error(`Error deleting saved recipe: ${error.message}`);
  }
};

exports.saveMealPlan = async (user_id, mealPlanData) => {
  try {
    const { date, meals } = mealPlanData;
    
    // Check if meal plan already exists for this date
    const existingPlanSnapshot = await db.collection('meal_plans')
      .where('user_id', '==', user_id)
      .where('date', '==', date)
      .limit(1)
      .get();
    
    if (!existingPlanSnapshot.empty) {
      // Update existing meal plan
      const existingDoc = existingPlanSnapshot.docs[0];
      const updatedData = {
        meals: meals,
        updated_at: new Date()
      };
      
      await existingDoc.ref.update(updatedData);
      
      const updatedDoc = await existingDoc.ref.get();
      const result = updatedDoc.data();
      
      return {
        id: existingDoc.id,
        user_id: result.user_id,
        date: result.date,
        meals: result.meals,
        created_at: result.created_at ? result.created_at.toDate() : null,
        updated_at: result.updated_at ? result.updated_at.toDate() : null
      };
    } else {
      // Create new meal plan
      const mealPlanRef = db.collection('meal_plans').doc();
      const savedMealPlan = {
        id: mealPlanRef.id,
        user_id: user_id,
        date: date,
        meals: meals,
        created_at: new Date()
      };
      
      await mealPlanRef.set(savedMealPlan);
      return { id: mealPlanRef.id, ...savedMealPlan };
    }
    
  } catch (error) {
    throw new Error(`Error saving meal plan: ${error.message}`);
  }
};

exports.getMealPlans = async (user_id, startDate, endDate) => {
  try {
    const mealPlansSnapshot = await db.collection('meal_plans')
      .where('user_id', '==', user_id)
      .get();
    
    if (mealPlansSnapshot.empty) {
      return [];
    }
    
    let mealPlans = mealPlansSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        user_id: data.user_id,
        date: data.date,
        meals: data.meals,
        created_at: data.created_at ? data.created_at.toDate() : null
      };
    });
    
    // Filter by date range on client side
    if (startDate && endDate) {
      mealPlans = mealPlans.filter(plan => 
        plan.date >= startDate && plan.date <= endDate
      );
    }
    
    // Sort by date descending
    mealPlans.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return mealPlans;
    
  } catch (error) {
    throw new Error(`Error getting meal plans: ${error.message}`);
  }
};

exports.updateMealPlan = async (user_id, meal_plan_id, updateData) => {
  try {
    const mealPlanRef = db.collection('meal_plans').doc(meal_plan_id);
    const mealPlanDoc = await mealPlanRef.get();
    
    if (!mealPlanDoc.exists) {
      throw new Error('Meal plan not found');
    }
    
    const mealPlanData = mealPlanDoc.data();
    if (mealPlanData.user_id !== user_id) {
      throw new Error('Unauthorized to update this meal plan');
    }
    
    const updatedData = {
      ...updateData,
      updated_at: new Date()
    };
    
    await mealPlanRef.update(updatedData);
    
    const updatedDoc = await mealPlanRef.get();
    const result = updatedDoc.data();
    
    return {
      id: meal_plan_id,
      user_id: result.user_id,
      date: result.date,
      meals: result.meals,
      created_at: result.created_at ? result.created_at.toDate() : null,
      updated_at: result.updated_at ? result.updated_at.toDate() : null
    };
    
  } catch (error) {
    throw new Error(`Error updating meal plan: ${error.message}`);
  }
};

exports.deleteMealPlan = async (user_id, meal_plan_id) => {
  try {
    const mealPlanRef = db.collection('meal_plans').doc(meal_plan_id);
    const mealPlanDoc = await mealPlanRef.get();
    
    if (!mealPlanDoc.exists) {
      throw new Error('Meal plan not found');
    }
    
    const mealPlanData = mealPlanDoc.data();
    if (mealPlanData.user_id !== user_id) {
      throw new Error('Unauthorized to delete this meal plan');
    }
    
    await mealPlanRef.delete();
    
  } catch (error) {
    throw new Error(`Error deleting meal plan: ${error.message}`);
  }
};
