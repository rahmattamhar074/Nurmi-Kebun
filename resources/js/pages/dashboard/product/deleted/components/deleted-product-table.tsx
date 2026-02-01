"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { Product, ProductCategory } from "@/types/product";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuTrigger,
} from "@/components/ui/menu";
import { EllipsisVerticalIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import type { SortDescriptor } from "react-aria-components";
import { RestoreProductDialog } from "./restore-dialog";

interface DeletedProductTableProps {
  products: Product[];
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

export function DeletedProductTable({
  products,
  categories,
  pagination,
  loading = false,
  onPageChange,
  onSort,
  sortDescriptor,
}: DeletedProductTableProps) {
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openRestoreDialog = (product: Product) => {
    setSelectedProduct(product);
    setRestoreDialogOpen(true);
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  const renderProductCategories = (product: Product) => {
    if (product.categories && product.categories.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {product.categories.map((category) => (
            <Badge key={category.id} intent="outline" className="text-xs">
              {category.name}
            </Badge>
          ))}
        </div>
      );
    } else if (product.product_category_id && product.product_category) {
      return <Badge intent="outline">{product.product_category.name}</Badge>;
    } else if (product.product_category_id) {
      return (
        <Badge intent="outline">
          {getCategoryName(product.product_category_id)}
        </Badge>
      );
    }
    return <Badge intent="outline">No Category</Badge>;
  };

  const getStockStatus = (
    stock: number,
  ): {
    label: string;
    intent: "primary" | "success" | "warning" | "danger";
  } => {
    if (stock <= 0) {
      return { label: "Out of Stock", intent: "danger" };
    } else if (stock <= 10) {
      return { label: "Low Stock", intent: "warning" };
    } else {
      return { label: "In Stock", intent: "success" };
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const columns: Column<Product>[] = [
    {
      key: "id",
      label: <div className="text-center font-medium">ID</div>,
      sortable: true,
      width: 80,
      className: "text-center",
    },
    {
      key: "product_code",
      label: "Product Code",
      sortable: true,
      width: 150,
      render: (_value, product) => (
        <div className="font-mono text-sm text-neutral-700 dark:text-neutral-300">
          {product.product_code}
        </div>
      ),
    },
    {
      key: "name",
      label: "Product",
      sortable: true,
      resizable: true,
      width: 300,
      isRowHeader: true,
      render: (_value, product) => (
        <div className="flex items-center gap-3">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="h-10 w-10 rounded-md object-cover flex-shrink-0 opacity-60"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-neutral-600 dark:text-neutral-400">
              {product.name}
            </div>
            {product.description && (
              <div className="text-sm text-neutral-500 dark:text-neutral-500 truncate">
                {product.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "categories",
      label: "Categories",
      sortable: false,
      width: 180,
      render: (_value, product) => renderProductCategories(product),
    },

    {
      key: "price",
      label: "Price",
      sortable: true,
      width: 120,
      className: "text-right",
      render: (_value, product) => (
        <span className="font-medium text-neutral-700 dark:text-neutral-400">
          {formatPrice(product.price)}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      width: 140,
      className: "text-center",
      render: (_value, product) => {
        const status = getStockStatus(product.stock);
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="font-medium text-neutral-700 dark:text-neutral-400">
              {product.stock}
            </span>
            <Badge intent={status.intent}>{status.label}</Badge>
          </div>
        );
      },
    },
    {
      key: "deleted_at",
      label: "Deleted At",
      sortable: true,
      width: 120,
      render: (value) => (
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {value ? formatDate(new Date(value), "dd MMMM yyyy HH:mm") : "-"}
        </div>
      ),
    },
    {
      key: "actions",
      label: <div className="text-right font-medium">Actions</div>,
      width: 120,
      className: "text-right",
      render: (_value, product) => (
        <div className="flex justify-end">
          <Menu>
            <MenuTrigger className="size-6">
              <EllipsisVerticalIcon />
            </MenuTrigger>
            <MenuContent aria-label="Actions" placement="left top">
              <MenuItem onAction={() => openRestoreDialog(product)}>
                <ArrowPathIcon />
                <MenuLabel>Restore</MenuLabel>
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
        { preserveState: true },
      );
    }
  };

  return (
    <>
      <Datatable
        data={products}
        columns={columns}
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortDescriptor={sortDescriptor}
        emptyMessage="No deleted products found."
        striped
      />
      {restoreDialogOpen && (
        <RestoreProductDialog
          product={selectedProduct}
          isOpen={restoreDialogOpen}
          onOpenChange={setRestoreDialogOpen}
        />
      )}
    </>
  );
}
