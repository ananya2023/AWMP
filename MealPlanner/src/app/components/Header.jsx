import React, { useState } from 'react';
import { Leaf, Menu, Bell, User, BookOpen, Calendar, Utensils, ShoppingCart, RefreshCw, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SavedRecipes from './SavedRecipes';
import MealPlansView from './MealPlansView';
import Profile from './MyProfile';
import Pantry from './Pantry';
import VoiceRecipeAssistant from './VoiceRecipeAssistant';
import SmartSubstitutions from './SmartSubstitutions';
import Dashboard from './Dashboard';  

const Header = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPantry, setShowPantry] = useState(false);
  const [showRecipeSuggestions, setShowRecipeSuggestions] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Ananya Miriyala',
    email: 'ananya@example.com',
    phone: '9876543210',
    avatar: 'https://i.pravatar.cc/300',
  });
  


  const handleProfileSave = (updatedData) => {
    setUserData(updatedData);
    setShowProfile(false);
  };

  const menuItems = [
    { text: 'Saved Recipes', icon: <BookOpen size={20} />, action: () => navigate('/recipes') },
    { text: 'My Meal Plans', icon: <Calendar size={20} />, action: () => setShowMealPlan(true) },
    { text: 'Recipe Suggestions', icon: <Utensils size={20} />, action: () => navigate('/suggestions') },
    { text: 'Smart Substitutions', icon: <RefreshCw size={20} />, action: () => setShowSubstitutions(true) },
    { text: 'Pantry', icon: <ShoppingCart size={20} />, action: () => navigate('/pantry') },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (action) => {
    action();
    setDrawerOpen(false);
  };

  const handleDashboardNavigation = (view) => {
    switch(view) {
      case 'savedRecipes':
        navigate('/recipes');
        break;
      case 'mealPlans':
        setShowMealPlan(true);
        break;
      case 'recipeSuggestions':
        navigate('/suggestions');
        break;
      case 'pantry':
        navigate('/pantry');
        break;
      default:
        break;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'recipes', label: 'Saved Recipes' },
    { id: 'meal-plans', label: 'My Meal Plans' },
    { id: 'suggestions', label: 'Recipe Suggestions' },
    { id: 'pantry', label: 'Pantry' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    switch(tabId) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'recipes':
        navigate('/recipes');
        break;
      case 'meal-plans':
        setShowMealPlan(true);
        break;
      case 'suggestions':
        navigate('/suggestions');
        break;
      case 'pantry':
        navigate('/pantry');
        break;
      default:
        break;
    }
  };



  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg group-hover:shadow-emerald-200 group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Leaf className="h-6 w-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">Antiwaste</h1>
                <p className="text-xs text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors duration-300">Meal Planner</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                    activeTab === item.id
                      ? 'text-emerald-600'
                      : 'text-gray-700 hover:text-emerald-600 hover:scale-105'
                  }`}
                >
                  {activeTab === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                  )}
                  <div className="absolute inset-0 bg-emerald-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 -z-10"></div>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-110 hover:bg-emerald-50 rounded-lg group">
                <Search className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </button>
              <button className="p-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-110 hover:bg-emerald-50 rounded-lg relative group">
                <Bell className="h-5 w-5 group-hover:animate-bounce transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse shadow-lg">
                  3
                </span>
              </button>
              <button 
                onClick={() => setShowProfile(true)}
                className="p-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-110 hover:bg-emerald-50 rounded-lg group"
              >
                <User className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </button>
              <button 
                onClick={handleDrawerToggle}
                className="md:hidden p-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-110 hover:bg-emerald-50 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={handleDrawerToggle}
          ></div>
          <div className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 md:hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    Antiwaste
                  </h2>
                </div>
                <button 
                  onClick={handleDrawerToggle}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <hr className="border-gray-200 mb-6" />
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuItemClick(item.action)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl hover:bg-emerald-50 hover:translate-x-2 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-emerald-600 transition-colors duration-300">
                      {item.text}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Saved Recipes Modal */}
      {showSavedRecipes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">My Saved Recipes</h2>
              <button 
                onClick={() => setShowSavedRecipes(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <SavedRecipes />
            </div>
          </div>
        </div>
      )}

      {/* Meal Plans Modal */}
      {showMealPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">My Meal Plans</h2>
              <button 
                onClick={() => setShowMealPlan(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <MealPlansView />
            </div>
          </div>
        </div>
      )}

      {/* Pantry Modal */}
      {showPantry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Pantry Management</h2>
              <button 
                onClick={() => setShowPantry(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <Pantry />
            </div>
          </div>
        </div>
      )}

      {/* Recipe Suggestions Modal */}
      {showRecipeSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Recipe Suggestions</h2>
              <button 
                onClick={() => setShowRecipeSuggestions(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <VoiceRecipeAssistant />
            </div>
          </div>
        </div>
      )}

      {/* Smart Substitutions Modal */}
      {showSubstitutions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Smart Recipe Substitutions</h2>
              <button 
                onClick={() => setShowSubstitutions(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <SmartSubstitutions />
            </div>
          </div>
        </div>
      )}

      <Profile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        userData={userData}
        onSave={handleProfileSave}
      />
    </>
  );
};

export default Header;
