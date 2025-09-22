import React, { useState } from 'react';
import { X, BookOpen, Palette, Save, Sparkles, Heart, Zap, Leaf, Coffee, Pizza, Cake } from 'lucide-react';
import { createRecipeBook } from '../../api/recipeBooksApi';
import Snackbar from './Snackbar';

const CreateRecipeBookModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'from-emerald-500 to-teal-500',
    icon: '📚',
    isPublic: false,
  });

  const colorOptions = [
    { id: 'from-emerald-500 to-teal-500', name: 'Emerald', preview: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    { id: 'from-blue-500 to-indigo-500', name: 'Ocean', preview: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
    { id: 'from-purple-500 to-pink-500', name: 'Sunset', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'from-orange-500 to-red-500', name: 'Fire', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { id: 'from-yellow-500 to-orange-500', name: 'Sunshine', preview: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { id: 'from-green-500 to-emerald-500', name: 'Forest', preview: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'from-pink-500 to-rose-500', name: 'Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { id: 'from-indigo-500 to-purple-500', name: 'Galaxy', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
  ];

  const iconOptions = [
    { emoji: '📚', name: 'Book' },
    { emoji: '🍳', name: 'Cooking' },
    { emoji: '🌱', name: 'Plant' },
    { emoji: '⚡', name: 'Quick' },
    { emoji: '🍰', name: 'Dessert' },
    { emoji: '🥗', name: 'Salad' },
    { emoji: '🍲', name: 'Soup' },
    { emoji: '🍞', name: 'Bread' },
    { emoji: '🥘', name: 'Stew' },
    { emoji: '🍝', name: 'Pasta' },
    { emoji: '🥤', name: 'Drinks' },
    { emoji: '💡', name: 'Ideas' },
    { emoji: '❤️', name: 'Favorites' },
    { emoji: '🌟', name: 'Special' },
    { emoji: '🔥', name: 'Hot' },
    { emoji: '❄️', name: 'Cold' },
  ];

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Book name is required');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) {
        alert('Please log in to create recipe books');
        return;
      }

      await createRecipeBook(userData.user_id, formData);
      setShowSnackbar(true);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error creating recipe book:', error);
      alert('Failed to create recipe book');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white rounded-t-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white/20 p-3 rounded-xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Create Recipe Book</h2>
            </div>
            <p className="text-emerald-100">Organize your recipes into custom collections</p>
          </div>
        </div>

        <div className="p-6">
          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Preview</h3>
            <div className={`relative h-32 bg-gradient-to-br ${formData.color} rounded-2xl overflow-hidden group`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
              <div className="relative z-10 p-6 h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2 animate-bounce">
                    {formData.icon}
                  </div>
                  <h3 className="font-bold text-lg">
                    {formData.name || 'Recipe Book Name'}
                  </h3>
                  <p className="text-sm text-white/80 mt-1">
                    {formData.description || 'Book description'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Quick Weeknight Meals"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublic: false })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      !formData.isPublic
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Private
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublic: true })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      formData.isPublic
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Public
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what kind of recipes this book contains..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose an Icon
              </label>
              <div className="grid grid-cols-8 gap-3">
                {iconOptions.map((option) => (
                  <button
                    key={option.emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: option.emoji })}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                      formData.icon === option.emoji
                        ? 'border-emerald-500 bg-emerald-50 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={option.name}
                  >
                    <div className="text-2xl">{option.emoji}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose a Color Theme
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: option.id })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      formData.color === option.id
                        ? 'border-gray-400 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-12 ${option.preview} rounded-lg mb-2`}></div>
                    <span className="text-sm font-medium text-gray-700">{option.name}</span>
                    {formData.color === option.id && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Smart Suggestions</span>
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    name: 'Quick & Easy',
                    description: 'Fast recipes for busy weekdays',
                    icon: '⚡',
                    color: 'from-yellow-500 to-orange-500'
                  })}
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">⚡</span>
                    <span className="font-medium text-gray-900">Quick & Easy</span>
                  </div>
                  <p className="text-sm text-gray-600">Fast recipes for busy weekdays</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    name: 'Comfort Food',
                    description: 'Hearty, soul-warming recipes',
                    icon: '❤️',
                    color: 'from-orange-500 to-red-500'
                  })}
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">❤️</span>
                    <span className="font-medium text-gray-900">Comfort Food</span>
                  </div>
                  <p className="text-sm text-gray-600">Hearty, soul-warming recipes</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    name: 'Healthy & Fresh',
                    description: 'Nutritious plant-based meals',
                    icon: '🌱',
                    color: 'from-green-500 to-emerald-500'
                  })}
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">🌱</span>
                    <span className="font-medium text-gray-900">Healthy & Fresh</span>
                  </div>
                  <p className="text-sm text-gray-600">Nutritious plant-based meals</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    name: 'Sweet Treats',
                    description: 'Delicious desserts and bakes',
                    icon: '🍰',
                    color: 'from-pink-500 to-rose-500'
                  })}
                  className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">🍰</span>
                    <span className="font-medium text-gray-900">Sweet Treats</span>
                  </div>
                  <p className="text-sm text-gray-600">Delicious desserts and bakes</p>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Create Recipe Book</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar 
        isOpen={showSnackbar}
        message="Recipe book created successfully!"
        onClose={() => setShowSnackbar(false)}
      />
    </div>
  );
};

export default CreateRecipeBookModal;