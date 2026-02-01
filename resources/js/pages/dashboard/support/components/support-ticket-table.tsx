import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { SupportTicket } from "@/types/support";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import { EyeIcon } from "@heroicons/react/20/solid";

interface SupportTicketTableProps {
  tickets: SupportTicket[];
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
}

export function SupportTicketTable({
  tickets,
  pagination,
}: SupportTicketTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", intent: "warning" as const },
      resolved: { label: "Resolved", intent: "success" as const },
      closed: { label: "Closed", intent: "secondary" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge intent={config?.intent || "secondary"}>
        {config?.label || status}
      </Badge>
    );
  };

  const columns: Column<SupportTicket>[] = [
    {
      key: "ticket_number",
      label: "Ticket #",
      sortable: true,
      width: 150,
      render: (_value, ticket) => (
        <div className="font-mono text-sm font-medium text-neutral-900 dark:text-white">
          {ticket.ticket_number}
        </div>
      ),
    },
    {
      key: "user",
      label: "Customer",
      sortable: false,
      width: 200,
      render: (_value, ticket) => (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-900 dark:text-white">
            {ticket.user?.name || "Unknown"}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {ticket.user?.email || ""}
          </span>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      sortable: false,
      width: 300,
      render: (_value, ticket) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-neutral-900 dark:text-white line-clamp-1">
            {ticket.subject}
          </span>
          {ticket.order_id && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Order: {ticket.order?.order_number}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      width: 160,
      className: "text-center",
      render: (_value, ticket) => getStatusBadge(ticket.status),
    },
    {
      key: "last_reply_at",
      label: "Last Reply",
      sortable: true,
      width: 180,
      render: (value) => (
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {value ? formatDate(new Date(value), "dd MMM yyyy, HH:mm") : "-"}
        </div>
      ),
    },
    {
      key: "actions",
      label: <div className="text-center font-medium">Actions</div>,
      width: 100,
      className: "text-center",
      render: (_value, ticket) => (
        <div className="w-fit mx-auto">
          <Button
            size="sm"
            intent="outline"
            onPress={() =>
              router.visit(
                route("dashboard.support.show", ticket.ticket_number)
              )
            }
          >
            <div className="flex items-center gap-2">
              <EyeIcon className="size-4" />
              Detail
            </div>
          </Button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    router.get(
      route("dashboard.support.index"),
      { page },
      { preserveState: true, preserveScroll: true }
    );
  };

  return (
    <Datatable
      data={tickets}
      columns={columns}
      pagination={pagination}
      onPageChange={handlePageChange}
      emptyMessage="No support tickets found."
      striped
    />
  );
}
