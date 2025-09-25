const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const saveUserData = (userData) => {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem('user_data', JSON.stringify(userData));
      console.log('Data saved to localStorage');
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  } else {
    console.warn('localStorage not available');
  }
};

export const getUserData = () => {
  if (isLocalStorageAvailable()) {
    try {
      const data = localStorage.getItem('user_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  }
  return null;
};

export const clearUserData = () => {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
};