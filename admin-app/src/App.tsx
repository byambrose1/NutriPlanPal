import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminHouseholds from "@/pages/admin/households";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminLogin from "./pages/login";
import { useQuery } from "@tanstack/react-query";

function Router() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.isAdmin || false;

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  return (
    <Switch>
      <Route path="/" component={AdminDashboard} />
      <Route path="/users" component={AdminUsers} />
      <Route path="/households" component={AdminHouseholds} />
      <Route path="/analytics" component={AdminAnalytics} />
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
