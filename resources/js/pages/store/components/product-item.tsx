import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import {
  IconCircleInfo,
  IconPlus,
  IconShoppingBag,
  IconStar,
} from "@intentui/icons";
import { useCart, useCartItem } from "@/stores/cart";
import { usePage } from "@inertiajs/react";

interface ProductItemProps {
  product: Product;
  onClick: (product: Product) => void;
}
const ProductItem = ({ product, onClick }: ProductItemProps) => {
  const { props } = usePage();
  const user = (props as any).auth?.user;
  const isCustomer = user?.role === "customer";
  const { addItem } = useCart();
  const cartItem = useCartItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addItem(product, 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatStock = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return `Only ${stock} left`;
    return `${stock} in stock`;
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "danger";
    if (stock <= 10) return "warning";
    return "success";
  };
  return (
    <div
      key={product.id}
      className="relative bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg"
    >
      <div className="flex justify-between items-center">
        <Badge intent={getStockColor(product.stock)}>
          {formatStock(product.stock)}
        </Badge>
        <Button
          isCircle
          size="sq-sm"
          onClick={() => onClick(product)}
          className={"bg-primary/10 hover:bg-primary/20 border-0"}
        >
          <div>
            <IconCircleInfo className="text-primary" />
          </div>
        </Button>
      </div>
      <div className="w-2/3 mx-auto py-4">
        {product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center"
          style={{ display: product.thumbnail_url ? "none" : "flex" }}
        >
          <IconShoppingBag className="h-8 w-8 text-neutral-400" />
        </div>
      </div>

      <div className="py-2">
        <div className="space-y-2">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2">
                {product.name}
              </h3>
              {product.reviews_count !== undefined &&
                product.reviews_count > 0 && (
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
              <span className="text-sm font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>
            {user && isCustomer && (
              <div className="relative">
                <Button
                  isDisabled={product.stock === 0}
                  size="sq-sm"
                  className={"w-full"}
                  onClick={handleAddToCart}
                >
                  <div>
                    <IconPlus className="size-4 text-white" />
                  </div>
                </Button>
                {cartItem && cartItem.quantity > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <Badge
                      intent="success"
                      className="bg-primary text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full dark:bg-primary dark:text-white"
                    >
                      {cartItem.quantity}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
