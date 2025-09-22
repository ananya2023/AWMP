import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Clock, Users, Star, Sparkles, ChefHat, Zap, Loader2, BookOpen, Grid, FolderPlus } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import Header from './Header';
import RecipeDetailModal from './RecipeDetailModal';
import CreateRecipeBookModal from './CreateRecipeBookModal';
import CreateRecipeModal from './CreateRecipeModal';
import { getSavedRecipes, deleteSavedRecipe } from '../../api/savedRecipesApi';
import { getRecipeDetails } from '../../api/spoonacularApi';
import { getRecipeBooks, getRecipesInBook } from '../../api/recipeBooksApi';

const SavedRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('recipes');
  const [showCreateBookModal, setShowCreateBookModal] = useState(false);
  const [recipeBooks, setRecipeBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookRecipes, setBookRecipes] = useState([]);
  const [bookRecipesLoading, setBookRecipesLoading] = useState(false);
  const [showCreateRecipeModal, setShowCreateRecipeModal] = useState(false);

  useEffect(() => {
    loadSavedRecipes();
    if (viewMode === 'books') {
      loadRecipeBooks();
    }
  }, [viewMode]);

  const loadRecipeBooks = async () => {
    try {
      setBooksLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setRecipeBooks([]);
        return;
      }

      const userData = JSON.parse(localStorage.getItem('user_data'));
      const userId = userData?.user_id || user.uid;
      
      const books = await getRecipeBooks(userId);
      setRecipeBooks(books);
    } catch (error) {
      console.error('Error loading recipe books:', error);
      setRecipeBooks([]);
    } finally {
      setBooksLoading(false);
    }
  };

  const loadBookRecipes = async (bookId) => {
    try {
      setBookRecipesLoading(true);
      const recipes = await getRecipesInBook(bookId);
      setBookRecipes(recipes);
    } catch (error) {
      console.error('Error loading book recipes:', error);
      setBookRecipes([]);
    } finally {
      setBookRecipesLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    loadBookRecipes(book.id);
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setBookRecipes([]);
  };

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
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('recipes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                viewMode === 'recipes'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Recipes</span>
            </button>
            <button
              onClick={() => setViewMode('books')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                viewMode === 'books'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Recipe Books</span>
            </button>
          </div>

          {viewMode === 'books' && (
            <button
              onClick={() => setShowCreateBookModal(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Book</span>
            </button>
          )}
        </div>
      </div>

      {/* Recipe Books View */}
      {viewMode === 'books' && !selectedBook && (
        booksLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600">Loading recipe books...</span>
          </div>
        ) : recipeBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipe books yet</h3>
            <p className="text-gray-600">Create your first recipe book to organize your recipes!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipeBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className={`h-32 bg-gradient-to-br ${book.color} flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">{book.icon}</div>
                    <h3 className="font-bold text-lg">{book.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm">{book.recipe_count || 0} recipes</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Created {new Date(book.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Book Recipes View */}
      {viewMode === 'books' && selectedBook && (
        <div>
          {/* Book Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToBooks}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedBook.color} flex items-center justify-center text-white text-xl`}>
                {selectedBook.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedBook.name}</h2>
                <p className="text-gray-600 text-sm">{bookRecipes.length} recipes</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateRecipeModal(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
            >
              <span>Add Recipe</span>
            </button>
          </div>

          {/* Book Recipes Grid */}
          {bookRecipesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600">Loading recipes...</span>
            </div>
          ) : bookRecipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes in this book yet</h3>
              <p className="text-gray-600">Add some recipes to get started!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookRecipes.map((recipe, index) => (
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
                >
                  <div className="relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={recipe.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {recipe.ready_in_minutes && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.ready_in_minutes} min</span>
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search and Filters for Recipes View */}
      {/* {viewMode === 'recipes' && !selectedBook && (
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            {filters.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      )} */}

      {/* Recipe Grid */}
      {viewMode === 'recipes' && !selectedBook && loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading saved recipes...</span>
        </div>
      ) : viewMode === 'recipes' && !selectedBook && recipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved recipes yet</h3>
          <p className="text-gray-600">Start saving recipes from the suggestions page!</p>
        </div>
      ) : viewMode === 'recipes' && !selectedBook && (
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
      
      <CreateRecipeBookModal
        isOpen={showCreateBookModal}
        onClose={() => {
          setShowCreateBookModal(false);
          if (viewMode === 'books') {
            loadRecipeBooks(); // Refresh books after creating
          }
        }}
      />
      
      <CreateRecipeModal
        isOpen={showCreateRecipeModal}
        onClose={() => {
          setShowCreateRecipeModal(false);
          if (selectedBook) {
            loadBookRecipes(selectedBook.id); // Refresh book recipes after creating
          }
        }}
        bookId={selectedBook?.id}
      />
    </>
  );
};

export default SavedRecipes;
