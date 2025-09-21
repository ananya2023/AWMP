import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Clock, Users, Star, Sparkles, ChefHat, Zap, Loader2 } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import Header from './Header';
import RecipeDetailModal from './RecipeDetailModal';
import { getSavedRecipes, deleteSavedRecipe } from '../../api/savedRecipesApi';
import { getRecipeDetails } from '../../api/spoonacularApi';

const SavedRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      const savedRecipes = await getSavedRecipes(user.uid);
      setRecipes(savedRecipes);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      await deleteSavedRecipe(userData.user_id, recipeId);
      setRecipes(recipes.filter(recipe => recipe.recipe_id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  const filters = [
    { id: 'all', label: 'All Recipes' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'quick', label: 'Quick (<30 min)' },
    { id: 'high-waste-reduction', label: 'High Waste Reduction' },
  ];

  return (
    <>
      <Header />
      <div className="max-w-screen-2xl mx-auto px-6 pt-16 pb-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-emerald-500 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-900">Saved Recipes</h2>
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-gray-600 mt-1">Your collection of waste-reducing culinary creations</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-hover:text-emerald-500 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:shadow-md transition-all duration-300 group"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm hover:shadow-md transition-all duration-300"
          >
            {filters.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading saved recipes...</span>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved recipes yet</h3>
          <p className="text-gray-600">Start saving recipes from the suggestions page!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id}
              onClick={async () => {
                try {
                  if (recipe.recipe_id) {
                    const fullRecipe = await getRecipeDetails(recipe.recipe_id);
                    setSelectedRecipe(fullRecipe);
                  } else {
                    setSelectedRecipe(recipe);
                  }
                  setShowModal(true);
                } catch (error) {
                  console.error('Error fetching recipe details:', error);
                  setSelectedRecipe(recipe);
                  setShowModal(true);
                }
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <img
                  src={recipe.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={recipe.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecipe(recipe.recipe_id);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-300 group/heart"
                  >
                    <Heart className="h-4 w-4 fill-current group-hover/heart:animate-pulse" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium rounded-full shadow-lg">
                    Saved Recipe
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                  {recipe.title}
                </h3>
                
                {/* Meta Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  {recipe.ready_in_minutes && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 group-hover:animate-spin transition-transform duration-300" />
                      <span>{recipe.ready_in_minutes} min</span>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  )}
                </div>

                {/* Date Saved */}
                <div className="text-xs text-gray-500 mb-4">
                  Saved on {new Date(recipe.date_saved).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end">
                  {recipe.source_url && (
                    <a 
                      href={recipe.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-1 group/btn"
                    >
                      View Recipe →
                      <Sparkles className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      </div>
      
      <RecipeDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recipe={selectedRecipe}
      />
    </>
  );
};

export default SavedRecipes;
