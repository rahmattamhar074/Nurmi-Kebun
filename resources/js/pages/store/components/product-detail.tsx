"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCart } from "@/stores/cart";
import type { Product } from "@/types/product";
import type { Review } from "@/types/review";
import { StarIcon } from "@heroicons/react/20/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMinus,
  IconPlus,
  IconShoppingBag,
} from "@intentui/icons";
import { type ReactNode, useEffect, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { twJoin } from "tailwind-merge";

interface ProductDetailProps {
  product: Product;
}

interface ReviewData {
  reviews: Review[];
  average_rating: number;
  review_count: number;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { addItem } = useCart();
  const { props } = usePage();
  const user = (props as any).auth?.user;
  const isCustomer = user?.role === "customer";

  const images = product.image_urls?.length
    ? product.image_urls
    : product.thumbnail_url
      ? [product.thumbnail_url]
      : ["/placeholder.svg"];

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + delta)));
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = () => {
    if (product.stock === 0)
      return { label: "Out of Stock", intent: "danger" as const };
    if (product.stock <= 10)
      return { label: "Low Stock", intent: "warning" as const };
    return { label: "In Stock", intent: "success" as const };
  };

  const stockStatus = getStockStatus();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const response = await fetch(`/products/${product.id}/reviews`);
        const data = await response.json();
        setReviewData(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product.id]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleSelect = (index: number) => {
    if (api) {
      api.scrollTo(index);
      setCurrent(index + 1);
    }
  };

  const renderStars = (score: number, size: "sm" | "md" = "md") => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            {star <= score ? (
              <StarIcon className={`${starSize} text-yellow-400`} />
            ) : (
              <StarOutlineIcon
                className={`${starSize} text-gray-300 dark:text-gray-600`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <ProductCarousel
          images={images}
          productName={product.name}
          api={api}
          setApi={setApi}
          current={current}
          count={count}
          handleSelect={handleSelect}
        />

        <div className="flex-1 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {product.name}
                </h1>
                <Badge intent={stockStatus.intent} className="shrink-0">
                  {product.stock} in stock
                </Badge>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Product Code: {product.product_code}
              </p>

              {reviewData && reviewData.review_count > 0 && (
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(reviewData.average_rating))}
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {reviewData.average_rating.toFixed(1)} (
                    {reviewData.review_count} reviews)
                  </span>
                </div>
              )}

              <div className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
            </div>

            {product.categories && product.categories.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category) => (
                    <Badge key={category.id} intent="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Description
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          <div>
            {user && isCustomer && product.stock > 0 && (
              <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-4 justify-between">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg">
                    <Button
                      size="sm"
                      intent="plain"
                      onClick={() => handleQuantityChange(-1)}
                      isDisabled={quantity <= 1}
                    >
                      <IconMinus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-center min-w-[3rem] border-x border-neutral-300 dark:border-neutral-600">
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      intent="plain"
                      onClick={() => handleQuantityChange(1)}
                      isDisabled={quantity >= product.stock}
                    >
                      <IconPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full flex items-center gap-2"
                  size="lg"
                  onClick={() => addItem(product, quantity)}
                >
                  <IconShoppingBag className="h-5 w-5" />
                  Add to Cart - {formatPrice(product.price * quantity)}
                </Button>
              </div>
            )}
          </div>

          {product.stock === 0 && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-300 text-sm font-medium">
                  This product is currently out of stock
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductReviewSection
        reviewData={reviewData}
        loadingReviews={loadingReviews}
        renderStars={renderStars}
      />
    </div>
  );
};

interface ProductCarouselProps {
  images: string[];
  productName: string;
  api: CarouselApi | undefined;
  setApi: (api: CarouselApi) => void;
  current: number;
  count: number;
  handleSelect: (index: number) => void;
}

const ProductCarousel = ({
  images,
  productName,
  api,
  setApi,
  current,
  count,
  handleSelect,
}: ProductCarouselProps) => {
  return (
    <div className="flex-1 lg:max-w-xl">
      <div className="relative">
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{
            align: "center",
            loop: images.length > 1,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={image}
                    alt={`${productName} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.includes("placeholder.svg")) {
                        return; // Already showing fallback
                      }
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <AriaButton
                onPress={() => api?.scrollPrev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 
                         p-2 text-white/80 hover:text-white
                         bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full
                         transition-all duration-200 focus:outline-hidden"
                aria-label="Previous image"
              >
                <IconChevronLeft className="h-5 w-5" />
              </AriaButton>
              <AriaButton
                onPress={() => api?.scrollNext()}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                         p-2 text-white/80 hover:text-white
                         bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full
                         transition-all duration-200 focus:outline-hidden"
                aria-label="Next image"
              >
                <IconChevronRight className="h-5 w-5" />
              </AriaButton>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <div className="flex gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm rounded-full">
                  {Array.from({ length: count }).map((_, index) => (
                    <AriaButton
                      className={twJoin(
                        "rounded-full transition-all duration-200 focus:outline-hidden",
                        current === index + 1
                          ? "h-2 w-6 bg-white shadow-sm"
                          : "h-2 w-2 bg-white/60 hover:bg-white/80",
                      )}
                      aria-label={`Go to image ${index + 1} of ${count}`}
                      onPress={() => handleSelect(index)}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

interface ProductReviewSectionProps {
  reviewData: ReviewData | null;
  loadingReviews: boolean;
  renderStars: (score: number, size?: "sm" | "md") => ReactNode;
}

const ProductReviewSection = ({
  reviewData,
  loadingReviews,
  renderStars,
}: ProductReviewSectionProps) => {
  if (loadingReviews) {
    return (
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 pb-6 lg:pb-0">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reviewData || reviewData.review_count === 0) {
    return null;
  }

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 pb-6 lg:pb-0">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
        Latest Reviews ({reviewData.review_count})
      </h2>
      <div className="space-y-4">
        {reviewData.reviews.map((review) => (
          <div
            key={review.id}
            className="flex gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 last:pb-0"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {review.user_name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-neutral-900 dark:text-white text-sm">
                  {review.user_name}
                </span>
                {renderStars(review.score, "sm")}
              </div>
              {review.review && (
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {review.review}
                </p>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {new Date(review.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
