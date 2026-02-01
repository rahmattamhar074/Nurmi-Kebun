"use client";

import type { Order } from "@/types/order";
import {
  OrderInformation,
  OrderItemsList,
  ShippingInfo,
} from "../../components";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";

interface DetailContentProps {
  order: Order;
}

export function DetailContent({ order }: DetailContentProps) {
  return (
    <div className="space-y-6 w-full">
      <OrderInformation
        orderNumber={order.order_number}
        status={order.status}
        user={order.user}
        createdAt={order.created_at}
          shippingService={order.shipping_name}
        trackingNumber={order.tracking_number}
      />

      <ShippingInfo
        recipientName={order.recipient_name}
        recipientPhone={order.recipient_phone}
        fullAddress={order.full_address}
        subdistrictName={order.subdistrict_name}
        cityName={order.city_name}
        provinceName={order.province_name}
        postalCode={order.postal_code}
      />

      <OrderItemsList
        items={order.items}
        subtotal={order.subtotal}
        shippingCost={order.shipping_cost}
        total={order.total}
      />

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Completion Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-fg">Completed At</p>
            <p className="font-medium">
              {order.completed_at
                ? formatDate(new Date(order.completed_at), "dd MMM yyyy, HH:mm")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-fg">Completion Method</p>
            <Badge
              intent={order.completion_method === "auto" ? "info" : "secondary"}
              className="mt-1"
            >
              {order.completion_method === "auto" ? "Automatic" : "Manual"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
