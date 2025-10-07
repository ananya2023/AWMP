import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Plus, Edit3, Trash2, ChefHat, Clock, Users, Star, TrendingUp, Target, Zap, ArrowRight, CheckCircle, AlertTriangle, Search, Filter, Heart, Bookmark, ChevronLeft, ChevronRight, History, Loader2, Save, CalendarDays } from 'lucide-react';
import { getMealPlans, saveMealPlan, updateMealPlan, deleteMealPlan } from '../../api/mealPlanApi';
import { getSavedRecipes } from '../../api/savedRecipesApi';
import { getSmartRecipeSuggestions } from '../../api/smartMealPlanApi';
import { generateIntelligentMealPlan } from '../../api/mcpMealPlanApi';
import { getAuth } from 'firebase/auth';
import EditMealModal from './EditMealModal';
const MealPlans = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [mealPlans, setMealPlans] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [generatedMealPlan, setGeneratedMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showWeekPicker, setShowWeekPicker] = useState(false);

  // Close week picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showWeekPicker && !event.target.closest('.week-picker-container')) {
        setShowWeekPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWeekPicker]);

  // Load saved recipes and existing meal plans
  useEffect(() => {
    const loadData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('No current user found');
        return;
      }
      
      try {
        setLoading(true);
        console.log('Loading meal plans for user:', currentUser.uid);
        const [plans, recipes] = await Promise.all([
          getMealPlans(currentUser.uid),
          getSavedRecipes(currentUser.uid)
        ]);
        console.log('Loaded meal plans:', plans);
        console.log('Loaded recipes:', recipes);
        setMealPlans(plans);
        setSavedRecipes(recipes);
        
        // Check if there's a meal plan for this week
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() + mondayOffset + (currentWeekOffset * 7));
        const weekStartDate = currentWeekStart.toISOString().split('T')[0];
        
        console.log('Looking for meal plan for week starting:', weekStartDate);
        console.log('Available meal plan dates:', plans.map(p => p.date));
        
        // Also check if any meal plan falls within this week (not just Monday)
        let existingPlan = plans.find(plan => plan.date === weekStartDate);
        
        if (!existingPlan) {
          // Check if any plan date falls within the current week
          const weekEndDate = new Date(currentWeekStart);
          weekEndDate.setDate(currentWeekStart.getDate() + 6);
          const weekEnd = weekEndDate.toISOString().split('T')[0];
          
          existingPlan = plans.find(plan => {
            return plan.date >= weekStartDate && plan.date <= weekEnd;
          });
          
          console.log(`Checking week range ${weekStartDate} to ${weekEnd}`);
        }
        
        console.log('Found existing plan:', existingPlan);
        
        if (existingPlan && existingPlan.meals) {
          setGeneratedMealPlan(existingPlan.meals);
          setIsSaved(true);
        } else {
          // Clear any existing meal plan if no plan exists for this week
          setGeneratedMealPlan(null);
          setIsSaved(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentWeekOffset]);

  const defaultMealPlan = {
    id: 1,
    name: 'Sustainable Week',
    week: 'March 18 - 24, 2024',
    status: 'active',
    wasteReduction: 78,
    mealsPlanned: 18,
    ingredientsUsed: 24,
    moneySaved: 32.50,
  };

  const weeklyMeals = generatedMealPlan || {
    monday: { breakfast: null, lunch: null, dinner: null },
    tuesday: { breakfast: null, lunch: null, dinner: null },
    wednesday: { breakfast: null, lunch: null, dinner: null },
    thursday: { breakfast: null, lunch: null, dinner: null },
    friday: { breakfast: null, lunch: null, dinner: null },
    saturday: { breakfast: null, lunch: null, dinner: null },
    sunday: { breakfast: null, lunch: null, dinner: null }
  };

  const historicalWeeks = [
    {
      id: 'week-1',
      name: 'March 11 - 17, 2024',
      status: 'completed',
      mealsPlanned: 21,
      mealsCompleted: 19,
      wasteReduction: 82,
      moneySaved: 28.75
    },
    {
      id: 'week-2',
      name: 'March 4 - 10, 2024',
      status: 'completed',
      mealsPlanned: 21,
      mealsCompleted: 16,
      wasteReduction: 75,
      moneySaved: 22.50
    },
    {
      id: 'week-3',
      name: 'February 26 - March 3, 2024',
      status: 'completed',
      mealsPlanned: 21,
      mealsCompleted: 18,
      wasteReduction: 78,
      moneySaved: 31.25
    }
  ];

  const availableRecipes = [
    {
      id: 1,
      name: 'Sunday Soup from Weekly Scraps',
      description: 'Transform your week\'s vegetable scraps into a hearty soup',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300',
      cookTime: '45 min',
      servings: 6,
      difficulty: 'Easy',
      wasteReduced: 95,
      ingredients: ['Vegetable scraps', 'Leftover proteins', 'Stale bread'],
      category: 'soup',
      rating: 4.8,
      mealTypes: ['lunch', 'dinner']
    },
    {
      id: 2,
      name: 'Leftover Grain Bowl',
      description: 'Mix and match leftover grains with fresh toppings',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
      cookTime: '15 min',
      servings: 2,
      difficulty: 'Easy',
      wasteReduced: 80,
      ingredients: ['Leftover grains', 'Mixed vegetables', 'Dressing'],
      category: 'bowl',
      rating: 4.6,
      mealTypes: ['breakfast', 'lunch']
    },
    {
      id: 3,
      name: 'Banana Bread French Toast',
      description: 'Double rescue: overripe bananas + stale bread',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=300',
      cookTime: '20 min',
      servings: 4,
      difficulty: 'Easy',
      wasteReduced: 90,
      ingredients: ['Stale bread', 'Overripe bananas', 'Eggs', 'Milk'],
      category: 'breakfast',
      rating: 4.7,
      mealTypes: ['breakfast']
    },
    {
      id: 4,
      name: 'Veggie Scrap Pasta',
      description: 'Turn vegetable scraps into a delicious pasta sauce',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
      cookTime: '30 min',
      servings: 4,
      difficulty: 'Medium',
      wasteReduced: 85,
      ingredients: ['Pasta', 'Vegetable scraps', 'Herbs', 'Olive oil'],
      category: 'pasta',
      rating: 4.5,
      mealTypes: ['lunch', 'dinner']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Recipes' },
    { id: 'soup', label: 'Soups' },
    { id: 'pasta', label: 'Pasta' },
    { id: 'bowl', label: 'Bowls' },
    { id: 'breakfast', label: 'Breakfast' }
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', time: '8:00 AM', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', time: '12:30 PM', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', time: '7:00 PM', icon: '🌙' }
  ];

  const handlePlanMeal = async (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setShowMealSelector(true);
    
    // Get smart suggestions based on day type
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const smartSuggestions = await getSmartRecipeSuggestions(currentUser.uid, day, mealType);
        console.log(`Smart suggestions for ${day} ${mealType}:`, smartSuggestions);
      } catch (error) {
        console.error('Error getting smart suggestions:', error);
      }
    }
  };

  const handleGenerateIntelligentPlan = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    try {
      setGenerating(true);
      const intelligentPlan = await generateIntelligentMealPlan(currentUser.uid, {
        servings: 2,
        weekdayComplexity: 'quick',
        weekendComplexity: 'elaborate'
      });
      
      if (intelligentPlan && intelligentPlan.mealPlan) {
        setGeneratedMealPlan(intelligentPlan.mealPlan);
        setIsSaved(false);
      } else {
        console.error('No meal plan generated');
      }
    } catch (error) {
      console.error('Error generating intelligent meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectRecipe = async (recipe) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    try {
      const mealPlanData = {
        userId: currentUser.uid,
        week: selectedWeek,
        day: selectedDay,
        mealType: selectedMealType,
        recipe: {
          name: recipe.name,
          image: recipe.image,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          wasteReduced: recipe.wasteReduced,
          ingredients: recipe.ingredients
        },
        status: 'planned'
      };
      
      await saveMealPlan(mealPlanData);
      
      // Reload meal plans
      const plans = await getMealPlans(currentUser.uid);
      setMealPlans(plans);
      
      setShowMealSelector(false);
      setSelectedDay(null);
      setSelectedMealType(null);
    } catch (error) {
      console.error('Error adding meal plan:', error);
    }
  };

  const handleEditMeal = (day, mealType, meal) => {
    setEditingMeal({ day, mealType, meal });
    setEditModalOpen(true);
  };

  const handleSaveEditedMeal = (updatedMeal) => {
    if (!editingMeal) return;
    
    const updatedMealPlan = { ...generatedMealPlan };
    updatedMealPlan[editingMeal.day][editingMeal.mealType] = {
      ...editingMeal.meal,
      ...updatedMeal
    };
    
    setGeneratedMealPlan(updatedMealPlan);
    setEditingMeal(null);
    setIsSaved(false); // Mark as unsaved when edited
  };

  const handleDeleteMeal = (day, mealType) => {
    const updatedMealPlan = { ...generatedMealPlan };
    updatedMealPlan[day][mealType] = null;
    
    setGeneratedMealPlan(updatedMealPlan);
    setIsSaved(false); // Mark as unsaved when meal is deleted
  };

  const handleMarkCompleted = (day, mealType) => {
    const updatedMealPlan = { ...generatedMealPlan };
    const meal = updatedMealPlan[day][mealType];
    
    if (meal) {
      meal.status = meal.status === 'completed' ? 'planned' : 'completed';
      setGeneratedMealPlan(updatedMealPlan);
      setIsSaved(false); // Mark as unsaved when status changes
    }
  };

  const handleSaveMealPlan = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser || !generatedMealPlan) return;
    
    try {
      setSaving(true);
      
      // Clean undefined values from meal plan
      const cleanMealPlan = JSON.parse(JSON.stringify(generatedMealPlan, (key, value) => {
        return value === undefined ? null : value;
      }));
      
      // Calculate the week start date (Monday) for the current week offset
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + mondayOffset + (currentWeekOffset * 7));
      const weekStartDate = weekStart.toISOString().split('T')[0];
      
      // Save the entire meal plan with the correct week start date
      const mealPlanData = {
        user_id: currentUser.uid,
        meal_plan: {
          date: weekStartDate, // Use week start date instead of today
          meals: cleanMealPlan
        }
      };
      
      await saveMealPlan(mealPlanData);
      
      // Reload meal plans
      const plans = await getMealPlans(currentUser.uid);
      setMealPlans(plans);
      setIsSaved(true);
      
      console.log('Meal plan saved successfully for week starting:', weekStartDate);
      
    } catch (error) {
      console.error('Error saving meal plan:', error);
    } finally {
      setSaving(false);
    }
  };

  // Smart filtering based on day type
  const getSmartFilteredRecipes = () => {
    const isWeekend = selectedDay && ['saturday', 'sunday'].includes(selectedDay);
    const maxCookTime = isWeekend ? 90 : 30;
    const preferredDifficulty = isWeekend ? ['medium', 'hard'] : ['easy', 'medium'];
    
    return savedRecipes.filter(recipe => {
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesSearch = (recipe.title || recipe.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (recipe.summary || recipe.description)?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMealType = !selectedMealType || recipe.dishTypes?.includes(selectedMealType) || recipe.mealTypes?.includes(selectedMealType);
      
      // Smart filtering based on day type
      const cookTime = recipe.readyInMinutes || parseInt(recipe.cookTime) || 30;
      const difficulty = recipe.difficulty?.toLowerCase() || 'easy';
      const matchesComplexity = showMealSelector ? 
        (cookTime <= maxCookTime && preferredDifficulty.includes(difficulty)) : true;
      
      return matchesCategory && matchesSearch && matchesMealType && matchesComplexity;
    });
  };
  
  const filteredRecipes = getSmartFilteredRecipes();

  const getTotalMealsPlanned = () => {
    if (!generatedMealPlan) return 0;
    
    let total = 0;
    days.forEach(day => {
      const dayMeals = generatedMealPlan[day];
      if (dayMeals) {
        mealTypes.forEach(mealType => {
          if (dayMeals[mealType.id]) {
            total++;
          }
        });
      }
    });
    return total;
  };

  const getTotalMealsCompleted = () => {
    if (!generatedMealPlan) return 0;
    
    let total = 0;
    days.forEach(day => {
      const dayMeals = generatedMealPlan[day];
      if (dayMeals) {
        mealTypes.forEach(mealType => {
          const meal = dayMeals[mealType.id];
          if (meal && meal.status === 'completed') {
            total++;
          }
        });
      }
    });
    return total;
  };

  const getAverageCookingTime = () => {
    if (!generatedMealPlan) return '0 min';
    
    let totalMinutes = 0;
    let mealCount = 0;
    
    days.forEach(day => {
      const dayMeals = generatedMealPlan[day];
      if (dayMeals) {
        mealTypes.forEach(mealType => {
          const meal = dayMeals[mealType.id];
          if (meal && meal.cookTime) {
            const minutes = parseInt(meal.cookTime.replace(/\D/g, '')) || 0;
            totalMinutes += minutes;
            mealCount++;
          }
        });
      }
    });
    
    if (mealCount === 0) return '0 min';
    const average = Math.round(totalMinutes / mealCount);
    return `${average} min`;
  };

  const getWeekNavigation = () => {
    const today = new Date();
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Sunday
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const weeks = [
      { id: 'previous', label: 'Previous Week', date: `${formatDate(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))} - ${formatDate(new Date(currentWeekEnd.getTime() - 7 * 24 * 60 * 60 * 1000))}` },
      { id: 'current', label: 'Current Week', date: `${formatDate(currentWeekStart)} - ${formatDate(currentWeekEnd)}` },
      { id: 'next', label: 'Next Week', date: `${formatDate(new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))} - ${formatDate(new Date(currentWeekEnd.getTime() + 7 * 24 * 60 * 60 * 1000))}` }
    ];
    return weeks;
  };
  
  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday as 0
    
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() + mondayOffset + (currentWeekOffset * 7));
    
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };
    
    return `${formatDate(currentWeekStart)} - ${formatDate(currentWeekEnd)}`;
  };
  
  const handleWeekNavigation = async (direction) => {
    const newOffset = currentWeekOffset + direction;
    setCurrentWeekOffset(newOffset);
    
    // Clear current meal plan immediately
    setGeneratedMealPlan(null);
    setIsSaved(false);
    
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + mondayOffset + (newOffset * 7));
      const weekStartDate = weekStart.toISOString().split('T')[0];
      
      // Check for exact Monday match first
      let existingPlan = mealPlans.find(plan => plan.date === weekStartDate);
      
      if (!existingPlan) {
        // Check if any plan date falls within this week
        const weekEndDate = new Date(weekStart);
        weekEndDate.setDate(weekStart.getDate() + 6);
        const weekEnd = weekEndDate.toISOString().split('T')[0];
        
        existingPlan = mealPlans.find(plan => {
          return plan.date >= weekStartDate && plan.date <= weekEnd;
        });
      }
      
      if (existingPlan && existingPlan.meals) {
        setGeneratedMealPlan(existingPlan.meals);
        setIsSaved(true);
      } else {
        // Ensure meal plan is cleared if no plan exists for this week
        setGeneratedMealPlan(null);
        setIsSaved(false);
      }
    }
  };

  const handleWeekSelect = (offset) => {
    setCurrentWeekOffset(offset);
    setShowWeekPicker(false);
  };

  const getWeekOptions = () => {
    const weeks = [];
    const today = new Date();
    
    // Generate weeks based on available meal plans + some buffer
    const availableWeekOffsets = new Set();
    
    // Add offsets for existing meal plans
    mealPlans.forEach(plan => {
      const planDate = new Date(plan.date);
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() + mondayOffset);
      
      // Calculate offset from current week
      const diffTime = planDate.getTime() - currentWeekStart.getTime();
      const diffWeeks = Math.round(diffTime / (7 * 24 * 60 * 60 * 1000));
      availableWeekOffsets.add(diffWeeks);
    });
    
    // Add current week and some buffer weeks
    for (let i = -8; i <= 8; i++) {
      availableWeekOffsets.add(i);
    }
    
    // Convert to sorted array and generate week options
    const sortedOffsets = Array.from(availableWeekOffsets).sort((a, b) => b - a);
    
    sortedOffsets.forEach(i => {
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + mondayOffset + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      weeks.push({
        offset: i,
        label: i === 0 ? 'This Week' : 
               i === -1 ? 'Last Week' : 
               i === 1 ? 'Next Week' :
               i < 0 ? `${Math.abs(i)} weeks ago` : `${i} weeks ahead`,
        dateRange: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        isCurrentWeek: i === 0,
        hasMealPlan: mealPlans.some(plan => {
          const planDate = new Date(plan.date);
          return planDate >= weekStart && planDate <= weekEnd;
        })
      });
    });
    
    return weeks;
  };
  
  const getHistoricalWeeks = () => {
    if (!mealPlans || mealPlans.length === 0) return [];
    
    return mealPlans.map((plan) => {
      const planDate = new Date(plan.date);
      const weekEnd = new Date(planDate);
      weekEnd.setDate(planDate.getDate() + 6);
      
      let mealsCount = 0;
      if (plan.meals && typeof plan.meals === 'object') {
        mealsCount = Object.values(plan.meals).reduce((total, day) => {
          if (day && typeof day === 'object') {
            return total + Object.values(day).filter(meal => meal !== null && meal !== undefined).length;
          }
          return total;
        }, 0);
      }
      
      return {
        id: plan.id,
        name: `${planDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        status: 'completed',
        mealsPlanned: 21,
        mealsCompleted: mealsCount,
        wasteReduction: Math.floor(Math.random() * 20) + 70,
        moneySaved: (Math.random() * 20 + 15).toFixed(2)
      };
    }).slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading meal plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-8 w-8 text-emerald-500 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-900">My Meal Plans</h2>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
              3 Meals Daily
            </div>
          </div>
          <p className="text-gray-600 text-lg">Plan breakfast, lunch, and dinner for sustainable eating</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setShowSnackbar(true);
              setTimeout(() => setShowSnackbar(false), 3000);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <History className="h-4 w-4" />
            <span>View History</span>
          </button>
          
          {/* Week Navigation */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleWeekNavigation(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="relative week-picker-container">
              <button
                onClick={() => setShowWeekPicker(!showWeekPicker)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:shadow-md transition-all duration-300 flex items-center space-x-2 bg-white"
              >
                <CalendarDays className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  {currentWeekOffset === 0 ? 'This Week' :
                   currentWeekOffset === -1 ? 'Last Week' :
                   currentWeekOffset === 1 ? 'Next Week' :
                   currentWeekOffset < 0 ? `${Math.abs(currentWeekOffset)} weeks ago` :
                   `${currentWeekOffset} weeks ahead`}
                </span>
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showWeekPicker ? 'rotate-90' : ''}`} />
              </button>
              
              {showWeekPicker && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {getWeekOptions().map((week) => (
                    <button
                      key={week.offset}
                      onClick={() => handleWeekSelect(week.offset)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
                        week.offset === currentWeekOffset ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{week.label}</div>
                        {week.hasMealPlan && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{week.dateRange}</div>
                      {week.isCurrentWeek && (
                        <div className="text-xs text-emerald-600 font-medium mt-1">• Current Week</div>
                      )}
                      {week.hasMealPlan && !week.isCurrentWeek && (
                        <div className="text-xs text-blue-600 font-medium mt-1">• Has Meal Plan</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => handleWeekNavigation(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Historical Weeks View */}
      {showHistory && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Meal Plan History</h3>
            <p className="text-gray-600">Review your past meal planning performance</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {getHistoricalWeeks().map((week, index) => (
                <div
                  key={week.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {week.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{week.mealsCompleted}/{week.mealsPlanned} meals completed</span>
                        <span className="text-emerald-600 font-medium">{week.wasteReduction}% waste reduced</span>
                        <span className="text-green-600 font-medium">${week.moneySaved} saved</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{Math.round((week.mealsCompleted / week.mealsPlanned) * 100)}%</div>
                        <div className="text-xs text-gray-500">Completion</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(week.mealsCompleted / week.mealsPlanned) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'This Week\'s Goal', value: '21/21', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Meals Planned', value: `${getTotalMealsPlanned()}/21`, icon: ChefHat, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', value: `${getTotalMealsCompleted()}`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Cook Time', value: getAverageCookingTime(), icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, index) => (
          <div 
            key={index}
            className={`${stat.bg} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                <stat.icon className="h-6 w-6 group-hover:animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Meal Plan CTA */}
      {!generatedMealPlan && !loading && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-emerald-200">
          <div className="max-w-md mx-auto">
            <ChefHat className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Plan Your Week?</h3>
            <p className="text-gray-600 mb-6">Generate an AI-powered meal plan based on your pantry ingredients and preferences.</p>
            <button 
              onClick={handleGenerateIntelligentPlan}
              disabled={generating}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-semibold flex items-center justify-center space-x-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {generating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Generating Your Meal Plan...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  <span>Meal Plan This Week</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weekly Calendar - Left Side */}
        <div className={`lg:col-span-2 ${!generatedMealPlan && !loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{getCurrentWeekRange()}</h3>
                <div className="flex items-center space-x-4">
                  {generatedMealPlan && (
                    <button
                      onClick={handleSaveMealPlan}
                      disabled={saving || isSaved}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                        isSaved
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50'
                      }`}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isSaved ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Meal Plan</span>
                        </>
                      )}
                    </button>
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Planned</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-gray-700">Not Planned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Days */}
            <div className="p-6">
              <div className="space-y-6">
                {days.map((day, dayIndex) => {
                  const dayData = weeklyMeals[day];
                  return (
                    <div key={day} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{dayNames[dayIndex]}</div>
                          <div className="text-xs text-gray-500">
                            {(() => {
                              const today = new Date();
                              const dayOfWeek = today.getDay();
                              const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                              
                              const weekStart = new Date(today);
                              weekStart.setDate(today.getDate() + mondayOffset + (currentWeekOffset * 7));
                              
                              const dayDate = new Date(weekStart);
                              dayDate.setDate(weekStart.getDate() + dayIndex);
                              return dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            })()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {mealTypes.filter(mealType => dayData[mealType.id]).length}/3 meals planned
                        </div>
                      </div>

                      {/* Meal Slots */}
                      <div className="grid md:grid-cols-3 gap-4">
                        {mealTypes.map((mealType) => {
                          const meal = dayData[mealType.id];
                          return (
                            <div key={mealType.id} className="border border-gray-100 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{mealType.icon}</span>
                                  <span className="text-sm font-medium text-gray-700">{mealType.label}</span>
                                </div>
                                {meal && (
                                  <div className="flex items-center space-x-1">
                                    {meal.status === 'completed' && (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                    {meal.status === 'planned' && (
                                      <Clock className="h-4 w-4 text-blue-600" />
                                    )}
                                  </div>
                                )}
                              </div>

                              {meal ? (
                                <div className="space-y-2">
                                  <img
                                    src={meal.image}
                                    alt={meal.name}
                                    className="w-full h-20 object-cover rounded-md"
                                  />
                                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1" title={meal.name}>{meal.name}</h4>
                                  {meal.description && (
                                    <p className="text-xs text-gray-600 line-clamp-2" title={meal.description}>{meal.description}</p>
                                  )}
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>{meal.cookTime}</span>
                                    <span className="text-emerald-600 font-medium">{meal.wasteReduced}%</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{meal.servings} servings</span>
                                    <span className="capitalize">{meal.difficulty}</span>
                                  </div>
                                  {meal.nutritionInfo && (
                                    <div className="text-xs text-gray-500">
                                      <span>{meal.nutritionInfo.calories} cal</span>
                                      {meal.nutritionInfo.protein && <span> • {meal.nutritionInfo.protein} protein</span>}
                                    </div>
                                  )}
                                  <div className="flex space-x-1">
                                    <button 
                                      onClick={() => handleMarkCompleted(day, mealType.id)}
                                      className={`p-1 rounded transition-colors duration-200 ${
                                        meal.status === 'completed'
                                          ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                                      }`}
                                      title={meal.status === 'completed' ? 'Mark as Planned' : 'Mark as Completed'}
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </button>
                                    <button 
                                      onClick={() => handleEditMeal(day, mealType.id, meal)}
                                      className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                                      title="Edit Meal"
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteMeal(day, mealType.id)}
                                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                      title="Remove Meal"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handlePlanMeal(day, mealType.id)}
                                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-500 group"
                                >
                                  <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-200 mb-1" />
                                  <span className="text-xs font-medium">Plan {mealType.label}</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Selector - Right Side */}
        <div className={`lg:col-span-1 ${!generatedMealPlan && !loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-500 ${
            showMealSelector ? 'ring-2 ring-emerald-500 shadow-lg' : ''
          }`}>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {showMealSelector 
                  ? `Plan ${selectedMealType} for ${selectedDay ? dayNames[days.indexOf(selectedDay)] : ''}` 
                  : 'Recipe Suggestions'
                }
              </h3>
              <p className="text-gray-600 text-sm">
                {showMealSelector ? (
                  selectedDay && ['saturday', 'sunday'].includes(selectedDay) ? 
                    `Weekend vibes: Showing elaborate recipes (up to 90 min)` :
                    `Weekday mode: Showing quick recipes (up to 30 min)`
                ) : 'Quick access to your favorite recipes'}
              </p>
            </div>

            {showMealSelector && (
              <div className="p-4 border-b border-gray-200">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search recipes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {(showMealSelector ? filteredRecipes : savedRecipes.slice(0, 3)).map((recipe, index) => (
                  <div
                    key={recipe.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-emerald-300 transition-all duration-300 cursor-pointer group"
                    onClick={() => showMealSelector ? handleSelectRecipe(recipe) : null}
                  >
                    <div className="flex space-x-3">
                      <img
                        src={recipe.image || 'https://via.placeholder.com/64x64?text=Recipe'}
                        alt={recipe.title || recipe.name}
                        className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                          {recipe.title || recipe.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{recipe.summary || recipe.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3" />
                            <span>{recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : recipe.cookTime}</span>
                          </div>
                          <span className="text-emerald-600 font-medium">{recipe.wasteReduced || 75}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{recipe.servings || 2} servings</span>
                          <span className="capitalize">{recipe.difficulty || 'Easy'}</span>
                        </div>
                        {recipe.nutritionInfo && (
                          <div className="text-xs text-gray-500 mt-1">
                            <span>{recipe.nutritionInfo.calories} cal</span>
                            {recipe.nutritionInfo.protein && <span> • {recipe.nutritionInfo.protein}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    {showMealSelector && (
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{recipe.rating}</span>
                        </div>
                        <button className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-full hover:bg-emerald-600 transition-colors duration-200">
                          Select
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {showMealSelector && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowMealSelector(false);
                      setSelectedDay(null);
                      setSelectedMealType(null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Insights */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
            <ChefHat className="h-5 w-5" />
            <span>Weekly Overview</span>
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Meals Planned:</span>
              <span className="font-bold text-blue-900">{getTotalMealsPlanned()} of 21</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Meals Completed:</span>
              <span className="font-bold text-blue-900">{getTotalMealsCompleted()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Avg Cook Time:</span>
              <span className="font-bold text-blue-900">{getAverageCookingTime()}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
          <h4 className="font-semibold text-orange-900 mb-4 flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Quick Actions</span>
          </h4>
          <div className="space-y-3">
            <button 
              onClick={handleGenerateIntelligentPlan}
              disabled={generating}
              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{generating ? 'Generating...' : 'Meal Plan This Week'}</span>
            </button>
            <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium">
              Generate Shopping List
            </button>
            <button className="w-full px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors duration-200 text-sm font-medium">
              Duplicate This Week
            </button>
            <button className="w-full px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors duration-200 text-sm font-medium">
              Share Plan
            </button>
          </div>
        </div>
      </div>

      {/* Edit Meal Modal */}
      <EditMealModal
        meal={editingMeal?.meal}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleSaveEditedMeal}
      />
      
      {/* Coming Soon Snackbar */}
      {showSnackbar && createPortal(
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg" style={{ zIndex: 10001 }}>
          <div className="flex items-center space-x-2">
            <span>Coming Soon!</span>
            <button 
              onClick={() => setShowSnackbar(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MealPlans;