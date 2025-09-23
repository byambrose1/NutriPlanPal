import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RecipeCard } from "@/components/recipe-card";
import { MealPlanGrid } from "@/components/meal-plan-grid";
import { NutritionOverview } from "@/components/nutrition-overview";
import { FeedbackDisplay } from "@/components/feedback/feedback-display";
import { MealPlanFeedback } from "@/components/feedback/meal-plan-feedback";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Plus, List, PieChart, Baby, Sparkles, Route, ChevronLeft, ChevronRight, DollarSign, Calendar, Clock, Heart, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  // Mock user data - in production this would come from authentication
  const currentUserId = "user-1";
  const [showMealPlanFeedback, setShowMealPlanFeedback] = useState(false);

  // Fetch active meal plan
  const { data: activeMealPlan, isLoading: mealPlanLoading } = useQuery({
    queryKey: ['/api/users', currentUserId, 'meal-plans', 'active'],
    enabled: !!currentUserId
  });

  // Fetch active shopping list
  const { data: activeShoppingList } = useQuery({
    queryKey: ['/api/users', currentUserId, 'shopping-lists', 'active'],
    enabled: !!currentUserId
  });

  // Fetch recommended recipes
  const { data: recipes = [] } = useQuery({
    queryKey: ['/api/recipes'],
  });

  // Generate meal plan mutation
  const generateMealPlanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/meal-plans/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familySize: 4,
          weeklyBudget: 150,
          dietaryRestrictions: [],
          allergies: [],
          cookingSkillLevel: 'intermediate',
          goals: ['healthy_eating'],
          preferredCuisines: ['american', 'italian', 'mexican'],
          dislikedIngredients: [],
          equipment: ['stove', 'oven', 'microwave'],
          childrenAges: [8, 12],
          mealPrepPreference: 'some'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'meal-plans'] });
      toast({
        title: "Meal Plan Generated!",
        description: "Your personalized weekly meal plan is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleGenerateMealPlan = () => {
    generateMealPlanMutation.mutate();
  };

  const mockWeeklyStats = {
    budgetSpent: 127,
    budgetTotal: 150,
    mealsPlanned: 18,
    totalMeals: 21,
    prepTimeSaved: "4.5h",
    familyRating: 4.8
  };

  const mockNutritionData = {
    calories: { current: 1330, target: 1800 },
    protein: { current: 98, target: 120 },
    fiber: { current: 19, target: 30 },
    carbs: { current: 165, target: 225 },
    fat: { current: 52, target: 60 }
  };

  const mockShoppingItems = [
    { id: 1, name: "Organic Chicken Breast", completed: false, price: 8.99, store: "Whole Foods" },
    { id: 2, name: "Quinoa (2 cups)", completed: false, price: 6.49, store: "Target" },
    { id: 3, name: "Baby Spinach", completed: true, price: 3.99, store: "Kroger" },
    { id: 4, name: "Bell Peppers (3)", completed: false, price: 4.97, store: "Walmart" },
    { id: 5, name: "Rolled Oats", completed: false, price: 2.49, store: "Aldi" }
  ];

  return (
    <div className="min-h-screen bg-background mb-16 md:mb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="space-y-2 mb-4 md:mb-0">
              <h2 className="text-2xl font-bold" data-testid="greeting">Good morning, Sarah!</h2>
              <p className="text-white/90">Ready to plan some delicious and healthy meals for your family?</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="bg-white/20 rounded-lg px-3 py-1">
                  <span className="text-sm font-medium" data-testid="family-size">Family of 4</span>
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-1">
                  <span className="text-sm font-medium" data-testid="budget-display">Budget: $150/week</span>
                </div>
              </div>
            </div>
            <Button 
              className="bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={handleGenerateMealPlan}
              disabled={generateMealPlanMutation.isPending}
              data-testid="button-generate-meal-plan"
            >
              {generateMealPlanMutation.isPending ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate New Meal Plan
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Weekly Overview Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">This Week's Budget</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="budget-spent">${mockWeeklyStats.budgetSpent}</p>
                  <p className="text-secondary text-sm">of ${mockWeeklyStats.budgetTotal}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-primary text-xl" />
                </div>
              </div>
              <div className="mt-3">
                <Progress value={(mockWeeklyStats.budgetSpent / mockWeeklyStats.budgetTotal) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Meals Planned</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="meals-planned">{mockWeeklyStats.mealsPlanned}</p>
                  <p className="text-secondary text-sm">of {mockWeeklyStats.totalMeals} meals</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="text-secondary text-xl" />
                </div>
              </div>
              <div className="mt-3">
                <Progress value={(mockWeeklyStats.mealsPlanned / mockWeeklyStats.totalMeals) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Prep Time Saved</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="prep-time-saved">{mockWeeklyStats.prepTimeSaved}</p>
                  <p className="text-accent text-sm">batch cooking</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Clock className="text-accent text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Family Rating</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="family-rating">{mockWeeklyStats.familyRating}</p>
                  <div className="flex text-accent text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="text-red-500 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-2 border-dashed hover:border-primary hover:bg-primary/5"
                data-testid="button-add-recipe"
              >
                <Plus className="text-primary text-2xl mb-2" />
                <span className="text-sm font-medium">Add Recipe</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-2 border-dashed hover:border-secondary hover:bg-secondary/5"
                data-testid="button-shopping-list"
              >
                <List className="text-secondary text-2xl mb-2" />
                <span className="text-sm font-medium">Shopping List</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-2 border-dashed hover:border-accent hover:bg-accent/5"
                data-testid="button-nutrition-stats"
              >
                <PieChart className="text-accent text-2xl mb-2" />
                <span className="text-sm font-medium">Nutrition Stats</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-2 border-dashed hover:border-purple-500 hover:bg-purple-50"
                data-testid="button-kids-corner"
              >
                <Baby className="text-purple-500 text-2xl mb-2" />
                <span className="text-sm font-medium">Kids' Corner</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Meal Plan Grid */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">This Week's Meal Plan</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" data-testid="button-prev-week">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-3 py-1 bg-muted rounded-md" data-testid="week-range">
                  Dec 11-17, 2023
                </span>
                <Button variant="ghost" size="icon" data-testid="button-next-week">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <MealPlanGrid mealPlan={activeMealPlan} isLoading={mealPlanLoading} />
            
            {/* Meal Plan Feedback Section */}
            {activeMealPlan && !mealPlanLoading && typeof activeMealPlan === 'object' && 'id' in activeMealPlan && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Meal Plan Feedback
                    </h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowMealPlanFeedback(!showMealPlanFeedback)}
                      data-testid="button-rate-meal-plan"
                    >
                      {showMealPlanFeedback ? "Cancel" : "Rate Meal Plan"}
                    </Button>
                  </div>

                  {showMealPlanFeedback ? (
                    <MealPlanFeedback
                      mealPlan={activeMealPlan as any}
                      userId={currentUserId}
                      onClose={() => setShowMealPlanFeedback(false)}
                    />
                  ) : (
                    <FeedbackDisplay
                      itemId={(activeMealPlan as any).id}
                      itemType="meal-plan"
                    />
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Today's Nutrition & Shopping List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NutritionOverview nutritionData={mockNutritionData} />
          </div>

          {/* Shopping List Preview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Shopping List</h3>
                <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium p-0" data-testid="button-view-all-shopping">
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {mockShoppingItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors" data-testid={`shopping-item-${item.id}`}>
                    <div className="flex items-center space-x-3">
                      <Checkbox checked={item.completed} />
                      <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        ${item.price}
                      </div>
                      <div className="text-xs text-secondary">{item.store}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Estimated:</span>
                  <span className="font-bold text-lg" data-testid="shopping-total">$127.43</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Based on best local prices</div>
              </div>

              <Button className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground" data-testid="button-optimize-route">
                <Route className="mr-2 h-4 w-4" />
                Optimize Shopping Route
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Recipes Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recommended for Your Family</h3>
              <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium p-0" data-testid="button-view-all-recipes">
                View All Recipes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(recipes as any[]).slice(0, 3).map((recipe: any) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Family Cooking Tips & Kids Corner */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <Baby className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-semibold">Kids' Cooking Corner</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">This Week's Activity</h4>
                <p className="text-sm text-purple-700 mb-3">Teach kids to make their own smoothie bowl! Great for motor skills and healthy eating habits.</p>
                <div className="flex items-center space-x-2">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Ages 5-12</span>
                  <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">15 mins</span>
                </div>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Safety Tip</h4>
                <p className="text-sm text-purple-700">Always supervise knife work and teach proper hand positioning. Start with plastic knives for younger children.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <div className="text-white text-lg">💡</div>
              </div>
              <h3 className="text-lg font-semibold">Weekly Prep Tips</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Sunday Batch Prep</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Wash and chop vegetables for the week</li>
                  <li>• Cook grains in bulk (quinoa, rice, pasta)</li>
                  <li>• Prepare freezer-friendly portions</li>
                </ul>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Money-Saving Tip</h4>
                <p className="text-sm text-green-700">Buy proteins on sale and freeze in family-sized portions. Label with date and cooking instructions!</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
