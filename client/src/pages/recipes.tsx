import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Search, Filter, Plus, Sparkles, Clock, Users, Utensils, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  // Fetch recipes
  const { data: recipes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/recipes', searchQuery, selectedTags.join(',')],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      
      const response = await fetch(`/api/recipes?${params}`);
      if (!response.ok) throw new Error('Failed to fetch recipes');
      return response.json();
    }
  });

  // Generate recipe mutation
  const generateRecipeMutation = useMutation({
    mutationFn: async (params: any) => {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error('Failed to generate recipe');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      setIsGenerateDialogOpen(false);
      toast({
        title: "Recipe Generated!",
        description: "Your personalized recipe has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleGenerateRecipe = (mealType: string) => {
    generateRecipeMutation.mutate({
      familySize: 4,
      dietaryRestrictions: [],
      allergies: [],
      cookingSkillLevel: "intermediate",
      weeklyBudget: 150,
      preferredCuisines: ["american", "italian"],
      dislikedIngredients: [],
      mealType,
      prepTimeLimit: 45,
      equipment: ["stove", "oven", "microwave"],
      goals: ["healthy_eating"],
      childrenAges: [8, 12]
    });
  };

  // Add to meal plan mutation
  const addToMealPlanMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      const response = await fetch(`/api/users/user-1/meal-plans/active/add-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId })
      });
      if (!response.ok) throw new Error('Failed to add recipe to meal plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', 'user-1', 'meal-plans', 'active'] });
      toast({
        title: "Added to Meal Plan!",
        description: "Recipe has been added to your meal plan.",
      });
      setSelectedRecipe(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add recipe to meal plan. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Add to shopping list mutation
  const addToShoppingListMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      const response = await fetch(`/api/users/user-1/shopping-lists/active/add-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId })
      });
      if (!response.ok) throw new Error('Failed to add recipe to shopping list');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', 'user-1', 'shopping-lists', 'active'] });
      toast({
        title: "Added to Shopping List!",
        description: "Recipe ingredients have been added to your shopping list.",
      });
      setSelectedRecipe(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add recipe to shopping list. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredRecipes = recipes.filter((recipe: any) => {
    if (difficultyFilter && difficultyFilter !== "all" && recipe.difficulty !== difficultyFilter) return false;
    if (timeFilter && timeFilter !== "all") {
      const totalTime = recipe.prepTime + recipe.cookTime;
      switch (timeFilter) {
        case "quick": return totalTime <= 30;
        case "medium": return totalTime > 30 && totalTime <= 60;
        case "long": return totalTime > 60;
      }
    }
    return true;
  });

  const allTags: string[] = Array.from(new Set(
    recipes.flatMap((recipe: any) => recipe.dietaryTags || [])
  )) as string[];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background mb-16 md:mb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="recipes-title">
              Recipe Collection
            </h1>
            <p className="text-muted-foreground">
              Discover and create personalized recipes for your family
            </p>
          </div>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0" data-testid="button-generate-recipe">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate AI Recipe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Choose the type of meal you'd like to generate:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateRecipe("breakfast")}
                    disabled={generateRecipeMutation.isPending}
                    data-testid="button-generate-breakfast"
                  >
                    Breakfast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateRecipe("lunch")}
                    disabled={generateRecipeMutation.isPending}
                    data-testid="button-generate-lunch"
                  >
                    Lunch
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateRecipe("dinner")}
                    disabled={generateRecipeMutation.isPending}
                    data-testid="button-generate-dinner"
                  >
                    Dinner
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateRecipe("snack")}
                    disabled={generateRecipeMutation.isPending}
                    data-testid="button-generate-snack"
                  >
                    Snack
                  </Button>
                </div>
                {generateRecipeMutation.isPending && (
                  <p className="text-sm text-muted-foreground text-center">
                    Generating your personalized recipe...
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes by name or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-recipes"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger data-testid="select-difficulty">
                    <SelectValue placeholder="Any difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any difficulty</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Cooking Time</Label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger data-testid="select-time">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any time</SelectItem>
                    <SelectItem value="quick">Quick (≤30 min)</SelectItem>
                    <SelectItem value="medium">Medium (30-60 min)</SelectItem>
                    <SelectItem value="long">Long ({'>'}60 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                    setDifficultyFilter("all");
                    setTimeFilter("all");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Dietary Tags */}
            {allTags.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Dietary Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                      data-testid={`tag-${tag}`}
                    >
                      {tag.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(selectedTags.length > 0 || (difficultyFilter && difficultyFilter !== "all") || (timeFilter && timeFilter !== "all")) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Active filters:</span>
                  {difficultyFilter && difficultyFilter !== "all" && (
                    <Badge variant="secondary">{difficultyFilter}</Badge>
                  )}
                  {timeFilter && timeFilter !== "all" && (
                    <Badge variant="secondary">{timeFilter}</Badge>
                  )}
                  {selectedTags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recipe Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1" data-testid="stat-total-recipes">
                {filteredRecipes.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Recipes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1" data-testid="stat-quick-recipes">
                {filteredRecipes.filter((r: any) => (r.prepTime + r.cookTime) <= 30).length}
              </div>
              <div className="text-sm text-muted-foreground">Quick Recipes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1" data-testid="stat-kid-friendly">
                {filteredRecipes.filter((r: any) => r.isKidFriendly).length}
              </div>
              <div className="text-sm text-muted-foreground">Kid-Friendly</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1" data-testid="stat-batch-cookable">
                {filteredRecipes.filter((r: any) => r.isBatchCookable).length}
              </div>
              <div className="text-sm text-muted-foreground">Batch Cookable</div>
            </CardContent>
          </Card>
        </div>

        {/* Recipe Grid */}
        {isError ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-destructive text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Failed to load recipes</h3>
              <p className="text-muted-foreground mb-4">
                Something went wrong while fetching recipes. Please try again.
              </p>
              <Button onClick={() => refetch()} data-testid="button-retry-recipes">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe: any) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedTags.length > 0 || difficultyFilter || timeFilter
                  ? "Try adjusting your search or filters to find more recipes."
                  : "Get started by generating your first AI-powered recipe!"}
              </p>
              <Button onClick={() => setIsGenerateDialogOpen(true)} data-testid="button-get-started">
                <Plus className="mr-2 h-4 w-4" />
                Generate Recipe
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  {selectedRecipe.title}
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm ml-1">{selectedRecipe.rating}</span>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedRecipe.imageUrl && (
                  <img
                    src={selectedRecipe.imageUrl}
                    alt={selectedRecipe.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <p className="text-muted-foreground">{selectedRecipe.description}</p>

                {/* Recipe Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-medium">
                      {selectedRecipe.prepTime + selectedRecipe.cookTime} min
                    </div>
                    <div className="text-xs text-muted-foreground">Total Time</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-secondary" />
                    <div className="text-sm font-medium">Serves {selectedRecipe.servings}</div>
                    <div className="text-xs text-muted-foreground">Servings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">${selectedRecipe.estimatedCost}</div>
                    <div className="text-xs text-muted-foreground">Estimated Cost</div>
                  </div>
                </div>

                <Separator />

                {/* Ingredients */}
                <div>
                  <h4 className="font-semibold mb-3">Ingredients</h4>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients?.map((ingredient: any, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Instructions */}
                <div>
                  <h4 className="font-semibold mb-3">Instructions</h4>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions?.map((step: string, index: number) => (
                      <li key={index} className="flex space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Nutrition */}
                {selectedRecipe.nutrition && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Nutrition (per serving)</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{selectedRecipe.nutrition.calories}</div>
                          <div className="text-xs text-muted-foreground">Calories</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{selectedRecipe.nutrition.protein}g</div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{selectedRecipe.nutrition.fiber}g</div>
                          <div className="text-xs text-muted-foreground">Fiber</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Tags */}
                {selectedRecipe.dietaryTags?.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipe.dietaryTags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <Separator />
                <div className="flex gap-3">
                  <Button 
                    onClick={() => addToMealPlanMutation.mutate(selectedRecipe.id)}
                    disabled={addToMealPlanMutation.isPending}
                    className="flex-1"
                    data-testid="button-add-to-meal-plan"
                  >
                    {addToMealPlanMutation.isPending ? (
                      "Adding..."
                    ) : (
                      "Add to Meal Plan"
                    )}
                  </Button>
                  <Button 
                    onClick={() => addToShoppingListMutation.mutate(selectedRecipe.id)}
                    disabled={addToShoppingListMutation.isPending}
                    variant="outline"
                    className="flex-1"
                    data-testid="button-add-to-shopping-list"
                  >
                    {addToShoppingListMutation.isPending ? (
                      "Adding..."
                    ) : (
                      "Add to Shopping List"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
