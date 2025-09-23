import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Heart, HeartOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

const feedbackFormSchema = z.object({
  rating: z.number().min(1, "Please provide a rating").max(5),
  comment: z.string().optional(),
  isLiked: z.boolean().optional()
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  itemId: string;
  itemType: "recipe" | "meal-plan";
  userId: string;
  title: string;
  existingFeedback?: {
    id: string;
    rating: number;
    comment?: string | null;
    isLiked?: boolean | null;
  } | null;
  onClose?: () => void;
  className?: string;
}

export function FeedbackForm({
  itemId,
  itemType,
  userId,
  title,
  existingFeedback,
  onClose,
  className
}: FeedbackFormProps) {
  const [likeStatus, setLikeStatus] = useState<boolean | null>(existingFeedback?.isLiked ?? null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      rating: existingFeedback?.rating ?? 0,
      comment: existingFeedback?.comment ?? "",
      isLiked: existingFeedback?.isLiked ?? undefined
    }
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const endpoint = itemType === "recipe" 
        ? `/api/recipes/${itemId}/feedback`
        : `/api/meal-plans/${itemId}/feedback`;
      
      return apiRequest("POST", endpoint, {
        userId,
        rating: data.rating,
        comment: data.comment || null,
        isLiked: likeStatus
      });
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ['/api/recipes']
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/${itemType === "recipe" ? "recipes" : "meal-plans"}/${itemId}/feedback`]
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/${itemType === "recipe" ? "recipes" : "meal-plans"}/${itemId}/rating`]
      });
      // Invalidate user-specific and meal plan queries if needed
      if (itemType === "meal-plan") {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/users']
        });
      }
      
      onClose?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FeedbackFormData) => {
    submitFeedbackMutation.mutate({
      ...data,
      isLiked: likeStatus ?? undefined
    });
  };

  const handleLikeClick = (liked: boolean) => {
    setLikeStatus(current => current === liked ? null : liked);
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Rate {itemType === "recipe" ? "Recipe" : "Meal Plan"}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {title}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Star Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <div data-testid="rating-input">
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        size="lg"
                        className="justify-start"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Like/Dislike Buttons */}
            <div className="space-y-2">
              <FormLabel>Did you like it?</FormLabel>
              <div className="flex gap-2" data-testid="like-dislike-buttons">
                <Button
                  type="button"
                  variant={likeStatus === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLikeClick(true)}
                  className={cn(
                    "flex-1",
                    likeStatus === true && "bg-green-500 hover:bg-green-600 text-white"
                  )}
                  data-testid="button-like"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button
                  type="button"
                  variant={likeStatus === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLikeClick(false)}
                  className={cn(
                    "flex-1",
                    likeStatus === false && "bg-red-500 hover:bg-red-600 text-white"
                  )}
                  data-testid="button-dislike"
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Dislike
                </Button>
              </div>
            </div>

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your thoughts about this recipe..."
                      rows={3}
                      data-testid="input-comment"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={submitFeedbackMutation.isPending}
                data-testid="button-submit-feedback"
              >
                {submitFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  data-testid="button-cancel-feedback"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}