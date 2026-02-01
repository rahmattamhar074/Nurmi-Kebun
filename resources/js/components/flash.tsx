import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Toast } from "@/components/ui/toast";
import type { SharedData, ToastType } from "@/types/shared";

const toastMethods: Record<ToastType, (message: string) => void> = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
  loading: toast.loading,
  message: toast.message,
};

export function Flash() {
  const { flash } = usePage<SharedData>().props;
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (flash?.message && flash?.type) {
      // Prevent showing the same message twice
      const messageKey = `${flash.type}:${flash.message}`;
      if (lastMessageRef.current === messageKey) {
        return;
      }

      lastMessageRef.current = messageKey;
      const toastMethod = toastMethods[flash.type];
      if (toastMethod) {
        toastMethod(flash.message);
      } else {
        toast.info(flash.message);
      }
    }
  }, [flash?.message, flash?.type]);

  return <Toast position="top-right" />;
}
