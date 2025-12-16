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
import { StarRating } from "@/components/ui/star-rating";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { FeedbackDisplay } from "@/components/feedback/feedback-display";
import { RecipeFeedbackForm } from "@/components/feedback/recipe-feedback";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Search, Filter, Plus, Sparkles, Clock, Users, Utensils, MessageSquare, Star as StarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { ImageMetadata } from "@shared/schema";

export default function Recipes() {
  // Mock user data - in production this would come from authentication
  const currentUserId = "user-1";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

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
                Generate Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate New Recipe</DialogTitle>
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
                  : "Get started by generating your first personalised recipe!"}
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
              {/* Hero Image Section */}
              {(() => {
                const imageMetadata = selectedRecipe.imageMetadata as ImageMetadata | null;
                const imageUrl = imageMetadata?.large || selectedRecipe.imageUrl;
                const imageAlt = imageMetadata?.alt || selectedRecipe.title;
                const aspectRatio = imageMetadata?.aspectRatio || 16/9;
                
                const getSrcSet = () => {
                  if (!imageMetadata) return undefined;
                  return [
                    `${imageMetadata.thumbnail} 480w`,
                    `${imageMetadata.medium} 768w`,
                    `${imageMetadata.large} 1024w`,
                    `${imageMetadata.original} 1536w`
                  ].join(', ');
                };

                return imageUrl ? (
                  <div className="relative w-full h-64 md:h-80 lg:h-96 bg-muted overflow-hidden">
                    <OptimizedImage
                      src={imageUrl}
                      srcSet={getSrcSet()}
                      alt={imageAlt}
                      aspectRatio={aspectRatio}
                      className="w-full h-full"
                      objectFit="cover"
                      objectPosition="center"
                      loading="eager"
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
                      fallbackSrc={selectedRecipe.imageUrl || undefined}
                      skeleton={true}
                      skeletonClassName="bg-gradient-to-br from-muted via-muted/80 to-muted"
                      placeholder={imageMetadata?.dominantColor ? "blur" : "empty"}
                      blurDataURL={imageMetadata?.dominantColor ? `data:image/svg+xml;base64,${btoa(`<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${imageMetadata.dominantColor}"/></svg>`)}` : undefined}
                      data-testid={`recipe-detail-image-${selectedRecipe.id}`}
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Recipe title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-end justify-between">
                        <div className="flex-1">
                          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
                            {selectedRecipe.title}
                          </h1>
                          <div className="flex items-center gap-4 text-sm md:text-base">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{selectedRecipe.prepTime + selectedRecipe.cookTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>Serves {selectedRecipe.servings}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <StarRating 
                            value={parseFloat(selectedRecipe.rating)} 
                            readonly 
                            size="lg" 
                            showValue
                            className="text-white drop-shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-48 md:h-64 bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <Utensils className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
                      <div className="flex items-end justify-between">
                        <div className="flex-1">
                          <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            {selectedRecipe.title}
                          </h1>
                          <div className="flex items-center gap-4 text-sm md:text-base text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{selectedRecipe.prepTime + selectedRecipe.cookTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>Serves {selectedRecipe.servings}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <StarRating 
                            value={parseFloat(selectedRecipe.rating)} 
                            readonly 
                            size="lg" 
                            showValue
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              {/* Content Section */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Description */}
                <div className="max-w-3xl">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {selectedRecipe.description}
                  </p>
                </div>

                {/* Recipe Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium text-foreground">
                        Prep: {selectedRecipe.prepTime}m
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        Cook: {selectedRecipe.cookTime}m
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Total: {selectedRecipe.prepTime + selectedRecipe.cookTime} min
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-secondary/5 border-secondary/20">
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-secondary" />
                      <div className="text-lg font-semibold text-foreground">
                        {selectedRecipe.servings}
                      </div>
                      <div className="text-xs text-muted-foreground">Servings</div>
                      <div className="text-xs text-muted-foreground capitalize mt-1">
                        {selectedRecipe.difficulty} level
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-semibold text-green-700 dark:text-green-400">
                        ${selectedRecipe.estimatedCost || '0.00'}
                      </div>
                      <div className="text-xs text-muted-foreground">Estimated Cost</div>
                      
                      {/* Recipe Badges */}
                      <div className="flex justify-center gap-1 mt-2 flex-wrap">
                        {selectedRecipe.isBatchCookable && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            Batch Cook
                          </Badge>
                        )}
                        {selectedRecipe.isKidFriendly && (
                          <Badge variant="secondary" className="text-xs bg-secondary/10 text-secondary">
                            Kid-Friendly
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Ingredients */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      Ingredients
                    </h3>
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <ul className="space-y-3">
                          {selectedRecipe.ingredients?.map((ingredient: any, index: number) => (
                            <li key={index} className="flex items-start space-x-3 group">
                              <Checkbox className="mt-1" data-testid={`ingredient-checkbox-${index}`} />
                              <span className="text-sm leading-relaxed group-hover:text-foreground transition-colors">
                                <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>{' '}
                                <span className="text-muted-foreground">{ingredient.name}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-secondary rounded-full"></div>
                      Instructions
                    </h3>
                    <div className="space-y-4">
                      {selectedRecipe.instructions?.map((step: string, index: number) => (
                        <Card key={index} className="bg-background border-l-4 border-l-secondary">
                          <CardContent className="p-4">
                            <div className="flex space-x-4">
                              <span className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full text-sm font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                              <p className="text-sm leading-relaxed pt-1">
                                {step}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Nutrition & Tags Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Nutrition */}
                  {selectedRecipe.nutrition && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        Nutrition (per serving)
                      </h3>
                      <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-background rounded-lg">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {selectedRecipe.nutrition.calories}
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">Calories</div>
                            </div>
                            <div className="p-3 bg-background rounded-lg">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {selectedRecipe.nutrition.protein}g
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">Protein</div>
                            </div>
                            <div className="p-3 bg-background rounded-lg">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {selectedRecipe.nutrition.fiber}g
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">Fiber</div>
                            </div>
                          </div>
                          
                          {/* Additional nutrition info */}
                          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                            <div className="text-center">
                              <div className="font-semibold text-sm">{selectedRecipe.nutrition.carbs}g</div>
                              <div className="text-xs text-muted-foreground">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-sm">{selectedRecipe.nutrition.fat}g</div>
                              <div className="text-xs text-muted-foreground">Fat</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-sm">{selectedRecipe.nutrition.sugar}g</div>
                              <div className="text-xs text-muted-foreground">Sugar</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-sm">{selectedRecipe.nutrition.sodium}mg</div>
                              <div className="text-xs text-muted-foreground">Sodium</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Tags & Features */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                      Recipe Features
                    </h3>
                    
                    {/* Dietary Tags */}
                    {selectedRecipe.dietaryTags?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Dietary Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecipe.dietaryTags.map((tag: string) => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="capitalize bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                            >
                              {tag.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Recipe Features */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Special Features</h4>
                      <div className="space-y-2">
                        {selectedRecipe.isBatchCookable && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>Perfect for batch cooking and meal prep</span>
                          </div>
                        )}
                        {selectedRecipe.isFreezerFriendly && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Freezer friendly for long-term storage</span>
                          </div>
                        )}
                        {selectedRecipe.isKidFriendly && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Kid-friendly and family approved</span>
                          </div>
                        )}
                        {selectedRecipe.cuisineType && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="capitalize">{selectedRecipe.cuisineType} cuisine</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => addToMealPlanMutation.mutate(selectedRecipe.id)}
                    disabled={addToMealPlanMutation.isPending}
                    className="h-12 text-base font-medium"
                    data-testid="button-add-to-meal-plan"
                  >
                    {addToMealPlanMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding to Meal Plan...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add to Meal Plan
                      </div>
                    )}
                  </Button>
                  <Button 
                    onClick={() => addToShoppingListMutation.mutate(selectedRecipe.id)}
                    disabled={addToShoppingListMutation.isPending}
                    variant="outline"
                    className="h-12 text-base font-medium"
                    data-testid="button-add-to-shopping-list"
                  >
                    {addToShoppingListMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        Adding to List...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add to Shopping List
                      </div>
                    )}
                  </Button>
                </div>

                {/* Feedback Section */}
                <Separator />
                <Card className="bg-muted/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Recipe Feedback
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                        data-testid="button-rate-recipe"
                      >
                        {showFeedbackForm ? "Cancel" : "Rate Recipe"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {showFeedbackForm ? (
                      <RecipeFeedbackForm
                        recipe={selectedRecipe}
                        userId={currentUserId}
                        onClose={() => setShowFeedbackForm(false)}
                      />
                    ) : (
                      <FeedbackDisplay
                        itemId={selectedRecipe.id}
                        itemType="recipe"
                        currentRating={selectedRecipe.rating}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
