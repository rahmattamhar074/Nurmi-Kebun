import type { OrderItem } from "@/types/order";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

interface OrderItemsListProps {
  items?: OrderItem[];
  subtotal: number;
  shippingCost: number;
  shippingService?: string;
  total: number;
}

export function OrderItemsList({
  items,
  subtotal,
  shippingCost,
  shippingService,
  total,
}: OrderItemsListProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBagIcon className="size-5 text-neutral-500" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Order Items
        </h3>
      </div>
      <div className="space-y-3">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
            >
              {item.product_thumbnail && (
                <img
                  src={item.product_thumbnail}
                  alt={item.product_name}
                  className="size-16 rounded-md object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 dark:text-white">
                  {item.product_name}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                  {item.product_code}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">
            No items found
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Subtotal
          </span>
          <span className="font-medium text-neutral-900 dark:text-white">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Shipping Cost
          </span>
          <span className="font-medium text-neutral-900 dark:text-white">
            {formatPrice(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <span className="text-neutral-900 dark:text-white">Total</span>
          <span className="text-neutral-900 dark:text-white">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
