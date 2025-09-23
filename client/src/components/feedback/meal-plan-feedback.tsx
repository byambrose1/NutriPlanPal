import { useQuery } from "@tanstack/react-query";
import { FeedbackForm } from "./feedback-form";
import { MealPlan, MealPlanFeedback } from "@shared/schema";

interface MealPlanFeedbackProps {
  mealPlan: MealPlan;
  userId: string;
  onClose?: () => void;
  className?: string;
}

export function MealPlanFeedback({
  mealPlan,
  userId,
  onClose,
  className
}: MealPlanFeedbackProps) {
  // Fetch existing feedback for this user and meal plan
  const { data: existingFeedback, isLoading } = useQuery<MealPlanFeedback | null>({
    queryKey: [`/api/users/${userId}/meal-plans/${mealPlan.id}/feedback`],
    enabled: !!userId && !!mealPlan.id
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
      itemId={mealPlan.id}
      itemType="meal-plan"
      userId={userId}
      title={`Week of ${new Date(mealPlan.weekStartDate).toLocaleDateString()}`}
      existingFeedback={existingFeedback}
      onClose={onClose}
      className={className}
    />
  );
}