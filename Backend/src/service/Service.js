const db = require('../config/firebase');

const VALID_CATEGORIES = [
  'Proteins', 'Dairy', 'Vegetables', 'Grains', 
  'Canned Goods', 'Spices', 'Condiments', 'Gluten'
];

const VALID_UNITS = ['grams', 'ml', 'pieces', 'kg', 'liters', 'cups', 'tablespoons', 'teaspoons'];

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
