import { router } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface PendingOrder {
  status: string;
  label: string;
  count: number;
}

interface OrdersTableProps {
  orders: PendingOrder[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const getStatusRoute = (status: string) => {
    const routeMap: Record<string, string> = {
      pending_payment: "/dashboard/transactions/awaiting-payment",
      payment_verification: "/dashboard/transactions/awaiting-confirmation",
      processing: "/dashboard/transactions/processing",
      shipped: "/dashboard/transactions/shipped",
    };
    return routeMap[status] || "/dashboard/transactions";
  };

  const getStatusBadgeIntent = (status: string) => {
    const intentMap: Record<
      string,
      "warning" | "info" | "primary" | "success"
    > = {
      pending_payment: "warning",
      payment_verification: "info",
      processing: "primary",
      shipped: "success",
    };
    return intentMap[status] || "secondary";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-balance font-semibold text-lg/6">Ongoing Orders</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Orders that are currently being processed
        </p>
      </div>
      <div className="rounded-lg border p-4">
        <Table className="[&_tr]:h-14 [&_td]:border-b-0">
          <TableHeader>
            <TableRow>
              <TableColumn className="font-semibold text-muted-fg">
                Status
              </TableColumn>
              <TableColumn className="text-right font-semibold text-muted-fg">
                Count
              </TableColumn>
              <TableColumn className="text-right font-semibold text-muted-fg">
                Action
              </TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:nth-child(odd)]:bg-muted/30">
            {orders.map((order) => (
              <TableRow key={order.status}>
                <TableCell>
                  <Badge intent={getStatusBadgeIntent(order.status)}>
                    {order.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {order.count}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    intent="outline"
                    onPress={() => router.visit(getStatusRoute(order.status))}
                  >
                    View
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
