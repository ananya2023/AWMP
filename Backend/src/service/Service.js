// services/example.service.js
const admin = require('firebase-admin');
const db = admin.firestore();

// Service functions
exports.getPantryList = async () => {
    return "heyyy"
  const exampleCollection = await db.collection('examples').get();
  return exampleCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.createPantryItems = async (data) => {
    try {
        // return "heyyy"
    //   const exampleRef = await db.collection('examples').add(data);
    //   const exampleDoc = await exampleRef.get();
    //   return { id: exampleDoc.id, ...exampleDoc.data() };
      const pantryItem = {
        pantry_id : "100",
        user_id: data.user_id, // Foreign Key, Id comes from firebase
        item_name: data.item_name,
        category: data.category, // Enum  (Proteins, Dairy, Vegetables, Grains, Canned Goods, Spices, Condiments,Gluten)
        quantity: data.quantity,
        unit: data.unit, // Enum(e.g.,  grams, ml,  pieces).
        expiry_date: new Date(),
        notes: data.notes || null, // Optional
        image_url: "https://t4.ftcdn.net/jpg/09/43/48/93/360_F_943489384_zq3u5kkefFjPY3liE6t81KrX8W3lvxSz.jpg",
        date_added: new Date(),
        last_modified: new Date(),
      };
  
      const pantryRef = await db.collection('pantries').add(pantryItem);
      const pantryDoc = await pantryRef.get();
      return { id: pantryDoc.id, ...pantryDoc.data() };
    } catch (error) {
      throw new Error(`Error creating example: ${error.message}`);
    }
  };