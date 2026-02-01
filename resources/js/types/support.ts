import type { User } from "./user";
import type { Order } from "./order";

export interface SupportTicket {
  id: number;
  ticket_number: string;
  user_id: string;
  order_id?: string | null;
  subject: string;
  status: "active" | "resolved" | "closed";
  last_reply_at: string | null;
  last_reply_by: "customer" | "admin" | null;
  resolved_at?: string | null;
  resolved_by?: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  order?: Order;
  messages?: SupportMessage[];
  unread_count?: number;
  can_customer_reply?: boolean;
  status_label?: string;
}

export interface SupportMessage {
  id: number;
  ticket_id: number;
  user_id: string;
  message: string;
  attachment_path?: string | null;
  attachment_name?: string | null;
  attachment_size?: number | null;
  attachment_url?: string;
  formatted_attachment_size?: string;
  is_admin_reply: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
}
