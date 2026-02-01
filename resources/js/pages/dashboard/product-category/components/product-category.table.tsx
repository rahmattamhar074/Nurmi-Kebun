"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { ProductCategory } from "@/types/product";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import type { SortDescriptor } from "react-aria-components";
import { EditCategoryDialog } from "./dialog/edit";
import { DeleteCategoryDialog } from "./dialog/delete";

interface ProductCategoryTableProps {
  categories: ProductCategory[];
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

export function ProductCategoryTable({
  categories,
  pagination,
  loading = false,
  onPageChange,
  onSort,
  sortDescriptor,
}: ProductCategoryTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);

  const openEditDialog = (category: ProductCategory) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category: ProductCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };
  const columns: Column<ProductCategory>[] = [
    {
      key: "id",
      label: <div className="text-center font-medium">ID</div>,
      sortable: true,
      width: 20,
      className: "text-center",
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      resizable: true,
      isRowHeader: true,
      render: (value) => (
        <div className="font-medium text-neutral-900 dark:text-white py-4">
          {value}
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      resizable: true,
      render: (value) => (
        <div className="text-sm text-neutral-500 dark:text-neutral-300 max-w-xs truncate">
          {value || "No description"}
        </div>
      ),
    },
    {
      key: "products_count",
      label: (
        <div className="text-center">
          <div className="font-medium">Products Counts</div>
        </div>
      ),
      sortable: true,
      width: 140,
      className: "text-center",
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {value || 0} products
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      width: 120,
      render: (value) => (
        <div className="text-sm text-neutral-500 dark:text-neutral-300">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: <div className="text-right font-medium">Actions</div>,
      width: 120,
      className: "text-right",
      render: (_value, category) => (
        <div className="flex justify-end">
          <Menu>
            <MenuTrigger className="size-6">
              <EllipsisVerticalIcon />
            </MenuTrigger>
            <MenuContent aria-label="Actions" placement="left top">
              <MenuItem onAction={() => openEditDialog(category)}>
                Edit
              </MenuItem>
              <MenuItem
                intent="danger"
                onAction={() => openDeleteDialog(category)}
              >
                Delete
              </MenuItem>
            </MenuContent>
          </Menu>
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
    <>
      <Datatable
        data={categories}
        columns={columns}
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortDescriptor={sortDescriptor}
        emptyMessage="No product categories found. Create your first category to get started."
        striped
      />

      <EditCategoryDialog
        category={selectedCategory}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteCategoryDialog
        category={selectedCategory}
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
