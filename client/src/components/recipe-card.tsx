import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Clock, Users, DollarSign } from "lucide-react";
import { Recipe, ImageMetadata } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  currency?: 'GBP' | 'USD';
}

export function RecipeCard({ recipe, onClick, currency = 'GBP' }: RecipeCardProps) {
  const currencySymbol = currency === 'GBP' ? '£' : '$';
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  // Get image metadata if available, fallback to legacy imageUrl
  const imageMetadata = recipe.imageMetadata as ImageMetadata | null;
  const imageUrl = imageMetadata?.large || recipe.imageUrl || undefined;
  const imageAlt = imageMetadata?.alt || recipe.title;
  const aspectRatio = imageMetadata?.aspectRatio || 16/9;
  
  // Generate responsive srcSet from imageMetadata if available
  const getSrcSet = () => {
    if (!imageMetadata) return undefined;
    return [
      `${imageMetadata.thumbnail} 320w`,
      `${imageMetadata.medium} 768w`,
      `${imageMetadata.large} 1024w`,
      `${imageMetadata.original} 1536w`
    ].join(', ');
  };
  
  return (
    <Card 
      className="recipe-card cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" 
      onClick={onClick}
      data-testid={`recipe-card-${recipe.id}`}
    >
      {imageUrl && (
        <div className="w-full h-56 sm:h-60 md:h-64 bg-muted relative group">
          <OptimizedImage
            src={imageUrl}
            srcSet={getSrcSet()}
            alt={imageAlt}
            aspectRatio={aspectRatio}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            objectFit="cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fallbackSrc={recipe.imageUrl || undefined}
            skeleton={true}
            skeletonClassName="bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse"
            priority={false}
            placeholder={imageMetadata?.dominantColor ? "blur" : "empty"}
            blurDataURL={imageMetadata?.dominantColor ? `data:image/svg+xml;base64,${btoa(`<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${imageMetadata.dominantColor}"/></svg>`)}` : undefined}
            data-testid={`recipe-image-${recipe.id}`}
          />
          {/* Image overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-foreground text-lg leading-tight flex-1 mr-2" data-testid={`recipe-title-${recipe.id}`}>
            {recipe.title}
          </h4>
          <div className="flex-shrink-0">
            <StarRating 
              value={recipe.rating ? parseFloat(recipe.rating) : 0} 
              readonly 
              size="sm" 
              showValue 
              data-testid={`recipe-rating-${recipe.id}`}
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2" data-testid={`recipe-description-${recipe.id}`}>
          {recipe.description}
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-4">
          <div className="flex items-center justify-center bg-muted/50 rounded-lg py-2 px-1">
            <Clock className="mr-1 h-3 w-3 text-primary" />
            <span className="font-medium">{totalTime}m</span>
          </div>
          <div className="flex items-center justify-center bg-muted/50 rounded-lg py-2 px-1">
            <Users className="mr-1 h-3 w-3 text-primary" />
            <span className="font-medium">{recipe.servings}</span>
          </div>
          <div className="flex items-center justify-center bg-muted/50 rounded-lg py-2 px-1">
            <DollarSign className="mr-1 h-3 w-3 text-primary" />
            <span className="font-medium">{currencySymbol}{recipe.estimatedCost || '0.00'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4 flex-wrap gap-1">
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

        <div className="grid grid-cols-3 gap-3 text-xs pt-3 border-t border-border/50">
          <div className="text-center">
            <div className="font-bold text-primary text-sm" data-testid={`recipe-calories-${recipe.id}`}>
              {(recipe.nutrition as any)?.calories || 0}
            </div>
            <div className="text-muted-foreground font-medium">Calories</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-primary text-sm" data-testid={`recipe-protein-${recipe.id}`}>
              {(recipe.nutrition as any)?.protein || 0}g
            </div>
            <div className="text-muted-foreground font-medium">Protein</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-primary text-sm" data-testid={`recipe-fiber-${recipe.id}`}>
              {(recipe.nutrition as any)?.fiber || 0}g
            </div>
            <div className="text-muted-foreground font-medium">Fiber</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
