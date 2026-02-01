"use client";

import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { Order, OrderPagination } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import type { SortDescriptor } from "react-aria-components";

interface ReportsTableProps {
  orders: Order[];
  pagination: OrderPagination;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  sortDescriptor?: SortDescriptor;
}

export function ReportsTable({
  orders,
  pagination,
  loading = false,
  onPageChange,
  onSort,
  sortDescriptor,
}: ReportsTableProps) {
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
      label: "Customer",
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
      key: "payment_method",
      label: "Payment Method",
      sortable: false,
      width: 160,
      render: (_value, order) => (
        <div className="text-sm text-neutral-700 dark:text-neutral-300">
          {order.paymentMethod?.name || "-"}
        </div>
      ),
    },
    {
      key: "completed_at",
      label: "Completed Date",
      sortable: true,
      width: 180,
      render: (value) => (
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {value ? formatDate(new Date(value), "dd MMM yyyy, HH:mm") : "-"}
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
    <Datatable
      data={orders}
      columns={columns}
      pagination={pagination}
      loading={loading}
      onPageChange={handlePageChange}
      onSort={handleSort}
      sortDescriptor={sortDescriptor}
      emptyMessage="No completed transactions found."
      striped
    />
  );
}
