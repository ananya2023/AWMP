// server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();
// const credentials = require('./key.json');


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable not set.');
    console.error('Please set it before running the server: export GEMINI_API_KEY="YOUR_API_KEY_HERE"');
    process.exit(1); // Exit if API key is missing
}


const app = express();
const port = 3001; // Port for our backend server
const corsOptions = {
  origin: '*',
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Import your router and potentially pass the 'db' instance if needed
// If your router then imports the service, the 'admin' instance will already be initialized.
const pantryRouter = require('./src/router/router.js');
app.use('/api/awmp', pantryRouter); // Your router will now correctly use the initialized admin instance

app.get('/', (req, res) => {
  res.status(200).send('Meal Rescue API is up and running! Ready to scan receipts.');
});

app.listen(port, () => {
  console.log(`Meal Rescue backend listening on http://localhost:${port}`);
});

// module.exports = db