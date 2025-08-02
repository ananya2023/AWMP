const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

async function fileToGenerativePart(path, mimeType) {
  const data = await fs.readFile(path);
  return {
    inlineData: {
      data: data.toString('base64'),
      mimeType
    }
  };
}

module.exports = { fileToGenerativePart, model };
