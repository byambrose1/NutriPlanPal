import { useQuery } from "@tanstack/react-query";
import { FeedbackForm } from "./feedback-form";
import { Recipe, RecipeFeedback } from "@shared/schema";

interface RecipeFeedbackProps {
  recipe: Recipe;
  userId: string;
  onClose?: () => void;
  className?: string;
}

export function RecipeFeedback({
  recipe,
  userId,
  onClose,
  className
}: RecipeFeedbackProps) {
  // Fetch existing feedback for this user and recipe
  const { data: existingFeedback, isLoading } = useQuery<RecipeFeedback | null>({
    queryKey: [`/api/users/${userId}/recipes/${recipe.id}/feedback`],
    enabled: !!userId && !!recipe.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Loading feedback...</div>
      </div>
    );
  }

  return (
    <FeedbackForm
      itemId={recipe.id}
      itemType="recipe"
      userId={userId}
      title={recipe.title}
      existingFeedback={existingFeedback}
      onClose={onClose}
      className={className}
    />
  );
}