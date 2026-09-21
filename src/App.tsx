import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import { AppNav } from "@/components/AppNav";
import { ContactFooter } from "@/components/ContactFooter";
import { VendorsPage } from "./pages/VendorsPage";
import { RouteSeo } from "@/features/seo/RouteSeo";
import { VendorMenuPage } from "./pages/VendorMenuPage";
import Index from "./pages/Index";
import { BrowsePage } from "./pages/BrowsePage";
import LocationDetail from "./pages/LocationDetail";
import NotFound from "./pages/NotFound";
import { PlanPage } from "./pages/PlanPage";

const MapPage = lazy(() => import("./pages/MapPage").then((m) => ({ default: m.MapPage })));

const queryClient = new QueryClient();

function RouteLoadingFallback() {
  return <p className="p-8 text-center text-sm text-muted-foreground">Loading…</p>;
}

export function AppRoutes() {
  return (
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <RouteSeo />
      <AppNav />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/vendors/:id" element={<VendorMenuPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/location/:id" element={<LocationDetail />} />
          <Route path="/masslive-favorites" element={<Navigate replace to="/" />} />
          <Route path="/drinks" element={<Navigate replace to="/browse?categories=cocktails,mocktails,beer-cider,nonalcoholic-drinks" />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/map" element={<MapPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ContactFooter email="contact@bigeeats.com" />
    </div>
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
