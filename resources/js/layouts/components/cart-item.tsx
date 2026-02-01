"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconMinus, IconPlus, IconTrash } from "@intentui/icons";
import type { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/stores/cart";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const totalPrice = item.price * item.quantity;
  const isOutOfStock = item.quantity > item.product.stock;

  return (
    <div className="flex gap-3 p-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
      <div className="flex-shrink-0">
        <img
          src={item.product.thumbnail_url || "/placeholder.svg"}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded-lg bg-neutral-100 dark:bg-neutral-800"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes("placeholder.svg")) {
              return; // Already showing fallback
            }
            target.src = "/placeholder.svg";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {item.product.name}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {formatPrice(item.price)} each
            </p>
            {isOutOfStock && (
              <Badge intent="danger" className="mt-1 text-xs">
                ⚠️ Exceeds stock ({item.product.stock} available)
              </Badge>
            )}
            {item.product.stock === 0 && (
              <Badge intent="danger" className="mt-1 text-xs">
                ❌ Out of Stock
              </Badge>
            )}
            {item.product.stock > 0 &&
              item.product.stock <= 10 &&
              !isOutOfStock && (
                <Badge intent="warning" className="mt-1 text-xs">
                  ⏰ Low Stock ({item.product.stock} left)
                </Badge>
              )}
          </div>

          <Button
            size="sm"
            intent="plain"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 p-1"
            aria-label={`Remove ${item.product.name} from cart`}
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              intent="outline"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              isDisabled={item.quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <IconMinus className="h-3 w-3" />
            </Button>

            <span className="text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>

            <Button
              size="sm"
              intent="outline"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              isDisabled={
                item.quantity >= item.product.stock || item.product.stock === 0
              }
              className="h-8 w-8 p-0"
              aria-label={
                item.product.stock === 0
                  ? "Out of stock"
                  : item.quantity >= item.product.stock
                    ? "Max stock reached"
                    : "Increase quantity"
              }
            >
              <IconPlus className="h-3 w-3" />
            </Button>

            {isOutOfStock && (
              <Button
                size="sm"
                intent="primary"
                onClick={() => handleQuantityChange(item.product.stock)}
                className="h-8 text-xs px-2 ml-2"
                aria-label="Fix quantity to available stock"
              >
                Fix
              </Button>
            )}
          </div>

          <div className="text-sm font-medium text-neutral-900 dark:text-white">
            {formatPrice(totalPrice)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
