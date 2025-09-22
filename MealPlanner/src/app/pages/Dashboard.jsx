import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DashboardComponent from '../components/Dashboard';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleDashboardNavigation = (view) => {
    switch(view) {
      case 'savedRecipes':
        navigate('/recipes');
        break;
      case 'mealPlans':
        navigate('/meal-plans');
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

  return (
    <>
      <Header />
      <DashboardComponent onNavigate={handleDashboardNavigation} />
    </>
  );
};

export default Dashboard;