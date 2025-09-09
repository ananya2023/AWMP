// src/config/firebase.js
const admin = require('firebase-admin');

// Check if Firebase app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  let credential;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Production: Use service account key from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Development: Use local key file
    try {
      const credentials = require('../key.json');
      credential = admin.credential.cert(credentials);
    } catch (error) {
      console.error('No Firebase credentials found. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable or add key.json file.');
      process.exit(1);
    }
  }

  admin.initializeApp({
    credential: credential
  });
}

const db = admin.firestore();

// Export the db instance
module.exports = db;