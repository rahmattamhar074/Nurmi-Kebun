import { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import { StarIcon } from "@heroicons/react/24/solid";
import type { OrderItem } from "@/types/order";

interface ReviewTriggerProps {
  orderNumber: string;
  orderItems: OrderItem[];
}

export function ReviewTrigger({ orderNumber, orderItems }: ReviewTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [reviews, setReviews] = useState<Record<number, string>>({});
  const [hoveredStars, setHoveredStars] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (itemId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [itemId]: rating }));
  };

  const handleReviewChange = (itemId: number, text: string) => {
    setReviews((prev) => ({ ...prev, [itemId]: text }));
  };

  const handleSubmit = () => {
    const reviewData = orderItems.map((item) => ({
      order_item_id: item.id,
      product_id: item.product_id,
      score: ratings[item.id] || 5,
      review: reviews[item.id] || "",
    }));

    setIsSubmitting(true);

    router.post(
      route("my-orders.review", orderNumber),
      { reviews: reviewData },
      {
        onSuccess: () => {
          setIsOpen(false);
          setRatings({});
          setReviews({});
          setDialogKey((prev) => prev + 1);
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const isFormValid = () => {
    return orderItems.every((item) => ratings[item.id] && ratings[item.id] > 0);
  };

  const renderStars = (itemId: number) => {
    const currentRating = ratings[itemId] || 0;
    const hoveredRating = hoveredStars[itemId] || 0;
    const displayRating = hoveredRating || currentRating;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(itemId, star)}
            onMouseEnter={() =>
              setHoveredStars((prev) => ({ ...prev, [itemId]: star }))
            }
            onMouseLeave={() =>
              setHoveredStars((prev) => ({ ...prev, [itemId]: 0 }))
            }
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            <StarIcon
              className={`size-6 transition-colors ${
                star <= displayRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-neutral-300 dark:text-neutral-600"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-fg">
          {currentRating > 0 ? `${currentRating}/5` : "Not rated"}
        </span>
      </div>
    );
  };

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Write a Review</Button>

      {isOpen && (
        <DynamicDialog
          key={dialogKey}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Review Your Order"
          description="Share your experience with the products you purchased"
        >
          <div className="space-y-6 py-8 sm:py-0">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {orderItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="space-y-2">
                    <div className="flex gap-3">
                      {item.product_thumbnail && (
                        <img
                          src={item.product_thumbnail}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {item.product_name}
                        </h3>
                        <p className="text-xs text-muted-fg">
                          {item.product_code}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`rating-${item.id}`}
                      >
                        Rating <span className="text-red-500">*</span>
                      </label>
                      {renderStars(item.id)}
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`review-${item.id}`}
                      >
                        Review (Optional)
                      </label>
                      <Textarea
                        id={`review-${item.id}`}
                        value={reviews[item.id] || ""}
                        onChange={(e) =>
                          handleReviewChange(item.id, e.target.value)
                        }
                        placeholder="Share your thoughts about this product..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                intent="outline"
                onPress={() => setIsOpen(false)}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onPress={handleSubmit}
                isDisabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting ? "Submitting..." : "Submit Reviews"}
              </Button>
            </div>
          </div>
        </DynamicDialog>
      )}
    </>
  );
}
