
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../src/app/pages/Index";
import NotFound from "../src/app/pages/NotFound";
import  Home  from "../src/app/pages/Home";
import Dashboard from "../src/app/pages/Dashboard";
import SavedRecipes from "../src/app/components/SavedRecipes";
import RecipeSuggestions from "../src/app/components/RecipeSuggestions";
import PantryPage from "../src/app/pages/PantryPage";
import MealPlansPage from "../src/app/pages/MealPlansPage";
import AuthForm from "../src/app/components/AuthForm";
import ProtectedRoute from "../src/app/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="max-w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<AuthForm />} />
          {/* <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} /> */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute><SavedRecipes /></ProtectedRoute>} />
          <Route path="/suggestions" element={<ProtectedRoute><RecipeSuggestions /></ProtectedRoute>} />
          <Route path="/pantry" element={<ProtectedRoute><PantryPage /></ProtectedRoute>} />
          <Route path="/meal-plans" element={<ProtectedRoute><MealPlansPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;