"use client";

import type { SupportTicket } from "@/types/support";
import { TicketCard } from "./ticket-card";

interface TicketCardListProps {
  tickets: SupportTicket[];
}

export function TicketCardList({ tickets }: TicketCardListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-fg">No tickets found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
