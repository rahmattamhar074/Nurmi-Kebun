import type { Order, OrderPagination } from "@/types/order";
import { OrderCardList } from "../components/order-card-list";
import OrderLayout from "../order-layout";

interface ShippedProps {
  orders: Order[];
  pagination: OrderPagination;
}

const Shipped = ({ orders, pagination }: ShippedProps) => {
  return (
    <OrderCardList
      orders={orders}
      pagination={pagination}
      emptyMessage="No shipped orders."
    />
  );
};

Shipped.layout = (page: React.ReactNode) => <OrderLayout>{page}</OrderLayout>;

export default Shipped;
