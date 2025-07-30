const pantryService = require('../service/Service');


exports.createUser = async (req, res) => {
  try {
  
    const { name, email, password, age, user_id } = req.body;
    if (!name || !email || !password || !age || !user_id) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, password, age, user_id' 
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


exports.createPantryItem = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("createPantryItem controller started");
   
    const { user_id, item_name, category, quantity, unit, expiry_date } = req.body;
    if (!user_id || !item_name || !category || !quantity || !unit || !expiry_date) {
      return res.status(400).json({ 
        message: 'Missing required fields: user_id, item_name, category, quantity, unit, expiry_date' 
      });
    }

    const newPantryItem = await pantryService.createPantryItem(req.body);
    res.status(201).json({
      message: 'Pantry item created successfully',
      data: newPantryItem
    });
    console.log("createPantryItem controller finished");
  } catch (error) {
    console.error("Error in createPantryItem:", error);
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