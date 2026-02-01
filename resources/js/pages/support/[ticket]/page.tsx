import type { SupportTicket } from "@/types/support";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { IconArrowLeft } from "@intentui/icons";
import TicketInfo from "../components/ticket-info";
import { MessageBubble } from "@/components/support/message-bubble";
import { TicketReplyForm } from "@/components/support/ticket-reply-form";

interface TicketDetailProps {
  ticket: SupportTicket;
}

const TicketDetail = ({ ticket }: TicketDetailProps) => {
  return (
    <div className="space-y-6 py-6 lg:py-0 lg:mt-8">
      <Link href={route("support.active")} className="block">
        <Button intent="outline" size="sm">
          <div className="text-fg">
            <IconArrowLeft className="size-4 mr-2" />
          </div>
          Back to Tickets
        </Button>
      </Link>
      <TicketInfo ticket={ticket} />
      <div className="flex flex-col gap-4 flex-1">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 lg:overflow-y-auto">
            <div className="space-y-4">
              {ticket.messages?.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  attachmentRoute="support.attachment"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex-shrink-0">
          <TicketReplyForm
            ticket={ticket}
            replyRoute="support.reply"
            userType="customer"
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

TicketDetail.layout = (page: any) => <AppLayout>{page}</AppLayout>;
