import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Sparkles, ShoppingCart, Plus, LogOut, Settings,
  DollarSign, Clock, Heart, ChefHat
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Fetch household
  const { data: household, isLoading: householdLoading } = useQuery({
    queryKey: ["/api/households/me"],
  });

  // Fetch household members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["/api/households", household?.id, "members"],
    enabled: !!household?.id,
  });

  // Fetch household preferences
  const { data: preferences } = useQuery({
    queryKey: ["/api/households", household?.id, "preferences"],
    enabled: !!household?.id,
  });

  // Set default selected member (first member)
  const currentMember = selectedMemberId 
    ? members.find((m: any) => m.id === selectedMemberId)
    : members[0];

  // Fetch active meal plan for selected member
  const { data: activeMealPlan, isLoading: mealPlanLoading } = useQuery({
    queryKey: ["/api/members", currentMember?.id, "meal-plans", "active"],
    enabled: !!currentMember?.id,
  });

  // Fetch shopping list for household
  const { data: shoppingList } = useQuery({
    queryKey: ["/api/households", household?.id, "shopping-lists", "active"],
    enabled: !!household?.id,
  });

  // Fetch recipes
  const { data: recipes = [] } = useQuery({
    queryKey: ["/api/recipes"],
  });

  // Generate meal plan mutation
  const generateMealPlanMutation = useMutation({
    mutationFn: async (memberId: string) => {
      return await apiRequest(`/api/members/${memberId}/meal-plans/generate`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "Meal Plan Generated!",
        description: "Your personalized weekly meal plan is ready.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate shopping list mutation
  const generateShoppingListMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/households/${household?.id}/shopping-lists/generate`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/households", household?.id, "shopping-lists"] });
      toast({
        title: "Shopping List Created!",
        description: "Your merged shopping list is ready with ingredients from all members.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate shopping list. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateMealPlan = () => {
    if (currentMember?.id) {
      generateMealPlanMutation.mutate(currentMember.id);
    }
  };

  const handleGenerateShoppingList = () => {
    generateShoppingListMutation.mutate();
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // Redirect to onboarding if no household
  if (!householdLoading && !household) {
    setLocation("/onboarding");
    return null;
  }

  if (householdLoading || membersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-8 h-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  NutriPlanPal
                </h1>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {household?.name || "Your Household"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {household?.currency} {household?.weeklyBudget}/week
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")} data-testid="button-settings">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section with Profile Switcher */}
        <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2" data-testid="greeting">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-white/90 mb-4">
                  Ready to plan healthy meals for your family?
                </p>
                
                {/* Profile Switcher */}
                {members.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Viewing plan for:</span>
                    <Select 
                      value={currentMember?.id || members[0]?.id} 
                      onValueChange={setSelectedMemberId}
                    >
                      <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white" data-testid="select-member">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member: any) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} {member.nickname && `(${member.nickname})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={() => setLocation("/onboarding")}
                      data-testid="button-add-member"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Member
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  className="bg-white text-orange-600 hover:bg-white/90 font-semibold"
                  onClick={handleGenerateMealPlan}
                  disabled={generateMealPlanMutation.isPending || !currentMember}
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
                      Generate Meal Plan
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={handleGenerateShoppingList}
                  disabled={generateShoppingListMutation.isPending}
                  data-testid="button-generate-shopping"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Create Shopping List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Profile Card */}
        {currentMember && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                {currentMember.name}'s Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Primary Goal</p>
                  <p className="font-medium capitalize">
                    {currentMember.primaryGoal?.replace(/_/g, " ") || "Not set"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Activity Level</p>
                  <p className="font-medium capitalize">
                    {currentMember.activityLevel?.replace(/_/g, " ") || "Not set"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dietary Preferences</p>
                  <div className="flex flex-wrap gap-1">
                    {currentMember.dietaryRestrictions && currentMember.dietaryRestrictions.length > 0 ? (
                      currentMember.dietaryRestrictions.map((diet: string) => (
                        <Badge key={diet} variant="secondary" className="text-xs capitalize">
                          {diet.replace(/_/g, " ")}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </div>
                </div>
              </div>
              {currentMember.allergies && currentMember.allergies.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">⚠️ Allergies</p>
                  <div className="flex flex-wrap gap-1">
                    {currentMember.allergies.map((allergy: string) => (
                      <Badge key={allergy} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Weekly Meal Plan */}
        <Card>
          <CardHeader>
            <CardTitle>This Week's Meal Plan</CardTitle>
            <CardDescription>
              {currentMember ? `Personalized for ${currentMember.name}` : "Select a member to view their meal plan"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mealPlanLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading meal plan...</p>
              </div>
            ) : activeMealPlan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">Active Meal Plan</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Week of {new Date(activeMealPlan.weekStartDate).toLocaleDateString()}
                    </p>
                  </div>
                  {activeMealPlan.totalCalories && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {activeMealPlan.totalCalories.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">calories/week</p>
                    </div>
                  )}
                </div>

                {/* Display meals */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries((activeMealPlan.meals as any) || {}).map(([day, meals]: [string, any]) => (
                    <Card key={day} className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base capitalize">{day}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {Object.entries(meals || {}).map(([mealType, meal]: [string, any]) => (
                          <div key={mealType} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                              {mealType}
                            </p>
                            <p className="text-sm font-medium">{meal?.title || "Not planned"}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Meal Plan Yet</h3>
                <p className="text-gray-500 mb-4">
                  Generate a personalized meal plan to get started
                </p>
                <Button onClick={handleGenerateMealPlan} disabled={!currentMember} data-testid="button-create-first-plan">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create My First Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shopping List */}
        <Card>
          <CardHeader>
            <CardTitle>Household Shopping List</CardTitle>
            <CardDescription>
              Combined ingredients from all family members' meal plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shoppingList ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Week of {new Date(shoppingList.weekStartDate).toLocaleDateString()}</p>
                    {shoppingList.totalEstimatedCost && (
                      <p className="text-sm text-gray-500">
                        Estimated: {household?.currency} {shoppingList.totalEstimatedCost}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">{(shoppingList.items as any[])?.length || 0} items</Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {((shoppingList.items as any[]) || []).map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.amount} {item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Shopping List</h3>
                <p className="text-gray-500 mb-4">
                  Generate a shopping list from your household's meal plans
                </p>
                <Button onClick={handleGenerateShoppingList} data-testid="button-create-shopping-list">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Create Shopping List
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Recipes */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Recipes</CardTitle>
            <CardDescription>Based on your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.slice(0, 3).map((recipe: any) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {recipe.imageUrl && (
                    <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{recipe.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{recipe.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime + recipe.cookTime} min
                      </span>
                      <span>{recipe.servings} servings</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
