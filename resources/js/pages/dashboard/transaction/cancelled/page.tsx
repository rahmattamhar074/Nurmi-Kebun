import React from "react";
import TransactionLayout from "../layout";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { Order, OrderPagination } from "@/types/order";
import { CancelledTable } from "./components/cancelled-table";

interface CancelledProps {
  orders: Order[];
  pagination: OrderPagination;
}

const Cancelled = ({ orders, pagination }: CancelledProps) => {
  return <CancelledTable orders={orders} pagination={pagination} />;
};

export default Cancelled;

Cancelled.layout = (page: any) => (
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
        label: "Cancelled",
        href: "/dashboard/transactions/cancelled",
      },
    ]}
  >
    <TransactionLayout children={page} />
  </DashboardLayout>
);
