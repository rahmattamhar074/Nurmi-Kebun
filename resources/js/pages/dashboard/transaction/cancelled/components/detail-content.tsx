"use client";

import type { Order } from "@/types/order";
import {
  OrderInformation,
  OrderItemsList,
  ShippingInfo,
} from "../../components";

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

      {order.cancellation_reason && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">
            Cancellation Information
          </h3>
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
            <p className="text-sm text-muted-fg mb-2">
              Reason for Cancellation
            </p>
            <p className="font-medium">{order.cancellation_reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}
