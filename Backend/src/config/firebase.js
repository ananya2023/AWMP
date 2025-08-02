// src/config/firebase.js
const admin = require('firebase-admin');
const credentials = require('../key.json'); // Adjust path as needed

// Check if Firebase app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials)
  });
}

const db = admin.firestore();

// Export the db instance
module.exports = db;