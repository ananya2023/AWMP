import React, { useState } from 'react';
import { X, Plus, Minus, Clock, Users, Tag } from 'lucide-react';
import { createCustomRecipe, addRecipeToBook } from '../../api/recipeBooksApi';
import Snackbar from './Snackbar';

const CreateRecipeModal = ({ isOpen, onClose, onRecipeCreated, bookId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [],
    prep_time: '',
    servings: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    steps: [''],
    notes: ''
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Recipe name is required');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      console.log('User data:', userData);
      
      if (!userData?.user_id) {
        alert('Please log in to create recipes');
        return;
      }

      const recipePayload = {
        ...formData,
        prep_time: parseInt(formData.prep_time) || 0,
        servings: parseInt(formData.servings) || 1,
        ingredients: formData.ingredients.filter(ing => ing.name.trim()),
        steps: formData.steps.filter(step => step.trim())
      };
      
      console.log('Recipe payload:', recipePayload);
      console.log('User ID:', userData.user_id);
      
      const result = await createCustomRecipe(userData.user_id, recipePayload);
      console.log('Recipe creation result:', result);

      // If bookId is provided, add the recipe to the book
      if (bookId && result.data?.id) {
        try {
          await addRecipeToBook(bookId, result.data.id);
          console.log('Recipe added to book successfully');
        } catch (bookError) {
          console.error('Error adding recipe to book:', bookError);
        }
      }

      setShowSnackbar(true);
      if (onRecipeCreated) onRecipeCreated();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        tags: [],
        prep_time: '',
        servings: '',
        ingredients: [{ name: '', amount: '', unit: '' }],
        steps: [''],
        notes: ''
      });
      
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error creating recipe:', error);
      console.error('Error details:', error.message);
      alert(`Failed to create recipe: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Create New Recipe</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter recipe name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    value={formData.prep_time}
                    onChange={(e) => handleInputChange('prep_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Servings
                  </label>
                  <input
                    type="number"
                    value={formData.servings}
                    onChange={(e) => handleInputChange('servings', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Brief description of the recipe"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-emerald-600 hover:text-emerald-800">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Add a tag"
                />
                <button onClick={addTag} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  Add
                </button>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="1"
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="cup"
                  />
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ingredient name"
                  />
                  <button onClick={() => removeIngredient(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button onClick={addIngredient} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Plus className="h-4 w-4" />
                Add Ingredient
              </button>
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder={`Step ${index + 1} instructions`}
                    rows={2}
                  />
                  <button onClick={() => removeStep(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button onClick={addStep} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Plus className="h-4 w-4" />
                Add Step
              </button>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Additional notes or tips"
              />
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Create Recipe
            </button>
          </div>
        </div>
      </div>
      
      <Snackbar 
        isOpen={showSnackbar}
        message="Recipe created successfully!"
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
};

export default CreateRecipeModal;