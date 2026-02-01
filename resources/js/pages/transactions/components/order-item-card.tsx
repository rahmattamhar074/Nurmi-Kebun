import type { OrderItem } from "@/types/order";

interface OrderItemCardProps {
  item: OrderItem;
  formatCurrency: (amount: number) => string;
}

export function OrderItemCard({ item, formatCurrency }: OrderItemCardProps) {
  return (
    <div className="flex items-center gap-4 pb-4 border-b last:border-b-0">
      {item.product_thumbnail && (
        <img
          src={
            item.product_thumbnail.startsWith("http")
              ? item.product_thumbnail
              : `/storage/${item.product_thumbnail}`
          }
          alt={item.product_name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          {item.product_name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {item.product_code}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatCurrency(item.price)} × {item.quantity}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
          {formatCurrency(item.subtotal)}
        </p>
      </div>
    </div>
  );
}
