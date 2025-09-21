const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 'http://localhost:3001/api/awmp';

export const saveMealPlan = async (user_id, meal_plan) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, meal_plan }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save meal plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving meal plan:', error);
    throw error;
  }
};

export const getMealPlans = async (user_id, start_date, end_date) => {
  try {
    let url = `${API_BASE_URL}/meal-plans?user_id=${user_id}`;
    if (start_date && end_date) {
      url += `&start_date=${start_date}&end_date=${end_date}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get meal plans');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error getting meal plans:', error);
    throw error;
  }
};

export const updateMealPlan = async (user_id, meal_plan_id, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans/${user_id}/${meal_plan_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update meal plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating meal plan:', error);
    throw error;
  }
};

export const deleteMealPlan = async (user_id, meal_plan_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plans/${user_id}/${meal_plan_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete meal plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    throw error;
  }
};