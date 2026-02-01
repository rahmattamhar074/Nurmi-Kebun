import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { SupportTicket } from "@/types/support";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { Link, useForm } from "@inertiajs/react";
import { formatDate } from "date-fns";
import DynamicDialog from "@/components/modules/dynamic-dialog";

const TicketInfo = ({ ticket }: { ticket: SupportTicket }) => {
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const closeForm = useForm({});

  const handleCloseTicket = () => {
    closeForm.post(route("support.close", ticket.ticket_number), {
      onSuccess: () => {
        setIsCloseDialogOpen(false);
        setDialogKey((prev) => prev + 1);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", intent: "warning" as const },
      resolved: { label: "Resolved", intent: "success" as const },
      closed: { label: "Closed", intent: "secondary" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge intent={config.intent}>{config.label}</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col-reverse lg:flex-row gap-y-2 items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                {getStatusBadge(ticket.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-fg">
                <span className="font-mono">{ticket.ticket_number}</span>
                <span>•</span>
                <span>
                  Created{" "}
                  {formatDate(
                    new Date(ticket.created_at),
                    "dd MMM yyyy, HH:mm"
                  )}
                </span>
                {ticket.order && (
                  <>
                    <span>•</span>
                    <Link
                      href={route("my-orders.show", ticket.order.order_number)}
                      className="text-blue-600 hover:underline"
                    >
                      Order: {ticket.order.order_number}
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div>
              {ticket.status === "active" && (
                <Button
                  intent="outline"
                  size="sm"
                  onPress={() => setIsCloseDialogOpen(true)}
                >
                  <XCircleIcon className="size-4 mr-2" />
                  Close Ticket
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <span className="text-muted-fg">Last Reply:</span>
            <span className="ml-2 font-medium">
              {ticket.last_reply_at
                ? formatDate(
                    new Date(ticket.last_reply_at),
                    "dd MMM yyyy, HH:mm"
                  )
                : "No replies yet"}
            </span>
          </div>
        </CardContent>
      </Card>

      {isCloseDialogOpen && (
        <DynamicDialog
          key={dialogKey}
          isOpen={isCloseDialogOpen}
          onOpenChange={setIsCloseDialogOpen}
          title="Close Ticket"
          description="Are you sure you want to close this ticket? This action cannot be undone."
          size="md"
        >
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              intent="outline"
              onPress={() => setIsCloseDialogOpen(false)}
              isDisabled={closeForm.processing}
            >
              Cancel
            </Button>
            <Button
              intent="danger"
              onPress={handleCloseTicket}
              isDisabled={closeForm.processing}
            >
              {closeForm.processing ? "Closing..." : "Yes, Close Ticket"}
            </Button>
          </div>
        </DynamicDialog>
      )}
    </>
  );
};

export default TicketInfo;
