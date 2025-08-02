// src/api/pantry.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/awmp'; // Replace with actual base URL

export const addPantryItem = async (itemData) => {
  try {
    console.log(itemData)
    const response = await axios.post(`${BASE_URL}/pantry-items`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error adding pantry item:', error);
    throw error;
  }
};


export const getPantryItems = async (user_id) => {
  try {
    const response = await axios.get(`${BASE_URL}/pantry-items`, {
      params: { user_id }
    });
    return response.data.data;  // Assuming response shape { data: [] }
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    throw error;
  }
};

