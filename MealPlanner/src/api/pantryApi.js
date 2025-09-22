// src/api/pantry.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 'http://localhost:3008/api/awmp';


export const addPantryItems = async (items) => {
  const userData = JSON.parse(localStorage.getItem('user_data')); // Assuming user_id stored in localStorage
  if (!userData?.user_id) {
    throw new Error('User not logged in');
  }

//   const user_id = !userData?.user_id

  const payload = {
    user_id  :userData?.user_id,
    items // Send array of items
  };

  console.log(payload)

  const response = await axios.post(`${BASE_URL}/pantry-items`, payload);
  return response.data;
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


export const getScannedItems = async (formData) => {
  try {
    console.log("getScannedItems");

    const response = await axios.post(`${BASE_URL}/upload-receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;  // response shape { message, ocrText, extractedData }
  } catch (error) {
    console.error('Error scanning receipt:', error);
    throw error;
  }
};

export const deletePantryItem = async (itemId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/pantry-items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting pantry item:', error);
    throw error;
  }
};

export const updatePantryItem = async (itemId, itemData) => {
  try {
    const response = await axios.put(`${BASE_URL}/pantry-items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating pantry item:', error);
    throw error;
  }
};


