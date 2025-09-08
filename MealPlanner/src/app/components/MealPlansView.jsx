import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Utensils,
  Edit,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';
import MealPlanDialog from './MealPlanDialog';
import { getMealPlans, saveMealPlan, updateMealPlan, deleteMealPlan } from '../../api/mealPlansApi';

const MealPlansView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [mealPlans, setMealPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  useEffect(() => {
    loadMealPlans();
  }, [currentWeekOffset]);

  const loadMealPlans = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) {
        setLoading(false);
        return;
      }

      const startDate = getWeekStart();
      const endDate = getWeekEnd();
      const plans = await getMealPlans(userData.user_id, startDate, endDate);
      
      const organizedPlans = organizeMealPlans(plans);
      setMealPlans(organizedPlans);
    } catch (error) {
      console.error('Error loading meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(today.setDate(diff));
    weekStart.setDate(weekStart.getDate() + (currentWeekOffset * 7));
    return weekStart.toISOString().split('T')[0];
  };

  const getWeekEnd = () => {
    const start = new Date(getWeekStart());
    start.setDate(start.getDate() + 6);
    return start.toISOString().split('T')[0];
  };

  const navigateWeek = (direction) => {
    setCurrentWeekOffset(prev => prev + direction);
  };

  const getWeekLabel = () => {
    if (currentWeekOffset === 0) return 'This Week';
    if (currentWeekOffset === -1) return 'Last Week';
    if (currentWeekOffset === 1) return 'Next Week';
    if (currentWeekOffset < 0) return `${Math.abs(currentWeekOffset)} weeks ago`;
    return `${currentWeekOffset} weeks ahead`;
  };

  const organizeMealPlans = (plans) => {
    const organized = {
      Mon: { breakfast: null, lunch: null, dinner: null },
      Tue: { breakfast: null, lunch: null, dinner: null },
      Wed: { breakfast: null, lunch: null, dinner: null },
      Thu: { breakfast: null, lunch: null, dinner: null },
      Fri: { breakfast: null, lunch: null, dinner: null },
      Sat: { breakfast: null, lunch: null, dinner: null },
      Sun: { breakfast: null, lunch: null, dinner: null }
    };

    plans.forEach(plan => {
      const date = new Date(plan.date);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      if (organized[dayName] && plan.meals) {
        organized[dayName] = { ...organized[dayName], ...plan.meals };
      }
    });

    return organized;
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

  const handleDeleteMeal = async (day, mealType) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    
    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) return;

      const updatedMeals = { ...mealPlans[day] };
      updatedMeals[mealType] = null;

      const date = getDayDate(day);
      await saveMealPlan(userData.user_id, { date, meals: updatedMeals });
      
      setMealPlans(prev => ({
        ...prev,
        [day]: updatedMeals
      }));
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal');
    }
  };

  const handleSaveMeal = async (mealData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) return;

      const { day, mealType, ...meal } = mealData;
      const updatedMeals = { ...mealPlans[day] };
      updatedMeals[mealType] = meal;

      const date = getDayDate(day);
      await saveMealPlan(userData.user_id, { date, meals: updatedMeals });
      
      setMealPlans(prev => ({
        ...prev,
        [day]: updatedMeals
      }));

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal');
    }
  };

  const getDayDate = (dayName) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayIndex = days.indexOf(dayName);
    const startDate = new Date(getWeekStart());
    startDate.setDate(startDate.getDate() + dayIndex);
    return startDate.toISOString().split('T')[0];
  };

  const calculateWeekSummary = () => {
    const totalSlots = 21; // 7 days × 3 meals
    let plannedMeals = 0;
    let quickMeals = 0;

    Object.values(mealPlans).forEach(dayMeals => {
      ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        const meal = dayMeals[mealType];
        if (meal && meal.name) {
          plannedMeals++;
          
          // Check if it's a quick meal (less than 20 minutes)
          if (meal.cookTime) {
            const timeMatch = meal.cookTime.match(/(\d+)/);
            if (timeMatch && parseInt(timeMatch[1]) < 20) {
              quickMeals++;
            }
          }
        }
      });
    });

    const missingPlans = totalSlots - plannedMeals;
    const completionPercentage = Math.round((plannedMeals / totalSlots) * 100);

    return {
      plannedMeals,
      missingPlans,
      quickMeals,
      completionPercentage
    };
  };

  const weekSummary = calculateWeekSummary();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Loading meal plans...</span>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{getWeekLabel()}'s Meal Plan</h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateWeek(-1)}
                className="p-1 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentWeekOffset(0)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateWeek(1)}
                className="p-1 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={16} />
          Add Meal
        </button>
      </div>

      {/* Weekly Overview */}
      <div className="space-y-3">
        {weekDays.map((day) => (
          <div key={day} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">{day}</h3>
                </div>
                <button
                  onClick={() => handleAddMeal(day, 'dinner')}
                  className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  <Plus size={12} />
                  Plan
                </button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mealTypes.map((mealType) => {
                  const meal = mealPlans[day]?.[mealType.key];
                  const bgColor = meal ? mealType.bg : 'transparent';
                  const borderColor = meal ? mealType.color : '#d1d5db';
                  const borderStyle = meal ? 'solid' : 'dashed';
                  
                  return (
                    <div
                      key={mealType.key}
                      className={`border-2 rounded-lg p-2 cursor-pointer hover:shadow-sm transition-shadow ${
                        meal ? 'opacity-100' : 'opacity-50'
                      }`}
                      style={{
                        borderColor,
                        borderStyle,
                        backgroundColor: bgColor
                      }}
                      onClick={() => meal ? handleEditMeal(day, mealType.key) : handleAddMeal(day, mealType.key)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs font-medium">
                          <span className="mr-1">{mealType.icon}</span>
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
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMeal(day, mealType.key);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {meal ? (
                        <>
                          <p className="text-xs font-medium text-gray-900 truncate">{meal.name}</p>
                          <div className="flex gap-2 mt-1 text-gray-500">
                            {meal.cookTime && (
                              <div className="flex items-center text-xs">
                                <Clock size={10} className="mr-1" />
                                {meal.cookTime}
                              </div>
                            )}
                            {meal.servings && (
                              <div className="flex items-center text-xs">
                                <Users size={10} className="mr-1" />
                                {meal.servings}
                              </div>
                            )}
                          </div>
                          {meal.notes && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {meal.notes}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="text-center mt-2">
                          <Utensils size={16} className="text-gray-400 mx-auto" />
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
      <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Week Summary</h3>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-green-50">
              <div className="text-lg font-semibold text-green-600">{weekSummary.plannedMeals}</div>
              <div className="text-xs text-gray-600">Planned Meals</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <div className="text-lg font-semibold text-blue-600">{weekSummary.missingPlans}</div>
              <div className="text-xs text-gray-600">Missing Plans</div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <div className="text-lg font-semibold text-yellow-600">{weekSummary.quickMeals}</div>
              <div className="text-xs text-gray-600">Quick Meals (&lt;20 min)</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <div className="text-lg font-semibold text-purple-600">{weekSummary.completionPercentage}%</div>
              <div className="text-xs text-gray-600">Week Complete</div>
            </div>
          </div>
        </div>
      </div>

      <MealPlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDay={selectedDay}
        mealType={selectedMealType}
        onSave={handleSaveMeal}
        existingMeal={mealPlans[selectedDay]?.[selectedMealType]}
      />
    </div>
  );
};

export default MealPlansView;
