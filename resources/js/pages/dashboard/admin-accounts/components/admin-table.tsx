"use client";

import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { Admin } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import type { SortDescriptor } from "react-aria-components";

interface AdminTableProps {
  admins: Admin[];
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
  onSort?: (column: string, direction: "asc" | "desc") => void;
  sortDescriptor?: SortDescriptor;
}

export function AdminTable({
  admins,
  pagination,
  loading = false,
  onPageChange,
  onSort,
  sortDescriptor,
}: AdminTableProps) {
  const columns: Column<Admin>[] = [
    {
      key: "name",
      label: "Name",
      sortable: false,
      resizable: true,
      width: 250,
      isRowHeader: true,
      render: (_value, admin) => (
        <div className="flex items-center gap-3">
          <img
            src={admin.gravatar}
            alt={admin.name}
            className="h-8 w-8 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-neutral-900 dark:text-white">
              {admin.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: false,
      width: 250,
      render: (value) => (
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {value}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: false,
      width: 150,
      render: (value) => (
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {value}
        </span>
      ),
    },
    {
      key: "email_verified_at",
      label: "Email Status",
      sortable: false,
      width: 120,
      className: "text-center",
      render: (value) => (
        <div className="flex justify-center">
          {value ? (
            <Badge intent="success">Verified</Badge>
          ) : (
            <Badge intent="warning">Unverified</Badge>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: false,
      width: 180,
      render: (value) => (
        <div className="text-sm text-neutral-500 dark:text-neutral-300">
          {formatDate(new Date(value), "dd MMMM yyyy HH:mm")}
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
        { preserveState: true }
      );
    }
  };

  return (
    <Datatable
      data={admins}
      columns={columns}
      pagination={pagination}
      loading={loading}
      onPageChange={handlePageChange}
      onSort={handleSort}
      sortDescriptor={sortDescriptor}
      emptyMessage="No admin accounts found. Create your first admin to get started."
      striped
    />
  );
}
