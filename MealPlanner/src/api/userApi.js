// src/api/pantry.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 'http://localhost:3008/api/awmp';

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


export const getUserProfile = async (user_id) => {
  try {
    const response = await axios.get(`${BASE_URL}/profile/${user_id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    console.log(profileData, "pe");
    const response = await axios.put(
      `${BASE_URL}/update-profile`,
      profileData,
      { withCredentials: true }  
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

