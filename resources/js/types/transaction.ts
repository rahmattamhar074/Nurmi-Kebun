import type { Order, OrderItem } from "./order";

export type OrderStatus =
  | "pending_payment"
  | "payment_verification"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export interface ShippingAddress {
  name: string;
  recipient_name: string;
  recipient_phone: string;
  province_name: string;
  city_name: string;
  subdistrict_name: string | null;
  postal_code: string;
  full_address: string;
}

export interface TransactionDetail extends Order {
  items: OrderItem[];
  payment_method: {
    name: string;
    type: string;
    account_number: string | null;
    account_holder: string | null;
  };
  shipping_address: ShippingAddress;
  can_upload_payment: boolean;
  can_be_cancelled: boolean;
  is_awaiting_verification: boolean;
  cancelled_at: string | null;
  cancelled_by: "customer" | "admin" | "system" | null;
}

export interface PaymentProofFormData {
  payment_receipt: File | null;
  sender_account_name: string;
  sender_account_number: string;
  payment_amount: number;
  payment_date: string;
  contact_phone: string;
}
