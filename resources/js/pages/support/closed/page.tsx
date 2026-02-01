import SupportLayout from "../support-layout";
import type { SupportTicket } from "@/types/support";
import { TicketCardList } from "../components/ticket-card-list";

interface ClosedProps {
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

const Closed = ({ tickets, pagination }: ClosedProps) => {
  return <TicketCardList tickets={tickets} />;
};

export default Closed;

Closed.layout = (page: any) => <SupportLayout>{page}</SupportLayout>;
