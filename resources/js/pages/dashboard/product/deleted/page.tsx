import { Head, usePage, router } from "@inertiajs/react";
import { DeletedProductTable } from "./components/deleted-product-table";
import type { SharedData } from "@/types/shared";
import type { Product, ProductCategory } from "@/types/product";
import DashboardLayout from "@/layouts/dashboard-layout";
import { convertLaravelPagination } from "@/lib/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { useState, useEffect } from "react";
import { IconChevronDown } from "@intentui/icons";

interface PageProps extends SharedData {
  products: any;
  categories: ProductCategory[];
  filters?: Record<string, any>;
}

const StockOptions = [
  { id: "", name: "All Stock" },
  { id: "in_stock", name: "In Stock" },
  { id: "low_stock", name: "Low Stock" },
  { id: "out_of_stock", name: "Out of Stock" },
];

export default function DeletedProductsPage() {
  const { products, categories, filters = {} } = usePage<PageProps>().props;
  const { data: productData, pagination } = convertLaravelPagination(products);

  const [category, setCategory] = useState<string>(
    filters.category?.toString() || ""
  );
  const [stockStatus, setStockStatus] = useState<string>(
    filters.stock_status || ""
  );
  const [search, setSearch] = useState<string>(filters.search || "");

  const handleFilterChange = (newFilters: Record<string, any>) => {
    const finalParams = { ...filters, ...newFilters, page: 1 };

    router.get(window.location.pathname, finalParams, {
      preserveState: true,
      replace: true,
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== (filters.search || "")) {
        handleFilterChange({ search: search || undefined });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleCategoryChange = (value: React.Key | null) => {
    const newValue = value?.toString() || "";
    setCategory(newValue);
    handleFilterChange({ category: newValue || undefined });
  };

  const handleStockStatusChange = (value: React.Key | null) => {
    const newValue = value?.toString() || "";
    setStockStatus(newValue);
    handleFilterChange({ stock_status: newValue || undefined });
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    handleFilterChange({ sort: column, direction });
  };

  const sortDescriptor = filters.sort
    ? ({
        column: filters.sort,
        direction: filters.direction === "asc" ? "ascending" : "descending",
      } as const)
    : undefined;

  return (
    <>
      <Head title="Deleted Products" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance font-semibold text-lg/6">
              Deleted Products
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              View and restore previously deleted products
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-x-4 items-center py-4">
          <div className="min-w-40">
            <Select value={stockStatus} onChange={handleStockStatusChange}>
              <SelectTrigger className="flex justify-between items-center w-full">
                {stockStatus
                  ? StockOptions.find((option) => option.id === stockStatus)
                      ?.name || "All Stock"
                  : "All Stock"}
                <IconChevronDown className="group-open/select:rotate-180 transition-transform" />
              </SelectTrigger>
              <SelectContent>
                {StockOptions.map((option) => (
                  <SelectItem key={option.id} id={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-48">
            <Select value={category} onChange={handleCategoryChange}>
              <SelectTrigger className="flex justify-between items-center w-full">
                {category
                  ? categories.find((cat) => cat.id.toString() === category)
                      ?.name || "All Categories"
                  : "All Categories"}
                <IconChevronDown className="group-open/select:rotate-180 transition-transform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="" id="">
                  All Categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} id={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="max-w-lg w-full">
            <SearchField aria-label="Search" className={"w-full"}>
              <SearchInput
                placeholder="Search deleted products..."
                className={"w-full"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchField>
          </div>
        </div>
        <DeletedProductTable
          products={productData as Product[]}
          categories={categories}
          pagination={pagination}
          onSort={handleSort}
          sortDescriptor={sortDescriptor}
        />
      </div>
    </>
  );
}

DeletedProductsPage.layout = (page: any) => (
  <DashboardLayout
    children={page}
    breadcrumbItems={[
      {
        label: "Dashboard",
        href: "/",
      },
      {
        label: "Product",
        href: "/dashboard/products",
      },
      {
        label: "Deleted Products",
        href: "/dashboard/products/deleted",
      },
    ]}
  />
);
