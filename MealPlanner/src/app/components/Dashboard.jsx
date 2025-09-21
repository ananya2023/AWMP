import React, { useState, useEffect } from 'react';
import { Leaf, Calendar, Lightbulb, Package, Clock, Star, Sparkles, ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';
import FoodGirlAnimation from '../../assets/FoodGirl.json';
import { getPantryItems } from '../../api/pantryApi';
import { getSavedRecipes } from '../../api/savedRecipesApi';
import { getMealPlans } from '../../api/mealPlansApi';
import { getAuth } from 'firebase/auth';

const Dashboard = ({ onNavigate }) => {
  const [dashboardData, setDashboardData] = useState({
    totalPantryItems: 0,
    expiringItems: 0,
    savedRecipesCount: 0,
    mealPlansCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(localStorage.getItem('user_data'));
      const userId = userData?.user_id || user.uid;

      const [pantryItems, savedRecipes, mealPlans] = await Promise.all([
        getPantryItems(userId).catch(() => []),
        getSavedRecipes(userId).catch(() => []),
        getMealPlans(userId).catch(() => [])
      ]);

      const today = new Date();
      const expiringItems = pantryItems.filter(item => {
        if (!item.expiry_date) return false;
        const expiryDate = new Date(item.expiry_date);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      });

      setDashboardData({
        totalPantryItems: pantryItems.length,
        expiringItems: expiringItems.length,
        savedRecipesCount: savedRecipes.length,
        mealPlansCount: mealPlans.length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Meals Planned', value: loading ? '...' : dashboardData.mealPlansCount.toString(), icon: Calendar, color: '#3b82f6' },
    { label: 'Recipes Saved', value: loading ? '...' : dashboardData.savedRecipesCount.toString(), icon: Star, color: '#f59e0b' },
    { label: 'Pantry Items', value: loading ? '...' : dashboardData.totalPantryItems.toString(), icon: Package, color: '#8b5cf6' },
  ];

  const quickActions = [
    {
      id: 'savedRecipes',
      title: 'Saved Recipes',
      description: 'Browse your collection of favorite waste-reducing recipes',
      icon: Leaf,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      count: loading ? 'Loading...' : `${dashboardData.savedRecipesCount} recipes`,
    },
    {
      id: 'mealPlans',
      title: 'My Meal Plans',
      description: 'Plan your week and optimize ingredient usage',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      count: loading ? 'Loading...' : `${dashboardData.mealPlansCount} plans`,
    },
    {
      id: 'recipeSuggestions',
      title: 'Recipe Suggestions',
      description: 'Smart recommendations based on your pantry',
      icon: Lightbulb,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      count: 'Discover new',
    },
    {
      id: 'pantry',
      title: 'Pantry',
      description: 'Track ingredients and expiration dates',
      icon: Package,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      count: loading ? 'Loading...' : `${dashboardData.expiringItems} expiring soon`,
    },
  ];

  const recentActivity = [
    { action: 'Track your', item: 'pantry items and meal plans', time: 'Start now', color: '#10b981' },
    { action: 'Save recipes', item: 'from suggestions page', time: 'Explore recipes', color: '#3b82f6' },
    { action: 'Plan meals', item: 'for the upcoming week', time: 'Get organized', color: '#f59e0b' },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto py-8 px-6">
      {/* Welcome Card */}
      <div className="mb-8 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 relative overflow-hidden rounded-3xl border border-emerald-200 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/15 group">
        <div className="welcome-bg-1 absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-emerald-500/10 to-transparent rounded-full transform translate-x-16 -translate-y-16 transition-transform duration-700 group-hover:translate-x-14 group-hover:-translate-y-14 group-hover:scale-150"></div>
        <div className="welcome-bg-2 absolute bottom-0 left-0 w-24 h-24 bg-gradient-radial from-emerald-600/8 to-transparent rounded-full transform -translate-x-12 translate-y-12 transition-transform duration-700 group-hover:-translate-x-10 group-hover:translate-y-10 group-hover:scale-125"></div>
        <div className="flex items-center p-12 relative z-10">
          <div className="flex-1 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">
              <span className="inline-block transition-transform duration-300 hover:animate-bounce">Welcome</span>{' '}
              <span className="inline-block transition-transform duration-300 hover:animate-bounce">back</span>{' '}
              <span className="inline-block transition-transform duration-300 hover:animate-bounce">to</span>{' '}
              <span className="inline-block transition-transform duration-300 hover:animate-bounce">your</span>{' '}
              <span className="inline-block transition-transform duration-300 hover:animate-bounce text-emerald-600">sustainable</span>{' '}
              <span className="inline-block transition-transform duration-300 hover:animate-bounce">kitchen!</span>{' '}
              <span className="text-4xl animate-pulse">🌱</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-normal">
              You're making a real difference. Every meal planned is a step toward reducing food waste and creating a more sustainable future. Let's plan something delicious today!
            </p>
          </div>
          <div className="ml-8">
            <Lottie 
              animationData={FoodGirlAnimation}
              style={{ width: 200, height: 200 }}
              loop
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white p-6 border border-gray-100 rounded-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-110">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" style={{ color: stat.color }}>
                  <IconComponent size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="bg-white p-6 cursor-pointer border border-gray-100 rounded-2xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl group"
            >
              <div className="shimmer absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl text-white shadow-lg relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ background: action.gradient }}>
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600">
                      {action.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">
                        {action.count}
                      </span>
                      <ArrowRight 
                        className="w-4 h-4 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-600" 
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 border border-gray-100 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-emerald-600 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div>
          {recentActivity.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:scale-105 group"
            >
              <div
                className="w-3 h-3 rounded-full animate-pulse transition-transform duration-300 group-hover:scale-125"
                style={{ backgroundColor: activity.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold">{activity.action}</span> {activity.item}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>
              <ArrowRight 
                className="w-4 h-4 text-gray-300 opacity-0 transition-all duration-300 group-hover:opacity-100" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;