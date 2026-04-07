import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, ChefHat, Loader2 } from 'lucide-react';
import { getPublicRecipeBook } from '../../../api/recipeBooksApi';
import RecipeDetailModal from '../RecipeDetailModal';

const PublicRecipeBook = () => {
  const { shareId } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPublicBook();
  }, [shareId]);

  const loadPublicBook = async () => {
    try {
      setLoading(true);
      const result = await getPublicRecipeBook(shareId);
      setBookData(result.data);
    } catch (error) {
      console.error('Error loading public book:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Loading recipe book...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Recipe Book Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${bookData.book.color} flex items-center justify-center text-white text-2xl`}>
              {bookData.book.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{bookData.book.name}</h1>
              <p className="text-gray-600">{bookData.recipes.length} recipes • by {bookData.book.user_name || 'Anonymous'}</p>
            </div>
          </div>
          {bookData.book.description && (
            <p className="text-gray-700">{bookData.book.description}</p>
          )}
        </div>

        {/* Recipes Grid */}
        {bookData.recipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes in this book</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookData.recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setShowModal(true);
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <img
                  src={recipe.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
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

      <RecipeDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recipe={selectedRecipe}
      />
    </>
  );
};

export default PublicRecipeBook;