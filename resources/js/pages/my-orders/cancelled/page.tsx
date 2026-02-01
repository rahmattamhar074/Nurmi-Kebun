import React from "react";
import OrderLayout from "../order-layout";
import type { Order, OrderPagination } from "@/types/order";
import { OrderCardList } from "../components/order-card-list";

interface CancelledProps {
  orders: Order[];
  pagination: OrderPagination;
}

const Cancelled = ({ orders, pagination }: CancelledProps) => {
  return (
    <OrderCardList
      orders={orders}
      pagination={pagination}
      emptyMessage="No cancelled orders."
    />
  );
};

Cancelled.layout = (page: React.ReactNode) => <OrderLayout>{page}</OrderLayout>;

export default Cancelled;
