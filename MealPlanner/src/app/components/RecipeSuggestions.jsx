import React, { useState, useEffect } from 'react';
import { Lightbulb, Clock, Users, Zap, RefreshCw, Heart, ChefHat, Loader2, Search, X } from 'lucide-react';
import Header from './Header';
import VoiceRecipeAssistant from './VoiceRecipeAssistant';
import RecipeDetailModal from './RecipeDetailModal';
import { getAuth } from 'firebase/auth';
import { getRandomRecipes, searchRecipes, getRecipesByIngredients, getRecipeDetails, getRecipesByType } from '../../api/spoonacularApi';
import { saveRecipe } from '../../api/savedRecipesApi';
import { getPantryItems } from '../../api/pantryApi';

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('pantry-based');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pantryInsights, setPantryInsights] = useState({
    expiringItems: [],
    totalItems: 0,
    potentialSavings: 0
  });

  useEffect(() => {
    loadCategories();
    loadRecipes();
    loadPantryInsights();
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [selectedCategory]);

  const loadPantryInsights = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userData = JSON.parse(localStorage.getItem('user_data'));
      const userId = userData?.user_id || user.uid;
      
      const pantryItems = await getPantryItems(userId);
      
      const today = new Date();
      const expiringItems = pantryItems.filter(item => {
        if (!item.expiry_date) return false;
        const expiryDate = new Date(item.expiry_date);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      });

      const potentialSavings = expiringItems.length * 3.5;

      setPantryInsights({
        expiringItems: expiringItems.slice(0, 3),
        totalItems: pantryItems.length,
        potentialSavings
      });
    } catch (error) {
      console.error('Error loading pantry insights:', error);
    }
  };

  const loadCategories = async () => {
    const categoryList = [
      { 
        id: 'pantry-based', 
        label: 'Your Pantry', 
        emoji: '🥬'
      },
      { 
        id: 'quick', 
        label: 'Quick Saves', 
        emoji: '⚡'
      },
      { 
        id: 'innovative', 
        label: 'Innovative', 
        emoji: '💡'
      },
    ];
    console.log('Categories loaded:', categoryList);
    setCategories(categoryList);
  };

  const getSeasonalQuery = () => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) {
      return 'indian spring curry dal fresh vegetables';
    } else if (month >= 6 && month <= 8) {
      return 'indian summer mango lassi raita cooling';
    } else if (month >= 9 && month <= 11) {
      return 'indian autumn biryani pulao festival sweets';
    } else {
      return 'indian winter warm curry soup comfort food';
    }
  };

  const loadRecipes = async () => {
    setLoading(true);
    try {
      let data;
      switch (selectedCategory) {
        case 'pantry-based':
          data = await getRecipesByIngredients('tomato,onion,garlic', 12);
          break;
        case 'quick':
          data = await searchRecipes('quick easy', 12, 20);
          break;
        case 'innovative':
          data = await getRecipesByType('appetizer', 12);
          break;
        default:
          data = await getRandomRecipes(12);
      }
      console.log('Recipe data:', data);
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipesByCategory = async () => {
    setLoading(true);
    try {
      const data = await getRecipesByCategory(selectedCategory);
      setRecipes(data.slice(0, 12));
    } catch (error) {
      console.error('Error loading recipes by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const data = await searchRecipes(searchTerm, 12);
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = async (recipe) => {
    try {
      console.log('Recipe clicked:', recipe);
      setSelectedRecipe(recipe);
      setShowModal(true);
      const details = await getRecipeDetails(recipe.id);
      setSelectedRecipe(details);
    } catch (error) {
      console.error('Error loading recipe details:', error);
      setSelectedRecipe(recipe);
      setShowModal(true);
    }
  };

  const getIngredients = (recipe) => {
    return recipe.extendedIngredients?.map(ing => 
      `${ing.amount} ${ing.unit} ${ing.name}`
    ) || [];
  };

  const handleSaveRecipe = async (recipe, e) => {
    e.stopPropagation();
    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) {
        alert('Please log in to save recipes');
        return;
      }

      await saveRecipe(userData.user_id, recipe);
      alert('Recipe saved successfully!');
    } catch (error) {
      if (error.message.includes('already saved')) {
        alert('Recipe is already in your saved recipes!');
      } else {
        alert('Failed to save recipe. Please try again.');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-screen-2xl mx-auto px-6 pt-16 pb-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recipe Suggestions</h2>
            <p className="text-gray-600">Smart recommendations to minimize food waste</p>
          </div>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Suggestions</span>
          </button>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-700 mb-3">
                Based on your pantry analysis, you could save <strong>${pantryInsights.potentialSavings.toFixed(2)}</strong> and prevent 
                food waste this week by using {pantryInsights.expiringItems.length > 0 ? 'expiring items' : 'your pantry items'}.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                {pantryInsights.expiringItems.length > 0 ? (
                  pantryInsights.expiringItems.map((item, index) => {
                    const categoryEmojis = {
                      'Vegetables': '🥕',
                      'Fruits': '🍌', 
                      'Grains': '🍞',
                      'Dairy': '🥛',
                      'Proteins': '🥩',
                      'Spices': '🌿'
                    };
                    const emoji = categoryEmojis[item.category?.[0]] || '🥫';
                    return (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {emoji} {item.item_name} expiring soon
                      </span>
                    );
                  })
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    🌟 {pantryInsights.totalItems} items in your pantry
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.length > 0 ? categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-2xl transition-all duration-300 text-center ${
                selectedCategory === category.id
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md hover:scale-102'
              }`}
            >
              <div className="text-3xl mb-2">{category.emoji}</div>
              <div className="font-medium text-sm">{category.label}</div>
            </button>
          )) : (
            <div className="col-span-full text-center py-4">
              <p className="text-gray-500">Loading categories...</p>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
          >
            Search
          </button>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600">Loading recipes...</span>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No recipes available. API limit may have been reached.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const auth = getAuth();
                          const user = auth.currentUser;
                          if (!user) {
                            alert('Please login to save recipes');
                            return;
                          }
                          const details = await getRecipeDetails(recipe.id);
                          await saveRecipe(user.uid, details);
                          alert('Recipe saved successfully!');
                        } catch (error) {
                          console.error('Error saving recipe:', error);
                          alert('Failed to save recipe');
                        }
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors duration-200"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                      {recipe.readyInMinutes || recipe.cookingMinutes || 'N/A'}min
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-200">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings} servings
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.readyInMinutes || recipe.cookingMinutes || 'N/A'} min
                    </span>
                  </div>
                  
                  {/* Ingredients Section */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Ingredients</h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.extendedIngredients?.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {ingredient.name}
                        </span>
                      )) || (
                        recipe.usedIngredients?.slice(0, 3).map((ingredient, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {ingredient.name}
                          </span>
                        ))
                      )}
                      {(recipe.extendedIngredients?.length > 3 || recipe.usedIngredients?.length > 3) && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          +{(recipe.extendedIngredients?.length || recipe.usedIngredients?.length || 0) - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecipeClick(recipe);
                      }}
                      className="flex-1 px-3 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                    >
                      View Recipe
                    </button>
                    <button 
                      onClick={(e) => handleSaveRecipe(recipe, e)}
                      className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <RecipeDetailModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          recipe={selectedRecipe}
        />

        {/* Voice Recipe Assistant */}
        <VoiceRecipeAssistant />
      </div>
    </>
  );
};

export default RecipeSuggestions;