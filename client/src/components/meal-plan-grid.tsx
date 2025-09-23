import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { RecipePickerModal } from "@/components/recipe-picker-modal";
import type { Recipe } from "@shared/schema";

interface MealPlanGridProps {
  mealPlan?: any;
  isLoading: boolean;
  onMealAdd?: (day: string, mealType: string, recipe: Recipe) => void;
}

export function MealPlanGrid({ mealPlan, isLoading, onMealAdd }: MealPlanGridProps) {
  const [recipePickerOpen, setRecipePickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; mealType: string } | null>(null);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 min-w-full">
          {days.map((day) => (
            <div key={day} className="space-y-2 sm:space-y-3">
              <h4 className="font-semibold text-center text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                {day}
              </h4>
              {mealTypes.map((mealType) => (
                <div key={mealType} className="p-2">
                  <Skeleton className="h-32 sm:h-36 w-full rounded-lg" data-testid={`meal-skeleton-${day.toLowerCase()}-${mealType}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getMealData = (dayKey: string, mealType: string) => {
    if (!mealPlan?.meals) return null;
    const dayMeals = mealPlan.meals[dayKey.toLowerCase()];
    return dayMeals?.[mealType] || null;
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 sm:gap-4 min-w-full">
        {days.map((day) => (
          <div key={day} className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-center text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
              {day}
            </h4>
            
            {mealTypes.map((mealType) => {
              const meal = getMealData(day, mealType);
              
              return (
                <div 
                  key={mealType}
                  className="meal-slot p-2 rounded-lg cursor-pointer"
                  data-testid={`meal-slot-${day.toLowerCase()}-${mealType}`}
                >
                  
                  {meal ? (
                    <Card className="recipe-card bg-gradient-to-br from-primary/20 to-primary/10 border-none overflow-hidden">
                      <CardContent className="p-0">
                        {/* Recipe Image */}
                        <div className="relative h-16 sm:h-20 w-full mb-2">
                          <OptimizedImage
                            src={meal.imageMetadata?.thumbnail || meal.imageMetadata?.medium || meal.imageUrl || '/api/placeholder/200/120'}
                            alt={meal.imageMetadata?.alt || `${meal.title} recipe image`}
                            aspectRatio={16/9}
                            className="rounded-t-lg"
                            loading="lazy"
                            fallbackSrc="/api/placeholder/200/120"
                            skeleton={true}
                            skeletonClassName="bg-muted/50"
                            objectFit="cover"
                            data-testid={`meal-image-${day.toLowerCase()}-${mealType}`}
                          />
                          
                          {/* Overlay gradient for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-lg" />
                          
                          {/* Meal type indicator */}
                          <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5">
                            <span className="text-xs text-white capitalize font-medium">{mealType}</span>
                          </div>
                        </div>
                        
                        {/* Recipe Info */}
                        <div className="px-2 pb-2">
                          <div className="text-xs font-medium text-foreground mb-1 overflow-hidden" data-testid={`meal-title-${meal.title}`}>
                            <div className="line-clamp-2" title={meal.title}>
                              {meal.title}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {meal.nutrition?.calories || 0} cal • {(meal.prepTime || 0) + (meal.cookTime || 0)} min
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {meal.isBatchCookable && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                ✓ Batch
                              </Badge>
                            )}
                            {meal.isKidFriendly && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                Kid-friendly
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-32 sm:h-36 border-2 border-dashed border-muted-foreground/30 bg-muted/10 hover:bg-muted/20 transition-colors">
                      <CardContent className="p-0 h-full">
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          {/* Meal type indicator for empty slots */}
                          <div className="text-xs mb-2 capitalize font-medium opacity-70">
                            {mealType}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10"
                            onClick={() => {
                              setSelectedSlot({ day: day.toLowerCase(), mealType });
                              setRecipePickerOpen(true);
                            }}
                            data-testid={`button-add-meal-${day.toLowerCase()}-${mealType}`}
                          >
                            <Plus className="h-5 w-5 opacity-60" />
                          </Button>
                          
                          <div className="text-xs mt-1 opacity-60 text-center">
                            Add meal
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Recipe Picker Modal */}
      {selectedSlot && (
        <RecipePickerModal
          open={recipePickerOpen}
          onOpenChange={setRecipePickerOpen}
          onRecipeSelect={(recipe) => {
            if (onMealAdd && selectedSlot) {
              onMealAdd(selectedSlot.day, selectedSlot.mealType, recipe);
            }
            setSelectedSlot(null);
          }}
          mealType={selectedSlot.mealType}
          day={selectedSlot.day.charAt(0).toUpperCase() + selectedSlot.day.slice(1)}
        />
      )}
    </div>
  );
}
