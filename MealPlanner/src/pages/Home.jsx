import React from 'react';
import Header from '../components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* <HeroSection />
      
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Impact</h2>
            <p className="text-gray-600">Track your progress in reducing food waste</p>
          </div>
          <WasteStats />
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Pantry Management</h2>
            <p className="text-gray-600">Add items quickly and get AI-powered recipe suggestions</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <ReceiptScanner />
            <AIRecipeGenerator />
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <InventoryTracker />
              <RecipeSuggestions />
            </div>
            <div className="space-y-8">
              <MealPlanner />
              <SmartShoppingList />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Journey</h2>
            <p className="text-gray-600">Celebrate your food waste reduction achievements</p>
          </div>
          <Achievements />
        </div>
      </section> */}
    </div>
  );
};

export default Index;


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



