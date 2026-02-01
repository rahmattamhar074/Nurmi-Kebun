import { Head, usePage, router } from "@inertiajs/react";
import { CustomerTable } from "./components/customer-table";
import type { SharedData } from "@/types/shared";
import type { Customer } from "@/types/customer";
import DashboardLayout from "@/layouts/dashboard-layout";
import { convertLaravelPagination } from "@/lib/pagination";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { useState, useEffect } from "react";

interface PageProps extends SharedData {
  customers: any;
  filters?: Record<string, any>;
}

export default function CustomerIndex() {
  const { customers, filters = {} } = usePage<PageProps>().props;
  const { data: customerData, pagination } =
    convertLaravelPagination(customers);

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

  return (
    <>
      <Head title="Customers" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance font-semibold text-lg/6">Customers</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              View and manage your customer base
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-x-4 items-center py-4">
          <div className="max-w-lg w-full">
            <SearchField aria-label="Search" className={"w-full"}>
              <SearchInput
                placeholder="Search customers by name, email, or phone..."
                className={"w-full"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchField>
          </div>
        </div>
        <CustomerTable
          customers={customerData as Customer[]}
          pagination={pagination}
        />
      </div>
    </>
  );
}

CustomerIndex.layout = (page: any) => (
  <DashboardLayout
    children={page}
    breadcrumbItems={[
      {
        label: "Dashboard",
        href: "/",
      },
      {
        label: "Customers",
        href: "/dashboard/customers",
      },
    ]}
  />
);
