const categoriesService = require('../service/categoriesService');

const getUserCategories = async (req, res) => {
  try {
    const { userId } = req.params;
    const categories = await categoriesService.getUserCategories(userId);
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addUserCategory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { categoryName } = req.body;
    
    if (!categoryName) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const categories = await categoriesService.addUserCategory(userId, categoryName);
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserCategories,
  addUserCategory
};