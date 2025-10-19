import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import Recipes from "@/pages/recipes";
import Shopping from "@/pages/shopping";
import Pantry from "@/pages/pantry";
import NutritionReports from "@/pages/nutrition-reports";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminHouseholds from "@/pages/admin/households";
import AdminAnalytics from "@/pages/admin/analytics";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Landing />}
      </Route>
      <Route path="/onboarding">
        {isAuthenticated ? <Onboarding /> : <Redirect to="/" />}
      </Route>
      <Route path="/dashboard">
        {isAuthenticated ? <Dashboard /> : <Redirect to="/" />}
      </Route>
      <Route path="/recipes">
        {isAuthenticated ? <Recipes /> : <Redirect to="/" />}
      </Route>
      <Route path="/shopping">
        {isAuthenticated ? <Shopping /> : <Redirect to="/" />}
      </Route>
      <Route path="/pantry">
        {isAuthenticated ? <Pantry /> : <Redirect to="/" />}
      </Route>
      <Route path="/nutrition">
        {isAuthenticated ? <NutritionReports /> : <Redirect to="/" />}
      </Route>
      <Route path="/profile">
        {isAuthenticated ? <Profile /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin">
        {isAuthenticated ? <AdminDashboard /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin/users">
        {isAuthenticated ? <AdminUsers /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin/households">
        {isAuthenticated ? <AdminHouseholds /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin/analytics">
        {isAuthenticated ? <AdminAnalytics /> : <Redirect to="/" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
