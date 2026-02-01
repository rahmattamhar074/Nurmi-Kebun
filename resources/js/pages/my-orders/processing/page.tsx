import React from "react";
import OrderLayout from "../order-layout";
import type { Order, OrderPagination } from "@/types/order";
import { OrderCardList } from "../components/order-card-list";

interface ProcessingProps {
  orders: Order[];
  pagination: OrderPagination;
}

const Processing = ({ orders, pagination }: ProcessingProps) => {
  return (
    <OrderCardList
      orders={orders}
      pagination={pagination}
      emptyMessage="No orders being processed."
    />
  );
};

Processing.layout = (page: React.ReactNode) => (
  <OrderLayout>{page}</OrderLayout>
);

export default Processing;
