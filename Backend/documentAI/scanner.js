// scanner.js
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const fs = require('fs').promises;

// --- Your Google Cloud Configuration ---
const projectId = 'my-project-patchamomma';
const location = 'us'; // e.g., 'us' or 'eu'
const processorId = '51343dbbde2fa2aa'; // Your custom processor ID
// ------------------------------------

const client = new DocumentProcessorServiceClient();

async function processReceipt(filePath, mimeType) {
  console.log("came to processor");
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  
  const imageFile = await fs.readFile(filePath);
  const encodedImage = Buffer.from(imageFile).toString('base64');

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType,
    },
  };

  const [result] = await client.processDocument(request);
  const { document } = result;
  
  // --- DIAGNOSTIC LOG 1: See everything the AI found ---
  console.log('--- Full Document AI Entity List ---');
  // This will show you the type and text of every entity detected.
  // Look here to see if your other items are being missed or mis-labeled.
  const allEntities = document.entities.map(e => ({ type: e.type, text: e.mentionText }));
  console.log(allEntities);
  console.log('------------------------------------');

  console.log('Document AI processing complete. Reconstructing line items...');

  const extractedItems = [];
  let currentLineItem = {}; // This is our temporary builder object

  for (const entity of document.entities) {
    switch (entity.type) {
      case 'Quantity':
        currentLineItem.quantity = entity.mentionText.trim();
        break;
      
      case 'Amount':
        currentLineItem.amount = entity.mentionText.trim();
        break;

      case 'Item':
        // --- DIAGNOSTIC LOG 2: See when the "Item" trigger fires ---
        console.log(`FOUND AN ITEM TRIGGER: ${entity.mentionText}`);
        
        currentLineItem.name = entity.mentionText.trim();
        
        const finalQuantity = currentLineItem.quantity || '1';

        extractedItems.push({
          name: currentLineItem.name,
          quantity: finalQuantity,
          amount: currentLineItem.amount,
        });
        
        // Reset the builder for the next line item
        currentLineItem = {}; 
        break;
      
      default:
        // --- DIAGNOSTIC LOG 3: See what is being ignored ---
        console.log(`Ignoring entity of type: '${entity.type}' with text: '${entity.mentionText}'`);
        break;
    }
  }

  console.log('Final Extracted Items:', extractedItems);
  return extractedItems;
}

module.exports = { processReceipt };