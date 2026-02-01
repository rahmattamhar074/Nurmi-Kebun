import type { Product } from "./product";

export interface Review {
  id: number;
  order_id: number;
  order_number: string;
  order_item_id: number;
  product_id: number;
  product_name: string;
  user_id: string;
  user_name: string;
  score: number; // 1-5
  review: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
}
