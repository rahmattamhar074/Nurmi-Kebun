import React from "react";
import TransactionLayout from "../layout";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { Order, OrderPagination } from "@/types/order";
import { ShippedTable } from "./components/shipped-table";

interface ShippedProps {
  orders: Order[];
  pagination: OrderPagination;
}

const Shipped = ({ orders, pagination }: ShippedProps) => {
  return <ShippedTable orders={orders} pagination={pagination} />;
};

export default Shipped;

Shipped.layout = (page: any) => (
  <DashboardLayout
    breadcrumbItems={[
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Transactions",
        href: "/dashboard/transactions",
      },
      {
        label: "Shipped",
        href: "/dashboard/transactions/shipped",
      },
    ]}
  >
    <TransactionLayout children={page} />
  </DashboardLayout>
);
