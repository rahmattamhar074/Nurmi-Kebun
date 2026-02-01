"use client";

import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { Customer } from "@/types/customer";
import { formatDate } from "date-fns";

interface CustomerTableProps {
  customers: Customer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export function CustomerTable({
  customers,
  pagination,
  loading = false,
  onPageChange,
}: CustomerTableProps) {
  const columns: Column<Customer>[] = [
    {
      key: "name",
      label: "Name",
      sortable: false,
      resizable: true,
      width: 250,
      isRowHeader: true,
      render: (_value, customer) => (
        <div className="font-medium text-neutral-900 dark:text-white">
          {customer.name}
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: false,
      width: 250,
      render: (_value, customer) => (
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {customer.email}
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone Number",
      sortable: false,
      width: 180,
      render: (_value, customer) => (
        <div className="font-mono text-sm text-neutral-700 dark:text-neutral-300">
          {customer.phone}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Joined Date",
      sortable: false,
      width: 180,
      render: (value) => (
        <div className="text-sm text-neutral-500 dark:text-neutral-300">
          {formatDate(new Date(value), "dd MMMM yyyy")}
        </div>
      ),
    },
    {
      key: "orders_count",
      label: <div className="text-center font-medium">Purchase Count</div>,
      sortable: false,
      width: 150,
      className: "text-center",
      render: (_value, customer) => (
        <div className="font-semibold text-neutral-900 dark:text-white">
          {customer.orders_count}
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      router.get(window.location.pathname, { page }, { preserveState: true });
    }
  };

  return (
    <Datatable
      data={customers}
      columns={columns}
      pagination={pagination}
      loading={loading}
      onPageChange={handlePageChange}
      emptyMessage="No customers found."
      striped
    />
  );
}
