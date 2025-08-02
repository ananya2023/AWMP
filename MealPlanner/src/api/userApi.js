// src/api/pantry.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/awmp'; // Replace with actual base URL

export const createUser = async (itemData) => {
  try {
    console.log(itemData)
    const response = await axios.post(`${BASE_URL}/create-user`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
