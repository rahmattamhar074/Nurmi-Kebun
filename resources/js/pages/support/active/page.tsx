import SupportLayout from "../support-layout";
import type { SupportTicket } from "@/types/support";
import { TicketCardList } from "../components/ticket-card-list";

interface AwaitingAdminProps {
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

const AwaitingAdmin = ({ tickets, pagination }: AwaitingAdminProps) => {
  return <TicketCardList tickets={tickets} />;
};

export default AwaitingAdmin;

AwaitingAdmin.layout = (page: any) => <SupportLayout>{page}</SupportLayout>;
