import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LocationDetail from "./pages/LocationDetail";
import MassLiveFavoritesPage from "./pages/MassLiveFavoritesPage";
import NotFound from "./pages/NotFound";
import DrinksPage from "./pages/DrinksPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/big-e-eats-map">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/location/:id" element={<LocationDetail />} />
          <Route path="/masslive-favorites" element={<MassLiveFavoritesPage />} />
          <Route path="/drinks" element={<DrinksPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
