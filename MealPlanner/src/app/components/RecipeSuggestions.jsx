import React, { useState } from 'react';
import { Lightbulb, Clock, Users, Zap, RefreshCw, Heart, ChefHat } from 'lucide-react';
import Header from './Header';
import VoiceRecipeAssistant from './VoiceRecipeAssistant';

const RecipeSuggestions = () => {
  const [selectedCategory, setSelectedCategory] = useState('pantry-based');

  const suggestions = [
    {
      id: 1,
      title: 'Carrot Top Pesto Pasta',
      description: 'Transform those carrot tops into a delicious pesto sauce',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Carrot tops', 'Pasta', 'Garlic', 'Olive oil'],
      cookTime: '20 min',
      servings: 4,
      wasteReduced: 90,
      difficulty: 'Easy',
      reason: 'You have carrot tops expiring in 2 days',
      category: 'pantry-based',
    },
    {
      id: 2,
      title: 'Banana Peel Chutney',
      description: 'A unique and flavorful chutney from banana peels',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Banana peels', 'Onions', 'Spices', 'Vinegar'],
      cookTime: '30 min',
      servings: 6,
      wasteReduced: 100,
      difficulty: 'Medium',
      reason: 'You have 5 banana peels from this week',
      category: 'innovative',
    },
    {
      id: 3,
      title: 'Stale Bread Croutons',
      description: 'Give new life to day-old bread with herbed croutons',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Stale bread', 'Herbs', 'Olive oil', 'Salt'],
      cookTime: '15 min',
      servings: 4,
      wasteReduced: 95,
      difficulty: 'Easy',
      reason: 'You have bread expiring today',
      category: 'pantry-based',
    },
    {
      id: 4,
      title: 'Vegetable Scrap Stock',
      description: 'Create a rich stock from vegetable scraps and peels',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Veggie scraps', 'Water', 'Bay leaves', 'Peppercorns'],
      cookTime: '45 min',
      servings: 8,
      wasteReduced: 100,
      difficulty: 'Easy',
      reason: 'Perfect for using accumulated scraps',
      category: 'trending',
    },
    {
      id: 5,
      title: 'Overripe Fruit Smoothie',
      description: 'Blend overripe fruits into a nutritious smoothie',
      image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Overripe fruits', 'Yogurt', 'Honey', 'Ice'],
      cookTime: '5 min',
      servings: 2,
      wasteReduced: 85,
      difficulty: 'Easy',
      reason: 'Quick way to use soft fruits',
      category: 'quick',
    },
    {
      id: 6,
      title: 'Leftover Rice Pudding',
      description: 'Transform leftover rice into a creamy dessert',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Leftover rice', 'Milk', 'Sugar', 'Cinnamon'],
      cookTime: '25 min',
      servings: 4,
      wasteReduced: 90,
      difficulty: 'Easy',
      reason: 'Great for day-old rice',
      category: 'seasonal',
    },
  ];

  const categories = [
    { id: 'pantry-based', label: 'Based on Your Pantry', icon: ChefHat },
    { id: 'quick', label: 'Quick Saves (<15 min)', icon: Zap },
    { id: 'trending', label: 'Trending Now', icon: Lightbulb },
    { id: 'seasonal', label: 'Seasonal Specials', icon: RefreshCw },
    { id: 'innovative', label: 'Innovative Ideas', icon: Lightbulb },
  ];

  const filteredSuggestions = suggestions.filter(
    (suggestion) => suggestion.category === selectedCategory
  );

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

        {/* Suggestions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={suggestion.image}
                  alt={suggestion.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors duration-200">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                    {suggestion.wasteReduced}% waste reduced
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-200">
                  {suggestion.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {suggestion.description}
                </p>

                {/* Why suggested */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800 flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>{suggestion.reason}</span>
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{suggestion.cookTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{suggestion.servings} servings</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    suggestion.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {suggestion.difficulty}
                  </span>
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Key Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.ingredients.slice(0, 3).map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {suggestion.ingredients.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{suggestion.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors duration-200">
                    Try Recipe
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Recipe Assistant Section */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border border-indigo-100 shadow-lg">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Recipe Assistant</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ask me anything about cooking! I can help you find recipes, suggest ingredient substitutions, 
              provide cooking tips, and guide you through any recipe step-by-step.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VoiceRecipeAssistant />
          </div>
        </div>

        {/* Load More */}
        <div className="text-center">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
            Show More Suggestions
          </button>
        </div>
      </div>
    </>
  );
};

export default RecipeSuggestions;