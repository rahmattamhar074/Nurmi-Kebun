import React from "react";
import TransactionLayout from "../layout";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { Order, OrderPagination } from "@/types/order";
import { ProcessingTable } from "./components/processing-table";

interface ProcessingProps {
  orders: Order[];
  pagination: OrderPagination;
}

const Processing = ({ orders, pagination }: ProcessingProps) => {
  return <ProcessingTable orders={orders} pagination={pagination} />;
};

export default Processing;

Processing.layout = (page: any) => (
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
        label: "Processing",
        href: "/dashboard/transactions/processing",
      },
    ]}
  >
    <TransactionLayout children={page} />
  </DashboardLayout>
);
