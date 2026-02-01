"use client";

import type { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "date-fns";
import { Link } from "@inertiajs/react";
import { IconCircleInfo } from "@intentui/icons";
import { CancelOrderTrigger } from "./cancel-order-trigger";

interface OrderCardProps {
  order: Order;
}

const statusConfig = {
  pending_payment: { label: "Pending Payment", intent: "warning" as const },
  payment_verification: {
    label: "Payment Verification",
    intent: "info" as const,
  },
  processing: { label: "Processing", intent: "secondary" as const },
  shipped: { label: "Shipped", intent: "info" as const },
  completed: { label: "Completed", intent: "success" as const },
  cancelled: { label: "Cancelled", intent: "danger" as const },
};

export function OrderCard({ order }: OrderCardProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const firstItem = order.items?.[0];
  const additionalItemsCount = (order.items?.length || 0) - 1;

  const statusInfo = statusConfig[order.status];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex lg:items-center justify-between flex-col-reverse lg:flex-row gap-2 items-start">
          Order #{order.order_number}
          <Badge intent={statusInfo.intent} className="text-xs">
            {statusInfo.label}
          </Badge>
        </CardTitle>
        <CardDescription>
          {formatDate(new Date(order.created_at), "MMM dd, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              {firstItem?.product_thumbnail ? (
                <img
                  src={firstItem.product_thumbnail}
                  alt={firstItem.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <IconCircleInfo className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {firstItem?.product_name || "No items"}
                </h3>
                <div className="flex items-center">
                  <p>
                    {additionalItemsCount > 0 && (
                      <span className="text-muted-foreground text-sm font-medium ml-1">
                        +{additionalItemsCount}{" "}
                        {additionalItemsCount === 1 ? "item" : "items"}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-semibold whitespace-nowrap">
                {formatPrice(order.total)}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-2">
        <Link href={route("my-orders.show", order.order_number)}>
          <Button size="sm" intent="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <CancelOrderTrigger
          orderNumber={order.order_number}
          status={order.status}
        />
      </CardFooter>
    </Card>
  );
}
