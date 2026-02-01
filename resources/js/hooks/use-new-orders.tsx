import { useEffect, useState } from "react";
import echo from "@/lib/echo";

const STORAGE_KEY = "new_orders_count";

interface OrderPaidEvent {
  order_id: number;
  order_number: string;
  customer_name: string;
  total: number;
  payment_uploaded_at: string;
}

export function useNewOrders() {
  const [count, setCount] = useState<number>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  useEffect(() => {
    // Listen for new order events
    const channel = echo.channel("admin-notifications");

    channel.listen(".order.paid", (event: OrderPaidEvent) => {
      // Play notification sound
      const audio = new Audio("/assets/sound/kaching.mp3");
      audio.play().catch((err) => console.log("Audio play failed:", err));

      setCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem(STORAGE_KEY, newCount.toString());
        return newCount;
      });
    });

    // Cleanup on unmount
    return () => {
      channel.stopListening(".order.paid");
    };
  }, []);

  const reset = () => {
    setCount(0);
    localStorage.setItem(STORAGE_KEY, "0");
  };

  const increment = () => {
    setCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem(STORAGE_KEY, newCount.toString());
      return newCount;
    });
  };

  return { count, reset, increment };
}
