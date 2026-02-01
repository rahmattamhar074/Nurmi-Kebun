import { useEffect } from "react";
import TransactionLayout from "../layout";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { Order, OrderPagination } from "@/types/order";
import { AwaitingConfirmationTable } from "./components/awaiting-confirmation-table";
import { useNewOrders } from "@/hooks/use-new-orders";

interface AwaitingConfirmationProps {
  orders: Order[];
  pagination: OrderPagination;
}

const AwaitingConfirmation = ({
  orders,
  pagination,
}: AwaitingConfirmationProps) => {
  const { reset } = useNewOrders();

  // Reset counter when viewing this page
  useEffect(() => {
    reset();
  }, [reset]);

  return <AwaitingConfirmationTable orders={orders} pagination={pagination} />;
};

export default AwaitingConfirmation;

AwaitingConfirmation.layout = (page: any) => (
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
        label: "Awaiting Confirmation",
        href: "/dashboard/transactions/awaiting-confirmation",
      },
    ]}
  >
    <TransactionLayout children={page} />
  </DashboardLayout>
);
