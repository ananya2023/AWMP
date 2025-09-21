const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

async function fileToGenerativePart(path, mimeType) {
  try {
    console.log(`Reading file for Gemini processing: ${path}`);
    const data = await fs.readFile(path);
    console.log(`Successfully read file: ${path}, size: ${data.length} bytes`);
    return {
      inlineData: {
        data: data.toString('base64'),
        mimeType
      }
    };
  } catch (error) {
    console.error(`Error reading file ${path}:`, error.message);
    throw new Error(`Failed to read file for processing: ${error.message}`);
  }
}

module.exports = { fileToGenerativePart, model };
