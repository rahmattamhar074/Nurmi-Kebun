import React from "react";
import OrderLayout from "../order-layout";
import type { Order, OrderPagination } from "@/types/order";
import { OrderCardList } from "../components/order-card-list";

interface PendingPaymentProps {
  orders: Order[];
  pagination: OrderPagination;
}

const PendingPayment = ({ orders, pagination }: PendingPaymentProps) => {
  return (
    <OrderCardList
      orders={orders}
      pagination={pagination}
      emptyMessage="No pending payment orders."
    />
  );
};

PendingPayment.layout = (page: React.ReactNode) => (
  <OrderLayout>{page}</OrderLayout>
);

export default PendingPayment;
