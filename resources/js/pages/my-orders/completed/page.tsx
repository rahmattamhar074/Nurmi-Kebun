import React from "react";
import OrderLayout from "../order-layout";
import type { Order, OrderPagination } from "@/types/order";
import { OrderCardList } from "../components/order-card-list";

interface CompletedProps {
  orders: Order[];
  pagination: OrderPagination;
}

const Completed = ({ orders, pagination }: CompletedProps) => {
  return (
    <OrderCardList
      orders={orders}
      pagination={pagination}
      emptyMessage="No completed orders."
    />
  );
};

Completed.layout = (page: React.ReactNode) => <OrderLayout>{page}</OrderLayout>;

export default Completed;
