import type { Order } from "@/types/order";
import type { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import {
  UserIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "sonner";

interface OrderInformationProps {
  orderNumber: string;
  status: Order["status"];
  user?: User;
  createdAt: string;
  trackingNumber?: string | null;
  shippingService?: string | null;
}

export function OrderInformation({
  orderNumber,
  status,
  user,
  createdAt,
  trackingNumber,
  shippingService,
}: OrderInformationProps) {
  const [copied, setCopied] = useState(false);
  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending_payment: {
        label: "Awaiting Payment",
        intent: "warning" as const,
      },
      payment_verification: {
        label: "Awaiting Confirmation",
        intent: "info" as const,
      },
      processing: { label: "Processing", intent: "primary" as const },
      shipped: { label: "Shipped", intent: "info" as const },
      completed: { label: "Completed", intent: "success" as const },
      cancelled: { label: "Cancelled", intent: "danger" as const },
    };

    const config = statusConfig[status];
    return <Badge intent={config.intent}>{config.label}</Badge>;
  };

  const handleCopyTracking = async () => {
    if (!trackingNumber) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(trackingNumber);
        setCopied(true);
        toast.success("Tracking number copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = trackingNumber;

        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        textArea.setAttribute("readonly", "");

        document.body.appendChild(textArea);

        if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
          const range = document.createRange();
          range.selectNodeContents(textArea);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
          textArea.setSelectionRange(0, 999999);
        } else {
          textArea.select();
        }

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          toast.success("Tracking number copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error("Copy command failed");
        }
      }
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error(
        "Failed to copy. Please select and copy manually: " + trackingNumber
      );
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <UserIcon className="size-5 text-neutral-500" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Order Information
        </h3>
      </div>
      <div className="space-y-3 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Order Number
          </p>
          <p className="font-mono font-medium text-neutral-900 dark:text-white">
            {orderNumber}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Status
          </p>
          <div className="mt-1">{getStatusBadge(status)}</div>
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Customer Name
          </p>
          <p className="font-medium text-neutral-900 dark:text-white">
            {user?.name || "Unknown"}
          </p>
          {user?.email && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {user.email}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Order Date
          </p>
          <p className="font-medium text-neutral-900 dark:text-white">
            {formatDate(new Date(createdAt), "dd MMM yyyy, HH:mm")}
          </p>
        </div>
        {trackingNumber && (
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Tracking Number
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge intent="info" className="font-mono font-medium">
                {trackingNumber}
              </Badge>
              <button
                type="button"
                onClick={handleCopyTracking}
                className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Copy tracking number"
              >
                {copied ? (
                  <CheckIcon className="size-4 text-green-500" />
                ) : (
                  <ClipboardDocumentIcon className="size-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>
        )}
        {shippingService && (
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Shipping Service
            </p>
            <div className="mt-1">
              <Badge intent="primary" className="font-medium">
                {shippingService}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
