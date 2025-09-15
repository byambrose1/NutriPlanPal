import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface MealPlanGridProps {
  mealPlan?: any;
  isLoading: boolean;
}

export function MealPlanGrid({ mealPlan, isLoading }: MealPlanGridProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-4 min-w-full">
          {days.map((day) => (
            <div key={day} className="space-y-3">
              <h4 className="font-semibold text-center text-sm text-muted-foreground uppercase tracking-wide">
                {day}
              </h4>
              {mealTypes.map((mealType) => (
                <Skeleton key={mealType} className="h-24 w-full" />
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
      <div className="grid grid-cols-7 gap-4 min-w-full">
        {days.map((day) => (
          <div key={day} className="space-y-3">
            <h4 className="font-semibold text-center text-sm text-muted-foreground uppercase tracking-wide">
              {day}
            </h4>
            
            {mealTypes.map((mealType) => {
              const meal = getMealData(day, mealType);
              
              return (
                <div 
                  key={mealType}
                  className="meal-slot p-3 rounded-lg min-h-24 cursor-pointer"
                  data-testid={`meal-slot-${day.toLowerCase()}-${mealType}`}
                >
                  <div className="text-xs text-muted-foreground mb-1 capitalize">
                    {mealType}
                  </div>
                  
                  {meal ? (
                    <Card className="recipe-card bg-gradient-to-br from-primary/20 to-primary/10 border-none">
                      <CardContent className="p-2">
                        <div className="text-xs font-medium text-foreground mb-1" data-testid={`meal-title-${meal.title}`}>
                          {meal.title}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {meal.nutrition?.calories || 0} cal • {meal.prepTime + meal.cookTime || 0} min
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {meal.isBatchCookable && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              ✓ Batch cook
                            </Badge>
                          )}
                          {meal.isKidFriendly && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              Kid-friendly
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center justify-center h-16 text-muted-foreground">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`button-add-meal-${day.toLowerCase()}-${mealType}`}
                      >
                        <Plus className="h-6 w-6 opacity-50" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
