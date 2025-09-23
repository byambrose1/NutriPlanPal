import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Clock, Users, DollarSign } from "lucide-react";
import { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <Card 
      className="recipe-card cursor-pointer overflow-hidden" 
      onClick={onClick}
      data-testid={`recipe-card-${recipe.id}`}
    >
      {recipe.imageUrl && (
        <div className="w-full h-48 bg-muted">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-foreground" data-testid={`recipe-title-${recipe.id}`}>
            {recipe.title}
          </h4>
          <StarRating 
            value={recipe.rating ? parseFloat(recipe.rating) : 0} 
            readonly 
            size="sm" 
            showValue 
            data-testid={`recipe-rating-${recipe.id}`}
          />
        </div>
        
        <p className="text-sm text-muted-foreground mb-3" data-testid={`recipe-description-${recipe.id}`}>
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {totalTime} mins
          </span>
          <span className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            Serves {recipe.servings}
          </span>
          <span className="flex items-center">
            <DollarSign className="mr-1 h-3 w-3" />
            ${recipe.estimatedCost || '0.00'}
          </span>
        </div>

        <div className="flex items-center space-x-2 mb-3 flex-wrap gap-1">
          {recipe.isBatchCookable && (
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              Batch Cook
            </Badge>
          )}
          {recipe.isKidFriendly && (
            <Badge variant="secondary" className="bg-secondary/10 text-secondary text-xs">
              Kid-Friendly
            </Badge>
          )}
          {recipe.dietaryTags?.includes('vegetarian') && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              Vegetarian
            </Badge>
          )}
          {recipe.dietaryTags?.includes('vegan') && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
              Vegan
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold" data-testid={`recipe-calories-${recipe.id}`}>
              {(recipe.nutrition as any)?.calories || 0}
            </div>
            <div className="text-muted-foreground">Calories</div>
          </div>
          <div className="text-center">
            <div className="font-semibold" data-testid={`recipe-protein-${recipe.id}`}>
              {(recipe.nutrition as any)?.protein || 0}g
            </div>
            <div className="text-muted-foreground">Protein</div>
          </div>
          <div className="text-center">
            <div className="font-semibold" data-testid={`recipe-fiber-${recipe.id}`}>
              {(recipe.nutrition as any)?.fiber || 0}g
            </div>
            <div className="text-muted-foreground">Fiber</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
