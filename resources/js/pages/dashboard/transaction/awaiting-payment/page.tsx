import React from "react";
import TransactionLayout from "../layout";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { Order, OrderPagination } from "@/types/order";
import { AwaitingPaymentTable } from "./components/awaiting-payment-table";

interface AwaitPaymentTransactionProps {
  orders: Order[];
  pagination: OrderPagination;
}

const AwaitPaymentTransaction = ({
  orders,
  pagination,
}: AwaitPaymentTransactionProps) => {
  return <AwaitingPaymentTable orders={orders} pagination={pagination} />;
};

export default AwaitPaymentTransaction;

AwaitPaymentTransaction.layout = (page: any) => (
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
        label: "Awaiting Payment",
        href: "/dashboard/transactions/awaiting-payment",
      },
    ]}
  >
    <TransactionLayout children={page} />
  </DashboardLayout>
);
