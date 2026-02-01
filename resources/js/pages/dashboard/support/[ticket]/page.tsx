import DashboardLayout from "@/layouts/dashboard-layout";
import type { SupportTicket } from "@/types/support";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { IconArrowLeft } from "@intentui/icons";
import { MessageBubble } from "@/components/support/message-bubble";
import { TicketReplyForm } from "@/components/support/ticket-reply-form";
import { TicketDetailSidebar } from "../components/ticket-detail-sidebar";

interface TicketDetailProps {
  ticket: SupportTicket;
}

const TicketDetail = ({ ticket }: TicketDetailProps) => {
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

  return (
    <div className="space-y-6">
      <Link href="/dashboard/support" className="block">
        <div className={"flex items-center gap-x-2"}>
          <IconArrowLeft className="h-4 w-4" />
          Back to Tickets
        </div>
      </Link>
      <div className="space-y-3">
        <h2 className="text-3xl font-bold">{ticket.subject}</h2>
        <div className="flex items-center gap-x-2">
          {getStatusBadge(ticket.status)}{" "}
          <span className="font-mono">{ticket.ticket_number}</span>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6 relative items-start">
        <div className="col-span-9 flex flex-col gap-4 h-[calc(100vh-12rem)]">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {ticket.messages?.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    attachmentRoute="dashboard.support.attachment"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex-shrink-0">
            <TicketReplyForm
              ticket={ticket}
              replyRoute="dashboard.support.reply"
              userType="admin"
            />
          </div>
        </div>
        <div className="col-span-3">
          <TicketDetailSidebar ticket={ticket} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

TicketDetail.layout = (page: any) => (
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
      {
        label: "Ticket Detail",
        href: "#",
      },
    ]}
  >
    {page}
  </DashboardLayout>
);
