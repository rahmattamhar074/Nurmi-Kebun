import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Review } from "@/types/review";
import { StarIcon } from "@heroicons/react/20/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

interface MyReviewContentProps {
  reviews: Review[];
}

export function MyReviewContent({ reviews }: MyReviewContentProps) {
  const renderStars = (score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            {star <= score ? (
              <StarIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-fg">No reviews yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
            >
              {review.product?.thumbnail_url ? (
                <img
                  src={review.product.thumbnail_url}
                  alt={review.product_name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : null}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{review.product_name}</h3>
                {review.product?.product_code && (
                  <p className="text-sm text-muted-fg">
                    {review.product.product_code}
                  </p>
                )}
                <div className="mt-2">{renderStars(review.score)}</div>
                {review.review && (
                  <p className="mt-3 text-sm text-muted-fg leading-relaxed">
                    {review.review}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
