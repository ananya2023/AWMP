const db = require('../config/firebase');

const getUserCategories = async (userId) => {
  try {
    const doc = await db.collection('user_categories').doc(userId).get();
    if (doc.exists) {
      return doc.data().categories || [];
    }
    return [];
  } catch (error) {
    throw new Error(`Failed to get user categories: ${error.message}`);
  }
};

const addUserCategory = async (userId, categoryName) => {
  try {
    const docRef = db.collection('user_categories').doc(userId);
    const doc = await docRef.get();
    
    let categories = [];
    if (doc.exists) {
      categories = doc.data().categories || [];
    }
    
    if (!categories.includes(categoryName)) {
      categories.push(categoryName);
      await docRef.set({ categories }, { merge: true });
    }
    
    return categories;
  } catch (error) {
    throw new Error(`Failed to add user category: ${error.message}`);
  }
};

module.exports = {
  getUserCategories,
  addUserCategory
};