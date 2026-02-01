"use client";

import type { Order } from "@/types/order";
import {
  OrderInformation,
  PaymentMethodInfo,
  ShippingAddress,
  OrderItemsList,
} from "../../components";

interface DetailContentProps {
  order: Order;
}

export function DetailContent({ order }: DetailContentProps) {
  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-2 gap-6">
        <OrderInformation
          orderNumber={order.order_number}
          status={order.status}
          user={order.user}
          createdAt={order.created_at}
          shippingService={order.shipping_name}
        />
        <PaymentMethodInfo
          paymentMethodName={order.payment_method_name}
          paymentMethodType={order.payment_method_type}
          accountNumber={order.payment_account_number}
          accountHolder={order.payment_account_holder}
        />
      </div>
      <OrderItemsList
        items={order.items}
        subtotal={order.subtotal}
        shippingCost={order.shipping_cost}
        total={order.total}
      />
    </div>
  );
}
