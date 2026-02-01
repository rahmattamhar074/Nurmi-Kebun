import React from "react";
import TransactionLayout from "../layout";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { Order, OrderPagination } from "@/types/order";
import { CompletedTable } from "./components/completed-table";

interface CompletedProps {
  orders: Order[];
  pagination: OrderPagination;
}

const Completed = ({ orders, pagination }: CompletedProps) => {
  return <CompletedTable orders={orders} pagination={pagination} />;
};

export default Completed;

Completed.layout = (page: any) => (
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
        label: "Completed",
        href: "/dashboard/transactions/completed",
      },
    ]}
  >
    <TransactionLayout children={page} />
  </DashboardLayout>
);
