import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = "md",
  className,
  showValue = false
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };

  const displayRating = hoveredRating || value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div 
        className="flex"
        role={readonly ? "img" : "radiogroup"}
        aria-label={`Rating: ${value} out of 5 stars`}
        data-testid="star-rating"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayRating;
          return (
            <button
              key={star}
              type="button"
              className={cn(
                sizeClasses[size],
                "transition-colors duration-150",
                readonly 
                  ? "cursor-default" 
                  : "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded"
              )}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              role={readonly ? undefined : "radio"}
              aria-checked={readonly ? undefined : star === value}
              aria-label={`${star} star${star === 1 ? '' : 's'}`}
              data-testid={`star-${star}`}
            >
              <Star
                className={cn(
                  "transition-all duration-150",
                  filled
                    ? "fill-yellow-400 text-yellow-400" 
                    : "fill-transparent text-gray-300 dark:text-gray-600",
                  !readonly && "hover:text-yellow-300"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span 
          className={cn(
            "ml-2 font-medium text-gray-600 dark:text-gray-400",
            textSizeClasses[size]
          )}
          data-testid="rating-value"
        >
          {value > 0 ? value.toFixed(1) : "No rating"}
        </span>
      )}
    </div>
  );
}