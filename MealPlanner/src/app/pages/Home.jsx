import React from 'react';
import Header from '../components/Header';
import YourImpact from '../components/YourImpact';
import ReceiptScanner from '../components/ReceiptsScanner';
import AIRecipeGenerator from '../components/AIRecipeGenerator';
import VoiceRecipeAssistant from '../components/VoiceRecipeAssistant';
import InventoryTracker from '../components/InventoryTracker';
import MealPlanner from '../components/MealPlanner';
import SmartShoppingList from '../components/SmartShoppingList';
// import Achievements from '../components/Achievements';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
     
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-8">
                 {/* <YourImpact /> */}
                {/* <RecipeSuggestions /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ReceiptScanner />
      <AIRecipeGenerator /> */}

      {/* Section: Your Impact */}

      {/* Smart Pantry Management Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Smart Pantry Management
            </h2>
            <p className="text-lg text-gray-600">
              Add items quickly and get AI-powered recipe suggestions
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ReceiptScanner />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recipe Assistant Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What Can I Make Today
            </h2>
            <p className="text-lg text-gray-600">
              Create recipes with your available ingredients
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <VoiceRecipeAssistant />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-8">
                <InventoryTracker />
                {/* <RecipeSuggestions /> */}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="flex flex-col gap-8">
                <MealPlanner />
                <SmartShoppingList />
              </div>
            </div>
          </div>
        </div>
      </div>
       {/*
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Journey
            </h2>
            <p className="text-lg text-gray-600">
              Celebrate your food waste reduction achievements
            </p>
          </div>
          <Achievements />
        </div>
      </div>
      */}
    </div>
  );
};

export default Home;



// const Home = () => {
//   const navigate = useNavigate();

//   const auth = getAuth(app);
//   const logout = () => {
//     console.log("Logout in clicked");
//     const auth = getAuth();
//     signOut(auth).then(() => {
//       navigate("/");
//       // Sign-out successful.
//     }).catch((error) => {
//       // An error happened.
//     });
//   };



