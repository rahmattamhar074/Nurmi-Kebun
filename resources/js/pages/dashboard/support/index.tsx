import { Head, usePage, router } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";
import type { SupportTicket } from "@/types/support";
import DashboardLayout from "@/layouts/dashboard-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { useState, useEffect } from "react";
import { IconChevronDown } from "@intentui/icons";
import { SupportTicketTable } from "./components/support-ticket-table";

interface PageProps extends SharedData {
  tickets: SupportTicket[];
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  filters?: {
    status?: string;
    search?: string;
  };
}

const statusOptions = [
  { id: "all", name: "All Tickets" },
  { id: "active", name: "Active" },
  { id: "resolved", name: "Resolved" },
  { id: "closed", name: "Closed" },
];

export default function SupportIndex() {
  const { tickets, pagination, filters = {} } = usePage<PageProps>().props;

  const [status, setStatus] = useState<string>(filters.status || "");
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

  const handleStatusChange = (value: React.Key | null) => {
    const newValue = value?.toString() || "";
    setStatus(newValue);
    handleFilterChange({ status: newValue || undefined });
  };

  return (
    <>
      <Head title="Support Tickets" />

      <div className="space-y-6">
        <div>
          <h1 className="text-balance font-semibold text-lg/6">
            Support Tickets
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage customer support requests and inquiries
          </p>
        </div>

        <div className="flex justify-end gap-x-4 items-center py-4">
          <div className="min-w-48">
            <Select value={status} onChange={handleStatusChange}>
              <SelectTrigger className="flex justify-between items-center w-full">
                {status
                  ? statusOptions.find((option) => option.id === status)
                      ?.name || "All Tickets"
                  : "All Tickets"}
                <IconChevronDown className="group-open/select:rotate-180 transition-transform" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.id} id={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="max-w-lg w-full">
            <SearchField aria-label="Search" className={"w-full"}>
              <SearchInput
                placeholder="Search by ticket #, subject, or customer..."
                className={"w-full"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchField>
          </div>
        </div>

        <SupportTicketTable tickets={tickets} pagination={pagination} />
      </div>
    </>
  );
}

SupportIndex.layout = (page: any) => (
  <DashboardLayout
    breadcrumbItems={[
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Support Tickets",
        href: "/dashboard/support",
      },
    ]}
  >
    {page}
  </DashboardLayout>
);
