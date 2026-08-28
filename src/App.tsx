import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import Index from "./pages/Index";
import { BrowsePage } from "./pages/BrowsePage";
import LocationDetail from "./pages/LocationDetail";
import MassLiveFavoritesPage from "./pages/MassLiveFavoritesPage";
import NotFound from "./pages/NotFound";
import DrinksPage from "./pages/DrinksPage";
import { PlanPage } from "./pages/PlanPage";

const queryClient = new QueryClient();

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/location/:id" element={<LocationDetail />} />
      <Route path="/masslive-favorites" element={<MassLiveFavoritesPage />} />
      <Route path="/drinks" element={<DrinksPage />} />
      <Route path="/plan" element={<PlanPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FoodPlanProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AppRoutes />
        </BrowserRouter>
      </FoodPlanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
