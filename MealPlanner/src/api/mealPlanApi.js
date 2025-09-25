const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 'http://localhost:3008/api/awmp';

export const getMealPlans = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans?user_id=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch meal plans');
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
};

export const saveMealPlan = async (mealPlanData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mealPlanData),
    });
    if (!response.ok) throw new Error('Failed to save meal plan');
    return await response.json();
  } catch (error) {
    console.error('Error saving meal plan:', error);
    throw error;
  }
};

export const updateMealPlan = async (userId, mealPlanId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans/${userId}/${mealPlanId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update meal plan');
    return await response.json();
  } catch (error) {
    console.error('Error updating meal plan:', error);
    throw error;
  }
};

export const deleteMealPlan = async (userId, mealPlanId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans/${userId}/${mealPlanId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete meal plan');
    return await response.json();
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    throw error;
  }
};