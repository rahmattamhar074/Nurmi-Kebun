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
    </div>
  );
}
