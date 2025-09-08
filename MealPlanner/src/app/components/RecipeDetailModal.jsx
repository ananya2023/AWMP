import React from 'react';
import { X, Clock, Users, Star, Heart } from 'lucide-react';

const RecipeDetailModal = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{recipe.title}</h2>
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>{recipe.readyInMinutes || recipe.cookTime || 'N/A'} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span>{recipe.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : recipe.rating || 'N/A'}</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.extendedIngredients?.map((ingredient, index) => (
                  <li key={index} className="text-gray-700 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>{ingredient.amount} {ingredient.unit} {ingredient.name}</span>
                  </li>
                )) || (
                  recipe.usedIngredients?.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>{ingredient.name}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
              <div className="text-gray-700 max-h-64 overflow-y-auto space-y-2">
                {recipe.analyzedInstructions?.[0]?.steps?.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                      {step.number}
                    </span>
                    <p className="text-sm">{step.step}</p>
                  </div>
                )) || (
                  <div dangerouslySetInnerHTML={{ __html: recipe.instructions || 'No instructions available.' }} />
                )}
              </div>
              
              {recipe.sourceUrl && (
                <div className="mt-4">
                  <a
                    href={recipe.sourceUrl}
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
  );
};

export default RecipeDetailModal;