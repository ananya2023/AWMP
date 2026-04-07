import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// Pages
import NotFound from "../src/app/pages/NotFound";
import DashboardPage from "../src/app/pages/DashboardPage";
import RecipesPage from "./app/pages/RecipesPage";
import RecipeSuggestionsPage from "./app/pages/RecipeSuggestionsPage";
// import RecipeBooksPage from "./app/pages/RecipeBooksPage";
import MealPlansPage from "../src/app/pages/MealPlansPage";
import PantryPage from "../src/app/pages/PantryPage";
import MyProfilePage from "./app/pages/MyProfilePage";

import AuthForm from "../src/app/components/Auth/AuthForm";
import ProtectedRoute from "../src/app/components/ProtectedRoute";
import PublicRecipeBook from "./app/components/Recipes/PublicRecipeBook";
import { getUserData } from "../src/utils/userStorage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="max-w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={getUserData() ? <Navigate to="/dashboard" replace /> : <DashboardPage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute><RecipesPage /></ProtectedRoute>} />
          <Route path="/recipe-suggestions" element={<ProtectedRoute><RecipeSuggestionsPage /></ProtectedRoute>} />
          {/* <Route path="/recipe-books" element={<ProtectedRoute><RecipeBooksPage /></ProtectedRoute>} /> */}
          <Route path="/pantry" element={<ProtectedRoute><PantryPage /></ProtectedRoute>} />
          <Route path="/meal-plans" element={<ProtectedRoute><MealPlansPage /></ProtectedRoute>} />
          <Route path="/my-profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
          <Route path="/public/:shareId" element={<PublicRecipeBook />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;