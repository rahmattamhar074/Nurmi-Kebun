import { Head, usePage, router } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";
import type { PaginatedCategories } from "@/types/product";
import DashboardLayout from "@/layouts/dashboard-layout";
import { CreateCategoryTrigger } from "./components/dialog/create";
import { ProductCategoryTable } from "./components/product-category.table";
import { convertLaravelPagination } from "@/lib/pagination";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { useState, useEffect } from "react";

interface PageProps extends SharedData {
  categories: PaginatedCategories;
  filters?: Record<string, any>;
}

export default function ProductCategoryIndex() {
  const { categories, filters = {} } = usePage<PageProps>().props;

  const { data: categoriesData, pagination } =
    convertLaravelPagination(categories);

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
      <Head title="Product Categories" />
      <div>
        <div className="flex flex-col gap-y-0.5">
          <h1 className="text-balance font-semibold text-lg/6">
            Product Categories
          </h1>
          <div className="max-w-3xl text-neutral-300 text-sm/6">
            Manage your product categories to organize your inventory
            effectively.
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-4 mt-6">
          <CreateCategoryTrigger />
          <div className="max-w-lg w-full">
            <SearchField aria-label="Search" className={"w-full"}>
              <SearchInput
                placeholder="Search categories..."
                className={"w-full"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchField>
          </div>
        </div>

        <div className="mt-6">
          <ProductCategoryTable
            categories={categoriesData}
            pagination={pagination}
            onSort={handleSort}
            sortDescriptor={sortDescriptor}
          />
        </div>
      </div>
    </>
  );
}

ProductCategoryIndex.layout = (page: any) => (
  <DashboardLayout
    children={page}
    breadcrumbItems={[
      {
        label: "Dashboard",
        href: "/",
      },
      {
        label: "Product Categories",
        href: "/categories",
      },
    ]}
  />
);
