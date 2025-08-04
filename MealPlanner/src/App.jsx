
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../src/app/pages/Index";
import NotFound from "../src/app/pages/NotFound";
import  Home  from "../src/app/pages/Home";
import Dashboard from "../src/app/pages/Dashboard";
import SavedRecipes from "../src/app/components/SavedRecipes";
import RecipeSuggestions from "../src/app/components/RecipeSuggestions";
import PantryPage from "../src/app/pages/PantryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="max-w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recipes" element={<SavedRecipes />} />
          <Route path="/suggestions" element={<RecipeSuggestions />} />
          <Route path="/pantry" element={<PantryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;