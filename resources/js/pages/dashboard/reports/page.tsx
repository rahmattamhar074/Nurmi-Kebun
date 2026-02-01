import { Head, usePage, router } from "@inertiajs/react";
import { ReportsTable } from "./components/reports-table";
import type { SharedData } from "@/types/shared";
import type { Order } from "@/types/order";
import DashboardLayout from "@/layouts/dashboard-layout";
import { convertLaravelPagination } from "@/lib/pagination";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "./components/export-dialog";
import { IconFileDownload } from "@intentui/icons";

interface PageProps extends SharedData {
  orders: any;
  filters?: Record<string, any>;
}

export default function ReportsIndex() {
  const { orders, filters = {} } = usePage<PageProps>().props;
  const { data: orderData, pagination } = orders
    ? convertLaravelPagination(orders)
    : {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          perPage: 15,
          total: 0,
          from: 0,
          to: 0,
        },
      };

  const [search, setSearch] = useState<string>(filters.search || "");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

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
      <Head title="Reports" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance font-semibold text-lg/6">Reports</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              View and export completed transaction reports
            </p>
          </div>
          <Button intent="primary" onPress={() => setExportDialogOpen(true)}>
            <div className="flex items-center gap-2">
              <IconFileDownload className="size-4" />
              Export
            </div>
          </Button>
        </div>
        <div className="flex justify-end items-center py-4">
          <div className="max-w-lg w-full">
            <SearchField aria-label="Search" className={"w-full"}>
              <SearchInput
                placeholder="Search by order number, customer name or email..."
                className={"w-full"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchField>
          </div>
        </div>
        <ReportsTable
          orders={orderData as Order[]}
          pagination={pagination}
          onSort={handleSort}
          sortDescriptor={sortDescriptor}
        />
      </div>

      <ExportDialog
        isOpen={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
    </>
  );
}

ReportsIndex.layout = (page: any) => (
  <DashboardLayout
    children={page}
    breadcrumbItems={[
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Reports",
        href: "/dashboard/reports",
      },
    ]}
  />
);
