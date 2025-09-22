const API_BASE_URL = 'http://localhost:3008/api/awmp';

export const getUserCategories = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/categories/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user categories');
  }
  return response.json();
};

export const addUserCategory = async (userId, categoryName) => {
  const response = await fetch(`${API_BASE_URL}/categories/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryName }),
  });
  if (!response.ok) {
    throw new Error('Failed to add user category');
  }
  return response.json();
};