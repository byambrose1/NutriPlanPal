import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, ShoppingCart, User, Utensils, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Header Navigation */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="text-primary-foreground text-lg" data-testid="logo-icon" />
              </div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="app-title">NutriPlan</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button 
                  variant={isActive("/") ? "default" : "ghost"}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors",
                    isActive("/") && "navigation-active"
                  )}
                  data-testid="nav-dashboard"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/recipes">
                <Button 
                  variant={isActive("/recipes") ? "default" : "ghost"}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors",
                    isActive("/recipes") && "navigation-active"
                  )}
                  data-testid="nav-recipes"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Recipes
                </Button>
              </Link>
              <Link href="/shopping">
                <Button 
                  variant={isActive("/shopping") ? "default" : "ghost"}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors",
                    isActive("/shopping") && "navigation-active"
                  )}
                  data-testid="nav-shopping"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Shopping
                </Button>
              </Link>
              <Link href="/profile">
                <Button 
                  variant={isActive("/profile") ? "default" : "ghost"}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors",
                    isActive("/profile") && "navigation-active"
                  )}
                  data-testid="nav-profile"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" data-testid="notifications-button">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground font-semibold text-sm" data-testid="user-initials">SJ</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center py-2 px-1 h-auto",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
              data-testid="mobile-nav-home"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Home</span>
            </Button>
          </Link>
          <Link href="/recipes">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center py-2 px-1 h-auto",
                isActive("/recipes") ? "text-primary" : "text-muted-foreground"
              )}
              data-testid="mobile-nav-recipes"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs mt-1">Recipes</span>
            </Button>
          </Link>
          <Link href="/shopping">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center py-2 px-1 h-auto",
                isActive("/shopping") ? "text-primary" : "text-muted-foreground"
              )}
              data-testid="mobile-nav-shopping"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xs mt-1">Shopping</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center py-2 px-1 h-auto",
                isActive("/profile") ? "text-primary" : "text-muted-foreground"
              )}
              data-testid="mobile-nav-profile"
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
}
