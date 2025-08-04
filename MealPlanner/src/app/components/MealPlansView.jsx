import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Utensils,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import MealPlanDialog from './MealPlanDialog';

const MealPlansView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  const mealPlans = {
    Mon: {
      breakfast: { name: 'Banana Smoothie', cookTime: '5 min', servings: '1', notes: 'Add protein powder' },
      lunch: { name: 'Chicken Salad', cookTime: '15 min', servings: '2', notes: '' },
      dinner: { name: 'Spinach Pasta', cookTime: '25 min', servings: '4', notes: 'Use whole wheat pasta' }
    },
    Tue: {
      breakfast: null,
      lunch: { name: 'Leftover Pasta', cookTime: '5 min', servings: '2', notes: 'Reheat from yesterday' },
      dinner: null
    },
    Wed: {
      breakfast: { name: 'Toast & Avocado', cookTime: '5 min', servings: '1', notes: '' },
      lunch: null,
      dinner: { name: 'Vegetable Stir Fry', cookTime: '20 min', servings: '3', notes: 'Use seasonal vegetables' }
    },
    Thu: { breakfast: null, lunch: null, dinner: null },
    Fri: { breakfast: null, lunch: null, dinner: null },
    Sat: { breakfast: null, lunch: null, dinner: null },
    Sun: { breakfast: null, lunch: null, dinner: null }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', bg: '#FFFDE7', color: '#FBC02D', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', bg: '#E3F2FD', color: '#1E88E5', icon: '🌞' },
    { key: 'dinner', label: 'Dinner', bg: '#F3E5F5', color: '#8E24AA', icon: '🌙' }
  ];

  const handleAddMeal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsDialogOpen(true);
  };

  const handleEditMeal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsDialogOpen(true);
  };

  const handleDeleteMeal = (day, mealType) => {
    console.log(`Deleting ${mealType} for ${day}`);
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">This Week's Meal Plan</h1>
          <p className="text-sm text-gray-600">Manage your planned meals for the week</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          Add Meal
        </button>
      </div>

      {/* Weekly Overview */}
      <div className="space-y-4">
        {weekDays.map((day) => (
          <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-emerald-600" />
                  <h3 className="font-bold text-gray-900">{day}</h3>
                </div>
                <button
                  onClick={() => handleAddMeal(day, 'dinner')}
                  className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                  Plan Meal
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mealTypes.map((mealType) => {
                  const meal = mealPlans[day]?.[mealType.key];
                  const bgColor = meal ? mealType.bg : 'transparent';
                  const borderColor = meal ? mealType.color : '#d1d5db';
                  const borderStyle = meal ? 'solid' : 'dashed';
                  
                  return (
                    <div
                      key={mealType.key}
                      className={`border-2 rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow ${
                        meal ? 'opacity-100' : 'opacity-50'
                      }`}
                      style={{
                        borderColor,
                        borderStyle,
                        backgroundColor: bgColor
                      }}
                      onClick={() => meal ? handleEditMeal(day, mealType.key) : handleAddMeal(day, mealType.key)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs font-medium">
                          <span className="mr-2">{mealType.icon}</span>
                          {mealType.label}
                        </div>
                        {meal && (
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMeal(day, mealType.key);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMeal(day, mealType.key);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {meal ? (
                        <>
                          <p className="text-sm font-medium text-gray-900 truncate">{meal.name}</p>
                          <div className="flex gap-3 mt-2 text-gray-500">
                            {meal.cookTime && (
                              <div className="flex items-center text-xs">
                                <Clock size={12} className="mr-1" />
                                {meal.cookTime}
                              </div>
                            )}
                            {meal.servings && (
                              <div className="flex items-center text-xs">
                                <Users size={12} className="mr-1" />
                                {meal.servings}
                              </div>
                            )}
                          </div>
                          {meal.notes && (
                            <p className="text-xs text-gray-500 mt-2 truncate">
                              {meal.notes}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="text-center mt-4">
                          <Utensils size={24} className="text-gray-400 mx-auto" />
                          <p className="text-xs text-gray-500 mt-1">Not planned</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Week Summary</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-lg bg-green-50">
              <div className="text-xl font-semibold text-green-600">12</div>
              <div className="text-sm text-gray-600">Planned Meals</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <div className="text-xl font-semibold text-blue-600">9</div>
              <div className="text-sm text-gray-600">Missing Plans</div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50">
              <div className="text-xl font-semibold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">Quick Meals</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-50">
              <div className="text-xl font-semibold text-purple-600">57%</div>
              <div className="text-sm text-gray-600">Week Complete</div>
            </div>
          </div>
        </div>
      </div>

      <MealPlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDay={selectedDay}
        mealType={selectedMealType}
      />
    </div>
  );
};

export default MealPlansView;
