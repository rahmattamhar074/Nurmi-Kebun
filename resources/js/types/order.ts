import type { Product } from "./product";
import type { User } from "./user";

export interface Order {
  id: number;
  order_number: string;
  user_id: string;
  status:
    | "pending_payment"
    | "payment_verification"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled";
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method_id: number | null;
  payment_method_name: string;
  payment_method_type: string;
  payment_account_number: string | null;
  payment_account_holder: string | null;
  payment_receipt: string | null;
  payment_receipt_url: string | null;
  sender_account_name: string | null;
  sender_account_number: string | null;
  payment_amount: number | null;
  payment_date: string | null;
  contact_phone: string | null;
  payment_uploaded_at: string | null;
  payment_verified_at: string | null;
  verified_by: string | null;
  user_address_id: number | null;
  shipping_name: string;
  recipient_name: string;
  recipient_phone: string;
  province_name: string;
  city_name: string;
  subdistrict_name: string | null;
  postal_code: string;
  full_address: string;
  tracking_number: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  completion_method: "manual" | "auto" | null;
  completed_by: number | null;
  customer_notes: string | null;
  admin_notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  cancelled_by: "customer" | "admin" | "system" | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items?: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
  has_reviews?: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_code: string;
  product_name: string;
  product_description: string | null;
  product_thumbnail: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CartItemDisplay {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  product_thumbnail: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CheckoutTotals {
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export interface OrderPagination {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
}
