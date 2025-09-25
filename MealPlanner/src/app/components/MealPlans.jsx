import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3, Trash2, ChefHat, Clock, Users, Star, TrendingUp, Target, Zap, ArrowRight, CheckCircle, AlertTriangle, Search, Filter, Heart, Bookmark, ChevronLeft, ChevronRight, History, Loader2 } from 'lucide-react';
import { getMealPlans, saveMealPlan, updateMealPlan, deleteMealPlan } from '../../api/mealPlanApi';
import { getSavedRecipes } from '../../api/savedRecipesApi';
import { getAuth } from 'firebase/auth';
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
  const [loading, setLoading] = useState(true);

  // Load meal plans and saved recipes from API
  useEffect(() => {
    const loadData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const [plans, recipes] = await Promise.all([
          getMealPlans(currentUser.uid),
          getSavedRecipes(currentUser.uid)
        ]);
        console.log('Loaded saved recipes:', recipes);
        setMealPlans(plans);
        setSavedRecipes(recipes);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const weeklyMeals = {
    monday: {
      breakfast: {
        name: 'Banana Bread French Toast',
        time: '8:00 AM',
        status: 'completed',
        wasteReduced: 90,
        ingredients: ['Stale bread', 'Overripe bananas', 'Eggs'],
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '20 min',
        servings: 2,
        difficulty: 'Easy'
      },
      lunch: {
        name: 'Leftover Grain Bowl',
        time: '12:30 PM',
        status: 'completed',
        wasteReduced: 80,
        ingredients: ['Leftover rice', 'Mixed vegetables', 'Dressing'],
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '15 min',
        servings: 1,
        difficulty: 'Easy'
      },
      dinner: {
        name: 'Zero-Waste Veggie Stir Fry',
        time: '7:00 PM',
        status: 'completed',
        wasteReduced: 85,
        ingredients: ['Carrots', 'Broccoli stems', 'Leftover rice'],
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '25 min',
        servings: 4,
        difficulty: 'Easy'
      }
    },
    tuesday: {
      breakfast: {
        name: 'Smoothie Bowl',
        time: '8:00 AM',
        status: 'completed',
        wasteReduced: 75,
        ingredients: ['Overripe fruits', 'Yogurt', 'Granola'],
        image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '10 min',
        servings: 1,
        difficulty: 'Easy'
      },
      lunch: {
        name: 'Veggie Scrap Soup',
        time: '1:00 PM',
        status: 'completed',
        wasteReduced: 95,
        ingredients: ['Vegetable scraps', 'Broth', 'Herbs'],
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '30 min',
        servings: 3,
        difficulty: 'Medium'
      },
      dinner: {
        name: 'Pasta with Wilted Greens',
        time: '7:30 PM',
        status: 'completed',
        wasteReduced: 80,
        ingredients: ['Spinach', 'Pasta', 'Garlic'],
        image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '20 min',
        servings: 4,
        difficulty: 'Easy'
      }
    },
    wednesday: {
      breakfast: {
        name: 'Overnight Oats',
        time: '8:00 AM',
        status: 'planned',
        wasteReduced: 70,
        ingredients: ['Oats', 'Milk', 'Fruit scraps'],
        image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '5 min',
        servings: 1,
        difficulty: 'Easy'
      },
      lunch: {
        name: 'Leftover Soup',
        time: '12:30 PM',
        status: 'planned',
        wasteReduced: 85,
        ingredients: ['Yesterday\'s soup', 'Fresh herbs'],
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '5 min',
        servings: 1,
        difficulty: 'Easy'
      },
      dinner: {
        name: 'Curry with Root Vegetables',
        time: '7:00 PM',
        status: 'planned',
        wasteReduced: 90,
        ingredients: ['Potato peels', 'Carrot tops', 'Onion scraps'],
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '35 min',
        servings: 4,
        difficulty: 'Medium'
      }
    },
    thursday: {
      breakfast: null,
      lunch: null,
      dinner: {
        name: 'Fish with Root Veggie Chips',
        time: '7:00 PM',
        status: 'planned',
        wasteReduced: 75,
        ingredients: ['Fish', 'Potato peels', 'Herbs'],
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '30 min',
        servings: 4,
        difficulty: 'Medium'
      }
    },
    friday: {
      breakfast: null,
      lunch: null,
      dinner: {
        name: 'Pizza with Leftover Toppings',
        time: '7:30 PM',
        status: 'planned',
        wasteReduced: 70,
        ingredients: ['Pizza dough', 'Leftover vegetables', 'Cheese'],
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '25 min',
        servings: 4,
        difficulty: 'Easy'
      }
    },
    saturday: {
      breakfast: null,
      lunch: null,
      dinner: {
        name: 'Weekend Roast with Scraps',
        time: '6:00 PM',
        status: 'planned',
        wasteReduced: 85,
        ingredients: ['Chicken', 'Root vegetables', 'Herb stems'],
        image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=300',
        cookTime: '60 min',
        servings: 6,
        difficulty: 'Medium'
      }
    },
    sunday: {
      breakfast: null,
      lunch: null,
      dinner: null
    },
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

  const handlePlanMeal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setShowMealSelector(true);
  };

  const handleSelectRecipe = async (recipe) => {
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

  const filteredRecipes = savedRecipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesSearch = (recipe.title || recipe.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (recipe.summary || recipe.description)?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMealType = !selectedMealType || recipe.dishTypes?.includes(selectedMealType) || recipe.mealTypes?.includes(selectedMealType);
    return matchesCategory && matchesSearch && matchesMealType;
  });

  const getTotalMealsPlanned = () => {
    let total = 0;
    days.forEach(day => {
      const dayMeals = weeklyMeals[day];
      mealTypes.forEach(mealType => {
        if (dayMeals[mealType.id]) {
          total++;
        }
      });
    });
    return total;
  };

  const getTotalMealsCompleted = () => {
    let total = 0;
    days.forEach(day => {
      const dayMeals = weeklyMeals[day];
      mealTypes.forEach(mealType => {
        const meal = dayMeals[mealType.id];
        if (meal && meal.status === 'completed') {
          total++;
        }
      });
    });
    return total;
  };

  const getWeekNavigation = () => {
    const weeks = [
      { id: 'previous', label: 'Previous Week', date: 'March 11 - 17' },
      { id: 'current', label: 'Current Week', date: 'March 18 - 24' },
      { id: 'next', label: 'Next Week', date: 'March 25 - 31' }
    ];
    return weeks;
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
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
              showHistory
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <History className="h-4 w-4" />
            <span>View History</span>
          </button>
          
          {/* Week Navigation */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:shadow-md transition-all duration-300"
            >
              <option value="previous">Previous Week</option>
              <option value="current">Current Week</option>
              <option value="next">Next Week</option>
            </select>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
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
              {historicalWeeks.map((week, index) => (
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
          { label: 'Money Saved', value: '$32.50', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
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

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weekly Calendar - Left Side */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">March 18 - 24, 2024</h3>
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
                          <div className="text-xs text-gray-500">Mar {18 + dayIndex}</div>
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
                                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{meal.name}</h4>
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>{meal.cookTime}</span>
                                    <span className="text-emerald-600 font-medium">{meal.wasteReduced}%</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">
                                      <Edit3 className="h-3 w-3" />
                                    </button>
                                    <button className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200">
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
        <div className="lg:col-span-1">
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
                {showMealSelector 
                  ? `Choose a recipe for your ${selectedMealType}` 
                  : 'Quick access to your favorite recipes'
                }
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
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3" />
                            <span>{recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : recipe.cookTime}</span>
                          </div>
                          <span className="text-emerald-600 font-medium">{recipe.wasteReduced || 75}%</span>
                        </div>
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
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <h4 className="font-semibold text-emerald-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>This Week's Impact</span>
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-emerald-700">Food Saved:</span>
              <span className="font-bold text-emerald-900">4.8 lbs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-700">CO2 Prevented:</span>
              <span className="font-bold text-emerald-900">6.2 lbs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-700">Water Saved:</span>
              <span className="font-bold text-emerald-900">18 gallons</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
            <ChefHat className="h-5 w-5" />
            <span>Weekly Overview</span>
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Meals Completed:</span>
              <span className="font-bold text-blue-900">{getTotalMealsCompleted()} of 21</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Avg. Waste Reduction:</span>
              <span className="font-bold text-blue-900">82%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Next Meal:</span>
              <span className="font-bold text-blue-900">Tonight</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
          <h4 className="font-semibold text-orange-900 mb-4 flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Quick Actions</span>
          </h4>
          <div className="space-y-3">
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
    </div>
  );
};

export default MealPlans;