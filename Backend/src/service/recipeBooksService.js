const db = require('../config/firebase');
const admin = require('firebase-admin');

const RECIPE_BOOKS_COLLECTION = 'recipe_books';
const BOOK_RECIPES_COLLECTION = 'book_recipes';

const createRecipeBook = async (bookData) => {
  try {
    const docRef = await db.collection(RECIPE_BOOKS_COLLECTION).add(bookData);
    return { id: docRef.id, ...bookData };
  } catch (error) {
    console.error('Error creating recipe book:', error);
    throw error;
  }
};

const getRecipeBooksByUserId = async (userId) => {
  try {
    const snapshot = await db.collection(RECIPE_BOOKS_COLLECTION)
      .where('user_id', '==', userId)
      .get();

    const books = [];
    for (const doc of snapshot.docs) {
      const bookData = { id: doc.id, ...doc.data() };
      
      // Convert Firestore timestamps to ISO strings
      if (bookData.created_at?.toDate) {
        bookData.created_at = bookData.created_at.toDate().toISOString();
      }
      
      // Get recipe count for each book
      const recipeCountSnapshot = await db.collection(BOOK_RECIPES_COLLECTION)
        .where('book_id', '==', doc.id)
        .get();
      
      bookData.recipe_count = recipeCountSnapshot.size;
      books.push(bookData);
    }

    // Sort by created_at in memory
    return books.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error fetching recipe books:', error);
    throw error;
  }
};

const updateRecipeBook = async (bookId, updateData) => {
  try {
    await db.collection(RECIPE_BOOKS_COLLECTION).doc(bookId).update(updateData);
    return { id: bookId, ...updateData };
  } catch (error) {
    console.error('Error updating recipe book:', error);
    throw error;
  }
};

const deleteRecipeBook = async (bookId) => {
  try {
    // Delete all recipe-book relationships first
    const bookRecipesSnapshot = await db.collection(BOOK_RECIPES_COLLECTION)
      .where('book_id', '==', bookId)
      .get();

    const batch = db.batch();
    bookRecipesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete the book itself
    batch.delete(db.collection(RECIPE_BOOKS_COLLECTION).doc(bookId));
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting recipe book:', error);
    throw error;
  }
};

const addRecipeToBook = async (bookId, recipeId) => {
  try {
    // Check if recipe is already in the book
    const existingSnapshot = await db.collection(BOOK_RECIPES_COLLECTION)
      .where('book_id', '==', bookId)
      .where('recipe_id', '==', recipeId)
      .get();

    if (!existingSnapshot.empty) {
      throw new Error('Recipe is already in this book');
    }

    const relationshipData = {
      book_id: bookId,
      recipe_id: recipeId,
      added_at: new Date()
    };

    const docRef = await db.collection(BOOK_RECIPES_COLLECTION).add(relationshipData);
    return { id: docRef.id, ...relationshipData };
  } catch (error) {
    console.error('Error adding recipe to book:', error);
    throw error;
  }
};

const removeRecipeFromBook = async (bookId, recipeId) => {
  try {
    const snapshot = await db.collection(BOOK_RECIPES_COLLECTION)
      .where('book_id', '==', bookId)
      .where('recipe_id', '==', recipeId)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error('Error removing recipe from book:', error);
    throw error;
  }
};

const getRecipesInBook = async (bookId) => {
  try {
    const bookRecipesSnapshot = await db.collection(BOOK_RECIPES_COLLECTION)
      .where('book_id', '==', bookId)
      .get();

    const recipeIds = bookRecipesSnapshot.docs.map(doc => doc.data().recipe_id);
    
    if (recipeIds.length === 0) {
      return [];
    }

    const recipes = [];
    
    // Get recipes from both saved_recipes and custom_recipes collections
    const [savedRecipesSnapshot, customRecipesSnapshot] = await Promise.all([
      db.collection('saved_recipes').where('recipe_id', 'in', recipeIds).get(),
      db.collection('custom_recipes').where(admin.firestore.FieldPath.documentId(), 'in', recipeIds).get()
    ]);

    // Add saved recipes
    savedRecipesSnapshot.docs.forEach(doc => {
      recipes.push({ id: doc.id, ...doc.data(), type: 'saved' });
    });

    // Add custom recipes with timestamp conversion
    customRecipesSnapshot.docs.forEach(doc => {
      const data = { id: doc.id, ...doc.data(), type: 'custom' };
      if (data.created_at?.toDate) {
        data.created_at = data.created_at.toDate().toISOString();
      }
      // Map custom recipe fields to match saved recipe format
      data.title = data.name;
      data.ready_in_minutes = data.prep_time;
      data.image = data.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';
      recipes.push(data);
    });

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes in book:', error);
    throw error;
  }
};

const createCustomRecipe = async (recipeData) => {
  try {
    const docRef = await db.collection('custom_recipes').add(recipeData);
    return { id: docRef.id, ...recipeData };
  } catch (error) {
    console.error('Error creating custom recipe:', error);
    throw error;
  }
};

const getCustomRecipesByUserId = async (userId) => {
  try {
    const snapshot = await db.collection('custom_recipes')
      .where('user_id', '==', userId)
      .get();

    const recipes = snapshot.docs.map(doc => {
      const data = { id: doc.id, ...doc.data() };
      // Convert Firestore timestamps to ISO strings
      if (data.created_at?.toDate) {
        data.created_at = data.created_at.toDate().toISOString();
      }
      return data;
    });
    
    // Sort by created_at in memory
    return recipes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error fetching custom recipes:', error);
    throw error;
  }
};

const updateCustomRecipe = async (recipeId, updateData) => {
  try {
    await db.collection('custom_recipes').doc(recipeId).update(updateData);
    return { id: recipeId, ...updateData };
  } catch (error) {
    console.error('Error updating custom recipe:', error);
    throw error;
  }
};

const deleteCustomRecipe = async (recipeId) => {
  try {
    await db.collection('custom_recipes').doc(recipeId).delete();
  } catch (error) {
    console.error('Error deleting custom recipe:', error);
    throw error;
  }
};

module.exports = {
  createRecipeBook,
  getRecipeBooksByUserId,
  updateRecipeBook,
  deleteRecipeBook,
  addRecipeToBook,
  removeRecipeFromBook,
  getRecipesInBook,
  createCustomRecipe,
  getCustomRecipesByUserId,
  updateCustomRecipe,
  deleteCustomRecipe
};