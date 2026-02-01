import React from "react";
import OrderLayout from "../order-layout";
import type { Order, OrderPagination } from "@/types/order";
import { OrderCardList } from "../components/order-card-list";

interface AwaitingConfirmationProps {
  orders: Order[];
  pagination: OrderPagination;
}

const AwaitingConfirmation = ({
  orders,
  pagination,
}: AwaitingConfirmationProps) => {
  return (
    <OrderCardList
      orders={orders}
      pagination={pagination}
      emptyMessage="No orders awaiting confirmation."
    />
  );
};

AwaitingConfirmation.layout = (page: React.ReactNode) => (
  <OrderLayout>{page}</OrderLayout>
);

export default AwaitingConfirmation;
