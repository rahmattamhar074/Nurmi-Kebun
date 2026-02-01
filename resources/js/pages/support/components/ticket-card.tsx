"use client";

import type { SupportTicket } from "@/types/support";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "date-fns";
import { Link } from "@inertiajs/react";
import { IconCircleInfo } from "@intentui/icons";

interface TicketCardProps {
  ticket: SupportTicket;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { label: "Active", intent: "warning" as const },
    resolved: { label: "Resolved", intent: "success" as const },
    closed: { label: "Closed", intent: "secondary" as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  return <Badge intent={config.intent}>{config.label}</Badge>;
};

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Card className="p-4 sm:p-6 bg-fg/5 dark:bg-fg/5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-sm font-semibold">
                {ticket.ticket_number}
              </span>
              {getStatusBadge(ticket.status)}
            </div>
            <h3 className="font-semibold text-lg line-clamp-2">
              {ticket.subject}
            </h3>
            <p className="text-sm text-muted-fg mt-1">
              {formatDate(new Date(ticket.created_at), "dd MMM yyyy, HH:mm")}
            </p>
          </div>
          <Link href={route("support.show", ticket.ticket_number)}>
            <Button size="sm">
              <div className="text-white">
                <IconCircleInfo />
              </div>
              Detail
            </Button>
          </Link>
        </div>

        {/* Ticket Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {ticket.order && (
            <div>
              <p className="text-xs text-muted-fg mb-1">Related Order</p>
              <p className="font-mono text-sm font-medium">
                {ticket.order.order_number}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-fg mb-1">Last Reply</p>
            <p className="text-sm">
              {ticket.last_reply_at
                ? formatDate(new Date(ticket.last_reply_at), "dd MMM, HH:mm")
                : "No replies yet"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
