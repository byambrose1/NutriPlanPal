import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Users, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recipe, ImageMetadata } from "@shared/schema";

interface RecipePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeSelect: (recipe: Recipe) => void;
  mealType: string;
  day: string;
}

export function RecipePickerModal({
  open,
  onOpenChange,
  onRecipeSelect,
  mealType,
  day
}: RecipePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all recipes
  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
    enabled: open
  });

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.cuisineType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.dietaryTags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRecipeSelect = (recipe: Recipe) => {
    onRecipeSelect(recipe);
    onOpenChange(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0" data-testid="add-meal-modal">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>
            Choose a Recipe for {day} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search recipes by name, cuisine, or dietary tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              data-testid="input-recipe-search"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Recipe list */}
        <ScrollArea className="flex-1 px-6" data-testid="recipe-list">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="h-32 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">
                {searchQuery ? 'No recipes found' : 'No recipes available'}
              </p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {filteredRecipes.map((recipe) => {
                const totalTime = recipe.prepTime + recipe.cookTime;
                const imageMetadata = recipe.imageMetadata as ImageMetadata | null;
                const imageUrl = imageMetadata?.medium || recipe.imageUrl || '/api/placeholder/200/150';
                const imageAlt = imageMetadata?.alt || `${recipe.title} recipe image`;

                return (
                  <Card
                    key={recipe.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleRecipeSelect(recipe)}
                    data-testid={`recipe-card-${recipe.id}`}
                  >
                    <CardContent className="p-0">
                      {/* Recipe Image */}
                      <div className="relative h-32 w-full">
                        <OptimizedImage
                          src={imageUrl}
                          alt={imageAlt}
                          aspectRatio={16/9}
                          className="rounded-t-lg"
                          loading="lazy"
                          fallbackSrc="/api/placeholder/200/150"
                          skeleton={true}
                          skeletonClassName="bg-muted/50"
                          objectFit="cover"
                          data-testid={`recipe-image-${recipe.id}`}
                        />
                        
                        {/* Difficulty badge */}
                        <div className="absolute top-2 right-2">
                          <Badge 
                            variant={
                              recipe.difficulty === 'easy' ? 'secondary' :
                              recipe.difficulty === 'medium' ? 'default' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {recipe.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Recipe Info */}
                      <div className="p-4">
                        <h3 
                          className="font-semibold text-sm mb-2 line-clamp-2" 
                          title={recipe.title}
                          data-testid={`recipe-title-${recipe.id}`}
                        >
                          {recipe.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{totalTime} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{recipe.servings} servings</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {(recipe.nutrition as any)?.calories || 0} cal
                          </div>
                          {recipe.estimatedCost && (
                            <div className="text-xs font-medium text-green-600">
                              ${Number(recipe.estimatedCost).toFixed(2)}
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex gap-1 flex-wrap mt-2">
                          {recipe.isKidFriendly && (
                            <Badge variant="outline" className="text-xs">
                              Kid-friendly
                            </Badge>
                          )}
                          {recipe.isBatchCookable && (
                            <Badge variant="outline" className="text-xs">
                              Batch cook
                            </Badge>
                          )}
                          {recipe.dietaryTags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Click on a recipe to add it to your meal plan
            </p>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-recipe-selection"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}