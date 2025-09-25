export const saveUserData = (userData) => {
  localStorage.setItem('user_data', JSON.stringify(userData));
};

export const getUserData = () => {
  const data = localStorage.getItem('user_data');
  return data ? JSON.parse(data) : null;
};

export const clearUserData = () => {
  localStorage.removeItem('user_data');
};