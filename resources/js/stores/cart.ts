import { create } from "zustand";
import type { CartStore, CartItem, CartSummary } from "@/types/cart";
import type { Product } from "@/types/product";
import { toast } from "sonner";

const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isLoading: false,

  /**
   * Fetch cart from server
   */
  fetchCart: async () => {
    set({ isLoading: true });

    try {
      const response = await fetch("/api/cart", {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load cart");
      }

      const data = await response.json();
      const serverCart = data.cart;

      if (serverCart && Array.isArray(serverCart.items)) {
        const serverItems = serverCart.items.map((item: any) => ({
          id: `${item.product.id}`,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          addedAt: new Date(item.created_at || Date.now()),
        }));

        set({ items: serverItems, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  /**
   * Add item to cart with optimistic update
   */
  addItem: async (product: Product, quantity = 1) => {
    const state = get();
    const existingItemIndex = state.items.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      const existingItem = state.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return;
      }
    } else {
      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return;
      }
    }

    let optimisticItems: CartItem[];
    if (existingItemIndex >= 0) {
      const existingItem = state.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      optimisticItems = [...state.items];
      optimisticItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
      };
    } else {
      const cartItem: CartItem = {
        id: `${product.id}`,
        product,
        quantity,
        price: product.price,
        addedAt: new Date(),
      };
      optimisticItems = [...state.items, cartItem];
    }

    set({ items: optimisticItems });

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
          price: product.price,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      await get().fetchCart();
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      set({ items: state.items });
      toast.error(
        error instanceof Error ? error.message : "Failed to add item to cart"
      );
      console.error("Add to cart error:", error);
    }
  },

  /**
   * Remove item from cart with optimistic update
   */
  removeItem: async (itemId: string) => {
    const state = get();
    const item = state.items.find((item) => item.id === itemId);

    if (!item) return;

    const optimisticItems = state.items.filter((item) => item.id !== itemId);
    set({ items: optimisticItems });

    try {
      const response = await fetch(`/api/cart/${item.product.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      toast.success(`Removed ${item.product.name} from cart`);
    } catch (error) {
      set({ items: state.items });
      toast.error("Failed to remove item from cart");
    }
  },

  /**
   * Update item quantity with optimistic update
   */
  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const state = get();
    const item = state.items.find((item) => item.id === itemId);

    if (!item) return;

    if (quantity > item.product.stock) {
      toast.error(`Only ${item.product.stock} items available in stock`);
      return;
    }

    const optimisticItems = state.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    set({ items: optimisticItems });

    try {
      const response = await fetch(`/api/cart/${item.product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update quantity");
      }
    } catch (error) {
      set({ items: state.items });
      toast.error("Failed to update quantity");
      console.error("Update quantity error:", error);
    }
  },

  /**
   * Clear entire cart
   */
  clearCart: async () => {
    const state = get();

    set({ items: [] });

    try {
      const response = await fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      toast.success("Cart cleared");
    } catch (error) {
      set({ items: state.items });
      toast.error("Failed to clear cart");
      console.error("Clear cart error:", error);
    }
  },

  /**
   * Validate cart items against current stock
   */
  validateCartStock: () => {
    const state = get();
    let hasChanges = false;
    const validatedItems = state.items
      .map((item) => {
        if (item.quantity > item.product.stock) {
          hasChanges = true;
          if (item.product.stock === 0) {
            toast.error(
              `${item.product.name} is out of stock and has been removed from cart`
            );
            return null;
          } else {
            toast.warning(
              `${item.product.name} quantity adjusted to available stock (${item.product.stock})`
            );
            return { ...item, quantity: item.product.stock };
          }
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    if (hasChanges) {
      set({ items: validatedItems });
    }

    return validatedItems;
  },

  /**
   * Get cart summary with computed values
   */
  getCartSummary: (): CartSummary => {
    const items = get().items;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal;

    return {
      itemCount: items.length,
      totalItems,
      subtotal,
      total,
    };
  },
}));

export const useCart = () => {
  const store = useCartStore();
  const summary = store.getCartSummary();

  return {
    ...store,
    summary,
  };
};

export const useCartItem = (productId: number) => {
  return useCartStore((state) =>
    state.items.find((item) => item.product.id === productId)
  );
};

export const useCartCount = () => {
  return useCartStore((state) => state.items.length);
};

export default useCartStore;
