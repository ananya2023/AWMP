// server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable not set.');
    console.error('Please set it before running the server: export GEMINI_API_KEY="YOUR_API_KEY_HERE"');
    process.exit(1);
}

const app = express();
const port = 3001; // Backend server port

// ------------------------
// 🟢 CORS CONFIGURATION
// ------------------------
const corsOptions = {
  origin: process.env.VITE_APP_BASE_URL || 'http://localhost:5173',  // ✅ Only allow your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true                // ✅ Important to allow cookies/auth
};

app.use(cors(corsOptions));

// Handle Preflight Requests
app.options('*', cors(corsOptions));

// ------------------------
// 🔧 MIDDLEWARES
// ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// 📦 ROUTES
// ------------------------
const router = require('./src/router/router.js');
app.use('/api/awmp', router);

// ------------------------
// 🔥 ROOT ENDPOINT
// ------------------------
app.get('/', (req, res) => {
  res.status(200).send('Meal Rescue API is up and running! Ready to scan receipts.');
});

// ------------------------
// 🚀 START SERVER
// ------------------------
app.listen(port, () => {
  console.log(`Meal Rescue backend listening on http://localhost:${port}`);
});
