import SupportLayout from "../support-layout";
import type { SupportTicket } from "@/types/support";
import { TicketCardList } from "../components/ticket-card-list";

interface ResolvedProps {
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

const Resolved = ({ tickets, pagination }: ResolvedProps) => {
  return <TicketCardList tickets={tickets} />;
};

export default Resolved;

Resolved.layout = (page: any) => <SupportLayout>{page}</SupportLayout>;
