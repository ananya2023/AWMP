// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const { processReceipt } = require('./documentAI/scanner'); // We'll move your logic here

const app = express();
const port = 3001; // Port for our backend server
const corsOptions = {
  origin: '*',
};


// Use CORS to allow communication from your React app (which runs on a different port)
app.use(cors(corsOptions));

// Configure Multer to handle file uploads. It will save files temporarily.
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.status(200).send('Meal Rescue API is up and running! Ready to scan receipts.');
});

// Define the API endpoint for scanning receipts
app.post('/api/scan-receipt', upload.single('receipt'), async (req, res) => {
  // 'receipt' is the field name we'll use in the frontend
  if (!req.file) {
    return res.status(400).json({ error: 'No receipt file uploaded.' });
  }

  try {
    console.log(`Processing file: ${req.file.path}`);
    // Call our Document AI processing function
    const items = await processReceipt(req.file.path, req.file.mimetype);

    // Send the extracted items back to the frontend
    res.json(items);

  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).json({ error: 'Failed to process document.' });
  } finally {
    // Clean up the uploaded file after processing
    await fs.unlink(req.file.path);
  }
});

app.listen(port, () => {
  console.log(`Meal Rescue backend listening on http://localhost:${port}`);
});