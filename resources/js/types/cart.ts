import type { Product } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface CartSummary {
  itemCount: number;
  totalItems: number;
  subtotal: number;
  discount?: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

export interface CartActions {
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  getCartSummary: () => CartSummary;
  validateCartStock: () => CartItem[];
}

export type CartStore = CartState & CartActions;
