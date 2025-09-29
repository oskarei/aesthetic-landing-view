
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { useEffect } from "react";
import contentstackClient from "./lib/contentstackClient";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RecipesPage from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";

const queryClient = new QueryClient();

// Component to handle Lytics tracking on route changes
const LyticsTracker = () => {
  const location = useLocation();

  // Initialize jstag.optIn() when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).jstag) {
      (window as any).jstag.optIn();
    }
  }, []);

  // Call jstag.optIn() on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).jstag) {
      (window as any).jstag.optIn();
    }
  }, [location.pathname]);

  return null;
};

const App = () => (
  <ApolloProvider client={contentstackClient}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LyticsTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/matur" element={<RecipesPage />} />
            <Route path="/matur/:slug" element={<RecipeDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ApolloProvider>
);

export default App;
