"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { Order, OrderPagination } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import type { SortDescriptor } from "react-aria-components";
import { EyeIcon } from "@heroicons/react/20/solid";
import { DetailDialog } from "./detail-dialog";

interface CompletedTableProps {
  orders: Order[];
  pagination: OrderPagination;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  sortDescriptor?: SortDescriptor;
}

export function CompletedTable({
  orders,
  pagination,
  loading = false,
  onPageChange,
  onSort,
  sortDescriptor,
}: CompletedTableProps) {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openDetailDialog = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTotalItems = (order: Order): number => {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  const columns: Column<Order>[] = [
    {
      key: "order_number",
      label: "Order Number",
      sortable: true,
      width: 180,
      render: (_value, order) => (
        <div className="font-mono text-sm font-medium text-neutral-900 dark:text-white">
          {order.order_number}
        </div>
      ),
    },
    {
      key: "user",
      label: "Customer Name",
      sortable: false,
      width: 200,
      render: (_value, order) => (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-900 dark:text-white">
            {order.user?.name || "Unknown"}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {order.user?.email || ""}
          </span>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total Amount",
      sortable: true,
      width: 150,
      className: "text-right",
      render: (_value, order) => (
        <span className="font-semibold text-neutral-900 dark:text-white">
          {formatPrice(order.total)}
        </span>
      ),
    },
    {
      key: "items",
      label: "Total Items",
      sortable: false,
      width: 120,
      className: "text-center",
      render: (_value, order) => (
        <Badge intent="secondary" className="font-medium">
          {getTotalItems(order)} items
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      width: 140,
      className: "text-center",
      render: (_value, order) => (
        <Badge intent="success" className="font-medium">
          Completed
        </Badge>
      ),
    },
    {
      key: "completed_at",
      label: "Completed At",
      sortable: true,
      width: 180,
      render: (value) => (
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {value ? formatDate(new Date(value), "dd MMM yyyy, HH:mm") : "-"}
        </div>
      ),
    },
    {
      key: "actions",
      label: <div className="text-center font-medium">Actions</div>,
      width: 100,
      className: "text-center",
      render: (_value, order) => (
        <div className="w-fit mx-auto">
          <Button
            size="sm"
            intent="outline"
            onPress={() => openDetailDialog(order)}
          >
            <div className="flex items-center gap-2">
              <EyeIcon className="size-4" />
              Detail
            </div>
          </Button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      router.get(
        window.location.pathname,
        { page },
        { preserveState: true, preserveScroll: true }
      );
    }
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    if (onSort) {
      onSort(column, direction);
    } else {
      router.get(
        window.location.pathname,
        {
          sort: column,
          direction,
          page: 1,
        },
        { preserveState: true, preserveScroll: true }
      );
    }
  };

  return (
    <>
      <Datatable
        data={orders}
        columns={columns}
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortDescriptor={sortDescriptor}
        emptyMessage="No completed orders."
        striped
      />
      <DetailDialog
        order={selectedOrder}
        isOpen={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </>
  );
}
