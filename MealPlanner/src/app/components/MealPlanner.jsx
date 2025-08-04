import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import MealPlanDialog from './MealPlanDialog';

const MealPlanner = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const meals= {
    'Mon': { breakfast: 'Banana Smoothie', lunch: 'Chicken Salad', dinner: 'Spinach Pasta' },
    'Tue': { breakfast: '', lunch: 'Leftover Pasta', dinner: '' },
    'Wed': { breakfast: 'Toast', lunch: '', dinner: 'Stir Fry' },
    'Thu': { breakfast: '', lunch: '', dinner: '' },
    'Fri': { breakfast: '', lunch: '', dinner: '' },
    'Sat': { breakfast: '', lunch: '', dinner: '' },
    'Sun': { breakfast: '', lunch: '', dinner: '' },
  };

  const handlePlanMeal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsDialogOpen(true);
  };

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
      />
    </>
  );
};

export default MealPlanner;
