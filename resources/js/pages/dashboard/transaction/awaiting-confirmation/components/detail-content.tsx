"use client";

import type { Order } from "@/types/order";
import {
  OrderInformation,
  PaymentMethodInfo,
  OrderItemsList,
} from "../../components";
import { formatDate } from "date-fns";
import {
  DocumentArrowDownIcon,
  PhotoIcon,
  UserIcon,
  BanknotesIcon,
  CalendarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

interface DetailContentProps {
  order: Order;
}

export function DetailContent({ order }: DetailContentProps) {
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isImageFile = (filename: string | null): boolean => {
    if (!filename) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (filename: string | null): boolean => {
    if (!filename) return false;
    return filename.toLowerCase().endsWith(".pdf");
  };

  const handlePaymentProofClick = () => {
    if (isImageFile(order.payment_receipt)) {
      setImagePreviewOpen(true);
    } else if (isPdfFile(order.payment_receipt)) {
      window.open(order.payment_receipt_url || "", "_blank");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-2 gap-6">
        <OrderInformation
          orderNumber={order.order_number}
          status={order.status}
          user={order.user}
          createdAt={order.created_at}
          shippingService={order.shipping_name}
        />
        <PaymentMethodInfo
          paymentMethodName={order.payment_method_name}
          paymentMethodType={order.payment_method_type}
          accountNumber={order.payment_account_number}
          accountHolder={order.payment_account_holder}
        />
      </div>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <PhotoIcon className="size-5 text-neutral-500" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Payment Proof
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <UserIcon className="size-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Sender Name
                </p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {order.sender_account_name || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCardIcon className="size-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Sender Account Number
                </p>
                <p className="font-medium font-mono text-neutral-900 dark:text-white">
                  {order.sender_account_number || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BanknotesIcon className="size-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Payment Amount
                </p>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {order.payment_amount
                    ? formatPrice(order.payment_amount)
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarIcon className="size-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Payment Date
                </p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {order.payment_date
                    ? formatDate(new Date(order.payment_date), "dd MMM yyyy")
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {order.payment_receipt && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                Payment Receipt
              </p>
              {isImageFile(order.payment_receipt) ? (
                <button
                  type="button"
                  className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handlePaymentProofClick}
                >
                  <img
                    src={order.payment_receipt_url || ""}
                    alt="Payment proof"
                    className="w-full h-64 object-contain bg-neutral-50 dark:bg-neutral-800"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                    <PhotoIcon className="size-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ) : isPdfFile(order.payment_receipt) ? (
                <button
                  type="button"
                  onClick={handlePaymentProofClick}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors w-full"
                >
                  <DocumentArrowDownIcon className="size-5 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    Download Payment Receipt (PDF)
                  </span>
                </button>
              ) : (
                <a
                  href={order.payment_receipt_url || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors w-full"
                >
                  <DocumentArrowDownIcon className="size-5 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    View Payment Receipt
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <OrderItemsList
        items={order.items}
        subtotal={order.subtotal}
        shippingCost={order.shipping_cost}
        total={order.total}
      />

      {isImageFile(order.payment_receipt) && (
        <Modal isOpen={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
          <ModalContent size="5xl" className="sm:max-w-4xl">
            <ModalHeader>
              <ModalTitle>Payment Proof - {order.order_number}</ModalTitle>
            </ModalHeader>
            <ModalBody className="mb-4">
              <img
                src={order.payment_receipt_url || ""}
                alt="Payment proof"
                className="w-full h-auto rounded-lg"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
