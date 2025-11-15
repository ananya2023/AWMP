import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import MealPlanDialog from './MealPlanDialog';

const MealPlanner = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [meals, setMeals] = useState({
    'Mon': { breakfast: '', lunch: '', dinner: '' },
    'Tue': { breakfast: '', lunch: '', dinner: '' },
    'Wed': { breakfast: '', lunch: '', dinner: '' },
    'Thu': { breakfast: '', lunch: '', dinner: '' },
    'Fri': { breakfast: '', lunch: '', dinner: '' },
    'Sat': { breakfast: '', lunch: '', dinner: '' },
    'Sun': { breakfast: '', lunch: '', dinner: '' },
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handlePlanMeal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsDialogOpen(true);
  };

  const handleSaveMeal = async (mealData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) {
        alert('Please log in to save meal plans.');
        return;
      }

      // Update local state
      setMeals(prev => ({
        ...prev,
        [mealData.day]: {
          ...prev[mealData.day],
          [mealData.mealType]: mealData.name
        }
      }));

      // Save to backend
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? 
        `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 
        'http://localhost:3008/api/awmp';
      
      const response = await fetch(`${API_BASE_URL}/meal-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.user_id,
          day: mealData.day,
          meal_type: mealData.mealType,
          recipe_name: mealData.name,
          cook_time: mealData.cookTime,
          servings: mealData.servings,
          notes: mealData.notes,
          ingredients: mealData.ingredients || [],
          instructions: mealData.instructions || [],
          start_date: new Date().toISOString().split('T')[0] // Current week
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save meal plan');
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert('Failed to save meal plan. Please try again.');
    }
  };

  const loadMealPlans = async () => {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (!userData?.user_id) return;
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? 
        `${import.meta.env.VITE_API_BASE_URL}/api/awmp` : 
        'http://localhost:3008/api/awmp';
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 6);
      
      const response = await fetch(
        `${API_BASE_URL}/meal-plans?user_id=${userData.user_id}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`
      );
      
      if (response.ok) {
        const result = await response.json();
        const mealPlans = result.data || [];
        
        // Convert meal plans to the expected format
        const newMeals = { ...meals };
        mealPlans.forEach(plan => {
          if (plan.day && plan.meal_type && plan.recipe_name) {
            newMeals[plan.day] = {
              ...newMeals[plan.day],
              [plan.meal_type]: plan.recipe_name
            };
          }
        });
        
        setMeals(newMeals);
      }
    } catch (error) {
      console.error('Error loading meal plans:', error);
    }
  };

  useEffect(() => {
    loadMealPlans();
  }, []);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar size={20} className="mr-2 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">This Week's Plan</h2>
          </div>
          <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            View Full Calendar
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {weekDays.map((day) => (
              <div key={day} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">{day}</h3>
                  <button
                    onClick={() => handlePlanMeal(day, 'dinner')}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Plus size={14} />
                    Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['breakfast', 'lunch', 'dinner']).map((mealType) => {
                    const bgColor = mealType === 'breakfast' ? 'bg-yellow-100 hover:bg-yellow-200' : 
                                   mealType === 'lunch' ? 'bg-blue-100 hover:bg-blue-200' : 
                                   'bg-purple-100 hover:bg-purple-200';
                    
                    return (
                      <div
                        key={mealType}
                        className={`${bgColor} border border-gray-200 rounded-lg p-3 text-center cursor-pointer transition-colors`}
                        onClick={() => handlePlanMeal(day, mealType)}
                      >
                        <p className="text-xs text-gray-600 mb-1">
                          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {meals[day]?.[mealType] || 'Not planned'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MealPlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDay={selectedDay}
        mealType={selectedMealType}
        onSave={handleSaveMeal}
      />
    </>
  );
};

export default MealPlanner;
