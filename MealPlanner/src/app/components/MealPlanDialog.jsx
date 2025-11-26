import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  X,
  Sparkles,
  RefreshCw,
  Eye,
} from 'lucide-react';
import RecipeDetailModal from './RecipeDetailModal';

const MealPlanDialog = ({
  isOpen,
  onClose,
  selectedDay = 'Mon',
  mealType = 'dinner',
  onSave,
  existingMeal = null,
}) => {
  const [recipeName, setRecipeName] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [notes, setNotes] = useState('');
  const [plannedDay, setPlannedDay] = useState(selectedDay);
  const [plannedMealType, setPlannedMealType] = useState(mealType);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
  ];

  const loadAISuggestions = async () => {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (!userData?.user_id) return;
    
    setIsLoadingSuggestions(true);
    try {
      // Use the existing API functions
      const { get_fridge_inventory, get_recipes_by_ingredients } = await import('../../api/mcpMealPlanApi');
      
      // Get pantry ingredients
      const fridgeInventory = await get_fridge_inventory(userData.user_id);
      const validIngredients = fridgeInventory.map(item => item.name).filter(Boolean);
      
      if (validIngredients.length === 0) {
        setSuggestedRecipes([]);
        return;
      }
      
      // Get recipes based on ingredients and meal type
      const recipes = await get_recipes_by_ingredients(validIngredients, plannedMealType);
      
      // Filter recipes by meal type if not already filtered
      const filteredRecipes = Array.isArray(recipes) ? 
        recipes.filter(recipe => 
          !recipe.mealTypes || recipe.mealTypes.includes(plannedMealType)
        ).slice(0, 5) : [];
      
      setSuggestedRecipes(filteredRecipes);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
      setSuggestedRecipes([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const selectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setRecipeName(recipe.name);
    setCookTime(recipe.cookTime || '');
    setServings(recipe.servings?.toString() || '');
    setNotes(recipe.description || '');
  };

  const viewRecipe = (recipe) => {
    setViewingRecipe({
      ...recipe,
      title: recipe.name,
      image: recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center&q=80'
    });
    setShowRecipeModal(true);
  };

  const handleSave = () => {
    if (!recipeName.trim() || !plannedDay.trim() || !plannedMealType.trim()) {
      alert('Please fill in recipe name, day, and meal type');
      return;
    }

    const mealData = {
      day: plannedDay,
      mealType: plannedMealType,
      name: recipeName,
      cookTime,
      servings,
      notes,
      ...(selectedRecipe && {
        ingredients: selectedRecipe.ingredients,
        instructions: selectedRecipe.instructions,
        difficulty: selectedRecipe.difficulty,
        nutritionInfo: selectedRecipe.nutritionInfo
      })
    };

    if (onSave) {
      onSave(mealData);
    }

    // Reset form
    setRecipeName('');
    setCookTime('');
    setServings('');
    setNotes('');
    setSelectedRecipe(null);
    setSuggestedRecipes([]);
  };

  useEffect(() => {
    setPlannedDay(selectedDay);
    setPlannedMealType(mealType);
    
    if (existingMeal) {
      setRecipeName(existingMeal.name || '');
      setCookTime(existingMeal.cookTime || '');
      setServings(existingMeal.servings || '');
      setNotes(existingMeal.notes || '');
    } else {
      setRecipeName('');
      setCookTime('');
      setServings('');
      setNotes('');
      setSelectedRecipe(null);
      setSuggestedRecipes([]);
    }
  }, [selectedDay, mealType, existingMeal]);

  useEffect(() => {
    if (isOpen && !existingMeal) {
      loadAISuggestions();
    }
  }, [isOpen, plannedMealType, existingMeal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar size={20} className="mr-2 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Plan Your Meal</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(70vh-120px)]">
          {/* AI Recipe Suggestions */}
          {!existingMeal && (
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">AI Recipe Suggestions</h3>
                </div>
                <button
                  type="button"
                  onClick={loadAISuggestions}
                  disabled={isLoadingSuggestions}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              
              {isLoadingSuggestions ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Finding recipes with your pantry ingredients...</p>
                </div>
              ) : suggestedRecipes.length > 0 ? (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {suggestedRecipes.map((recipe, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedRecipe?.name === recipe.name
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-25'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 cursor-pointer" onClick={() => selectRecipe(recipe)}>
                          <h4 className="font-medium text-gray-900 text-sm">{recipe.name}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            {recipe.cookTime && <span>⏱️ {recipe.cookTime}</span>}
                            {recipe.difficulty && <span>📊 {recipe.difficulty}</span>}
                            {recipe.servings && <span>👥 {recipe.servings}</span>}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewRecipe(recipe);
                          }}
                          className="ml-2 p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="View Recipe Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-2">
                  No recipes found with your current pantry items. Try adding more ingredients!
                </p>
              )}
            </div>
          )}
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe/Dish Name *
              </label>
              <input
                type="text"
                required
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Enter recipe or dish name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day *
                </label>
                <select
                  required
                  value={plannedDay}
                  onChange={(e) => setPlannedDay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Type *
                </label>
                <select
                  required
                  value={plannedMealType}
                  onChange={(e) => setPlannedMealType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {mealTypes.map((meal) => (
                    <option key={meal.value} value={meal.value}>
                      {meal.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cook Time
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g., 30 min"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servings
                </label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g., 4"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                placeholder="Any special notes or reminders"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>
          </form>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            {existingMeal ? 'Update Plan' : 'Add to Plan'}
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
      
      <RecipeDetailModal
        isOpen={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        recipe={viewingRecipe}
      />
    </div>
  );
};

export default MealPlanDialog;
