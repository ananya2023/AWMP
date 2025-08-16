import React, { useState, useEffect } from 'react';
import { Lightbulb, Clock, Users, Zap, RefreshCw, Heart, ChefHat, Loader2, Search, X } from 'lucide-react';
import Header from './Header';
import VoiceRecipeAssistant from './VoiceRecipeAssistant';
import { getRandomRecipes, searchRecipes, getRecipesByIngredients, getRecipeDetails, getRecipesByType } from '../../api/spoonacularApi';

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('pantry-based');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCategories();
    loadRecipes();
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [selectedCategory]);

  const loadCategories = async () => {
    const categoryList = [
      { id: 'pantry-based', label: 'Based on Your Pantry', icon: ChefHat },
      { id: 'quick', label: 'Quick Saves (<15 min)', icon: Zap },
      { id: 'trending', label: 'Trending Now', icon: Lightbulb },
      { id: 'seasonal', label: 'Seasonal Specials', icon: RefreshCw },
      { id: 'innovative', label: 'Innovative Ideas', icon: Lightbulb },
    ];
    setCategories(categoryList);
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
          data = await getRecipesByType('main course', 12);
          break;
        case 'trending':
          data = await getRandomRecipes(12);
          break;
        case 'seasonal':
          data = await getRecipesByType('dessert', 12);
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
      const details = await getRecipeDetails(recipe.id);
      setSelectedRecipe(details);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading recipe details:', error);
    }
  };

  const getIngredients = (recipe) => {
    return recipe.extendedIngredients?.map(ing => 
      `${ing.amount} ${ing.unit} ${ing.name}`
    ) || [];
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
                Based on your pantry analysis, you could save <strong>$15.30</strong> and prevent 
                <strong> 2.4 lbs</strong> of food waste this week by trying these recipes.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  🥕 Carrot tops expiring soon
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                  🍌 5 banana peels available
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                  🍞 Bread getting stale
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.label}</span>
            </button>
          ))}
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
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors duration-200">
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
                      Try Recipe
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add save recipe functionality here
                      }}
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

        {/* Recipe Details Modal */}
        {showModal && selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedRecipe.title}</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {getIngredients(selectedRecipe).map((ingredient, index) => (
                        <li key={index} className="text-gray-700 flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                    <div className="text-gray-700 max-h-64 overflow-y-auto space-y-2">
                      {selectedRecipe.analyzedInstructions?.[0]?.steps?.map((step, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                            {step.number}
                          </span>
                          <p className="text-sm">{step.step}</p>
                        </div>
                      )) || (
                        <div dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
                      )}
                    </div>
                    
                    {selectedRecipe.sourceUrl && (
                      <div className="mt-4">
                        <a
                          href={selectedRecipe.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                        >
                          <span>View Original Recipe</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Recipe Assistant */}
        <VoiceRecipeAssistant />
      </div>
    </>
  );
};

export default RecipeSuggestions;