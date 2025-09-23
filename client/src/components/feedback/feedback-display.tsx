import { useQuery } from "@tanstack/react-query";
import { StarRating } from "@/components/ui/star-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface FeedbackItem {
  id: string;
  rating: number;
  comment?: string | null;
  isLiked?: boolean | null;
  createdAt: string;
  userId: string;
}

interface FeedbackDisplayProps {
  itemId: string;
  itemType: "recipe" | "meal-plan";
  currentRating?: string;
  className?: string;
  maxComments?: number;
}

export function FeedbackDisplay({
  itemId,
  itemType,
  currentRating,
  className,
  maxComments = 5
}: FeedbackDisplayProps) {
  // Fetch all feedback for the item
  const { data: feedback = [], isLoading } = useQuery<FeedbackItem[]>({
    queryKey: [`/api/${itemType === "recipe" ? "recipes" : "meal-plans"}/${itemId}/feedback`]
  });

  // Fetch average rating
  const { data: ratingData } = useQuery<{ averageRating: number }>({
    queryKey: [`/api/${itemType === "recipe" ? "recipes" : "meal-plans"}/${itemId}/rating`]
  });

  const averageRating = ratingData?.averageRating || parseFloat(currentRating || "0");
  const totalFeedback = feedback.length;
  const likedCount = feedback.filter(f => f.isLiked === true).length;
  const dislikedCount = feedback.filter(f => f.isLiked === false).length;
  const commentsWithText = feedback.filter(f => f.comment && f.comment.trim().length > 0);
  const recentComments = commentsWithText.slice(0, maxComments);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Loading feedback...</div>
      </div>
    );
  }

  if (totalFeedback === 0) {
    return (
      <div className={cn("text-center p-4 text-gray-500", className)}>
        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No feedback yet</p>
        <p className="text-xs">Be the first to rate this {itemType === "recipe" ? "recipe" : "meal plan"}!</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Rating Summary */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid="feedback-summary">
        <div className="text-center">
          <div className="text-2xl font-bold" data-testid="text-average-rating">
            {averageRating.toFixed(1)}
          </div>
          <StarRating value={averageRating} readonly showValue={false} />
          <div className="text-sm text-gray-500 mt-1" data-testid="text-total-feedback">
            {totalFeedback} {totalFeedback === 1 ? "rating" : "ratings"}
          </div>
        </div>

        <Separator orientation="vertical" className="h-16" />

        <div className="flex gap-4">
          {/* Likes/Dislikes */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-green-600">
              <ThumbsUp className="h-4 w-4" />
              <span className="font-semibold" data-testid="text-likes-count">{likedCount}</span>
            </div>
            <div className="text-xs text-gray-500">Liked</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center gap-1 text-red-600">
              <ThumbsDown className="h-4 w-4" />
              <span className="font-semibold" data-testid="text-dislikes-count">{dislikedCount}</span>
            </div>
            <div className="text-xs text-gray-500">Disliked</div>
          </div>
        </div>
      </div>

      {/* Recent Comments */}
      {recentComments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Recent Comments
            <Badge variant="secondary" className="text-xs">
              {commentsWithText.length}
            </Badge>
          </h4>
          
          <div className="space-y-3" data-testid="comments-list">
            {recentComments.map((comment, index) => (
              <Card key={comment.id} className="p-3" data-testid={`comment-${index}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {comment.userId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating value={comment.rating} readonly size="sm" />
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                      {comment.isLiked !== null && (
                        <div className="flex items-center gap-1">
                          {comment.isLiked ? (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Liked
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              Disliked
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {comment.comment && (
                      <p className="text-sm text-gray-700 dark:text-gray-300" data-testid="comment-text">
                        {comment.comment}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {commentsWithText.length > maxComments && (
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                {commentsWithText.length - maxComments} more comments
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}