import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Link } from "@inertiajs/react";
import ProductCategory from "./product-category";
import type { Product } from "@/types/product";
import { IconStar, IconShoppingBag } from "@intentui/icons";

interface ProductHighlightProps {
  products: Product[];
}

const ProductHighlight = ({ products }: ProductHighlightProps) => {
  return (
    <div className="space-y-16 mt-8 lg:mt-16">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="space-y-2 flex-1">
          <p className="text-2xl font-semibold">Discover Our Featured Plants</p>
          <p className="text-neutral-500 dark:text-neutral-500 max-w-sm leading-relaxed">
            Explore a curated selection of our most popular and unique plants,
            handpicked to brighten your space.
          </p>
        </div>
        <div className="shrink-0">
          <Link href="/store">
            <div className="px-4 py-2 text-lg rounded-full border w-fit font-medium flex gap-x-2 items-center">
              Shop Now
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
      <ProductCategory />
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <HighlightProdictCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

interface HighlightProdictCardProps {
  product: Product;
}

const HighlightProdictCard = ({ product }: HighlightProdictCardProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="aspect-square bg-muted rounded-lg p-4 flex flex-col gap-y-2 items-center justify-between">
        <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2 text-center h-12 flex items-center">
          {product.name}
        </h3>
        <div className="w-2/3 mx-auto">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center aspect-square"
            style={{ display: product.thumbnail_url ? "none" : "flex" }}
          >
            <IconShoppingBag className="h-8 w-8 text-neutral-400" />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm lg:text-base font-bold text-primary">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(product.price))}
          </span>
          {product.reviews_count !== undefined && product.reviews_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">
                {product.reviews_avg_score
                  ? Number(product.reviews_avg_score).toFixed(1)
                  : "0.0"}
              </span>
              <IconStar className="size-4 fill-yellow-400 text-yellow-400" />
              <span>-</span>
              <span>
                {product.reviews_count}{" "}
                {product.reviews_count === 1 ? "Review" : "Reviews"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHighlight;
