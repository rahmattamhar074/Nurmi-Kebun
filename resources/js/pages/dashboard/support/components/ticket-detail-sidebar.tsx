import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "date-fns";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import type { SupportTicket } from "@/types/support";
import { Link } from "@inertiajs/react";

interface TicketDetailSidebarProps {
  ticket: SupportTicket;
}

export function TicketDetailSidebar({ ticket }: TicketDetailSidebarProps) {
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [resolveDialogKey, setResolveDialogKey] = useState(0);
  const [closeDialogKey, setCloseDialogKey] = useState(0);

  const resolveForm = useForm({});
  const closeForm = useForm({});

  const handleResolve = () => {
    resolveForm.post(route("dashboard.support.resolve", ticket.ticket_number), {
      onSuccess: () => {
        setIsResolveDialogOpen(false);
        setResolveDialogKey((prev) => prev + 1);
      },
    });
  };

  const handleClose = () => {
    closeForm.post(route("dashboard.support.close", ticket.ticket_number), {
      onSuccess: () => {
        setIsCloseDialogOpen(false);
        setCloseDialogKey((prev) => prev + 1);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", intent: "primary" as const },
      resolved: { label: "Resolved", intent: "success" as const },
      closed: { label: "Closed", intent: "secondary" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      intent: "secondary" as const,
    };

    return <Badge intent={config.intent}>{config.label}</Badge>;
  };

  const messageCount = ticket.messages?.length || 0;
  const lastReplyTime = ticket.last_reply_at
    ? formatDate(new Date(ticket.last_reply_at), "dd MMM yyyy, HH:mm")
    : "No replies yet";

  return (
    <>
      <Card className="bg-fg/5 dark:bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-sm text-muted-fg">Ticket Number</span>
              <p className="font-mono text-sm">{ticket.ticket_number}</p>
            </div>

            <div className="space-y-1">
              <span className="text-sm text-muted-fg flex items-center gap-2">
                Customer
              </span>
              <p className="text-sm font-medium">{ticket.user?.name}</p>
              <p className="text-xs text-muted-fg">{ticket.user?.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-sm text-muted-fg flex items-center gap-2">
                Created
              </span>
              <p className="text-sm">
                {formatDate(new Date(ticket.created_at), "dd MMM yyyy, HH:mm")}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-sm text-muted-fg flex items-center gap-2">
                Last Reply
              </span>
              <p className="text-sm">{lastReplyTime}</p>
              {ticket.last_reply_by && (
                <p className="text-xs text-muted-fg">
                  by{" "}
                  {ticket.last_reply_by === "admin"
                    ? "Support Team"
                    : "Customer"}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-sm text-muted-fg">Total Messages</span>
              <p className="text-sm font-medium">{messageCount}</p>
            </div>

            {ticket.order && (
              <div className="space-y-1">
                <span className="text-sm text-muted-fg flex items-center gap-2">
                  <ShoppingBagIcon className="size-4" />
                  Related Order
                </span>
                <Link
                  href={route(
                    "dashboard.transactions.show",
                    ticket.order.order_number
                  )}
                  className="text-sm text-primary hover:underline"
                >
                  {ticket.order.order_number}
                </Link>
              </div>
            )}

            {ticket.status === "resolved" && ticket.resolved_at && (
              <div className="space-y-1 pt-2 border-t">
                <span className="text-sm text-muted-fg">Resolved On</span>
                <p className="text-sm">
                  {formatDate(
                    new Date(ticket.resolved_at),
                    "dd MMM yyyy, HH:mm"
                  )}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {ticket.status === "active" && (
          <CardFooter className="flex justify-end gap-2">
            <Button
              intent="danger"
              size="sm"
              onPress={() => setIsCloseDialogOpen(true)}
            >
              <XCircleIcon className="size-4 mr-2" />
              Close Ticket
            </Button>
            <Button
              intent="primary"
              size="sm"
              onPress={() => setIsResolveDialogOpen(true)}
            >
              <CheckCircleIcon className="size-4 mr-2" />
              Mark as Resolved
            </Button>
          </CardFooter>
        )}
      </Card>

      {isResolveDialogOpen && (
        <DynamicDialog
          key={resolveDialogKey}
          isOpen={isResolveDialogOpen}
          onOpenChange={setIsResolveDialogOpen}
          title="Mark Ticket as Resolved"
          description="Are you sure you want to mark this ticket as resolved? This indicates the issue has been successfully addressed."
        >
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              intent="outline"
              onPress={() => setIsResolveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              intent="primary"
              onPress={handleResolve}
              isDisabled={resolveForm.processing}
            >
              {resolveForm.processing
                ? "Resolving..."
                : "Yes, Mark as Resolved"}
            </Button>
          </div>
        </DynamicDialog>
      )}

      {isCloseDialogOpen && (
        <DynamicDialog
          key={closeDialogKey}
          isOpen={isCloseDialogOpen}
          onOpenChange={setIsCloseDialogOpen}
          title="Close Ticket"
          description="Are you sure you want to close this ticket? This action will prevent further replies from both parties."
        >
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              intent="outline"
              onPress={() => setIsCloseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              intent="danger"
              onPress={handleClose}
              isDisabled={closeForm.processing}
            >
              {closeForm.processing ? "Closing..." : "Yes, Close Ticket"}
            </Button>
          </div>
        </DynamicDialog>
      )}
    </>
  );
}
