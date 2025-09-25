const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 'http://localhost:3008/api/awmp';

export const getSmartRecipeSuggestions = async (userId, day, mealType) => {
  try {
    const isWeekend = ['saturday', 'sunday'].includes(day.toLowerCase());
    const complexity = isWeekend ? 'elaborate' : 'quick';
    
    const response = await fetch(`${API_BASE_URL}/smart-suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        day,
        mealType,
        complexity,
        preferences: {
          weekday: { maxCookTime: 30, difficulty: 'easy' },
          weekend: { maxCookTime: 90, difficulty: 'medium' }
        }
      }),
    });
    
    if (!response.ok) throw new Error('Failed to get smart suggestions');
    return await response.json();
  } catch (error) {
    console.error('Error getting smart suggestions:', error);
    throw error;
  }
};