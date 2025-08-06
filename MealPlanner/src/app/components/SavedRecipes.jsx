import React, { useState } from 'react';
import { Search, Filter, Heart, Clock, Users, Star, Sparkles, ChefHat, Zap } from 'lucide-react';
import Header from './Header';

const SavedRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const recipes = [
    {
      id: 1,
      title: 'Zero-Waste Veggie Stir Fry',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '15 min',
      servings: 4,
      difficulty: 'Easy',
      wasteReduced: 85,
      tags: ['vegetarian', 'quick', 'leftovers'],
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Leftover Bread Pudding',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '45 min',
      servings: 6,
      difficulty: 'Medium',
      wasteReduced: 95,
      tags: ['dessert', 'bread rescue'],
      rating: 4.6,
    },
    {
      id: 3,
      title: 'Banana Peel Curry',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '30 min',
      servings: 4,
      difficulty: 'Medium',
      wasteReduced: 100,
      tags: ['innovative', 'vegan', 'exotic'],
      rating: 4.5,
    },
    {
      id: 4,
      title: 'Vegetable Scrap Broth',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '60 min',
      servings: 8,
      difficulty: 'Easy',
      wasteReduced: 90,
      tags: ['soup', 'base', 'scraps'],
      rating: 4.9,
    },
    {
      id: 5,
      title: 'Wilted Greens Pasta',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '20 min',
      servings: 4,
      difficulty: 'Easy',
      wasteReduced: 80,
      tags: ['pasta', 'greens', 'quick'],
      rating: 4.7,
    },
    {
      id: 6,
      title: 'Fruit Peel Smoothie',
      image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=400',
      cookTime: '5 min',
      servings: 2,
      difficulty: 'Easy',
      wasteReduced: 75,
      tags: ['smoothie', 'healthy', 'breakfast'],
      rating: 4.4,
    },
  ];

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image */}
            <div className="relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-3 right-3">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-300 group/heart">
                  <Heart className="h-4 w-4 fill-current group-hover/heart:animate-pulse" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium rounded-full shadow-lg animate-pulse">
                  {recipe.wasteReduced}% waste reduced
                </span>
              </div>
              {recipe.wasteReduced >= 90 && (
                <div className="absolute top-3 left-3">
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-bounce">
                    <Zap className="h-3 w-3" />
                    <span>Super Saver!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                {recipe.title}
              </h3>
              
              {/* Meta Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 group-hover:animate-spin transition-transform duration-300" />
                  <span>{recipe.cookTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current group-hover:animate-pulse" />
                  <span>{recipe.rating}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-300 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Difficulty */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  recipe.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {recipe.difficulty}
                </span>
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-1 group/btn">
                  View Recipe →
                  <Sparkles className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg">
          Load More Recipes
        </button>
      </div>
      </div>
    </>
  );
};

export default SavedRecipes;
