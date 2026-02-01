import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransactionStatusBanner } from "@/pages/transactions/components/transaction-status-banner";
import { PaymentProofForm } from "@/pages/transactions/components/payment-proof-form";
import { OrderItemCard } from "@/pages/transactions/components/order-item-card";
import {
  ShoppingBagIcon,
  MapPinIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/20/solid";
import type { SharedData } from "@/types/shared";
import type { TransactionDetail } from "@/types/transaction";
import { toast } from "sonner";

interface TransactionDetailProps extends SharedData {
  order: TransactionDetail;
}

export default function TransactionDetailSection() {
  const { order } = usePage<TransactionDetailProps>().props;
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.order_number);
      toast.success("Order number copied to clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      const textArea = document.createElement("textarea");
      textArea.value = order.order_number;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Order number copied to clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
        toast.error("Failed to copy order number");
      }
      document.body.removeChild(textArea);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        label: string;
        intent: "primary" | "success" | "warning" | "danger" | "secondary";
      }
    > = {
      pending_payment: { label: "Pending Payment", intent: "warning" },
      payment_verification: { label: "Verifying Payment", intent: "primary" },
      processing: { label: "Processing", intent: "primary" },
      shipped: { label: "Shipped", intent: "primary" },
      completed: { label: "Completed", intent: "success" },
      cancelled: { label: "Cancelled", intent: "danger" },
    };

    const config = statusConfig[status] || {
      label: status,
      intent: "secondary" as const,
    };
    return <Badge intent={config.intent}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head title={`Transaction ${order.order_number}`} />
      <div className="py-8">
        <div className="container mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                <div className="flex items-center gap-2">
                  <p>#{order.order_number}</p>
                  <Button
                    intent="plain"
                    onPress={handleCopyOrderNumber}
                    className="text-neutral-500 hover:text-neutral-900"
                  >
                    {copied ? (
                      <CheckIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ClipboardIcon className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </h1>
              <p className="text-neutral-600 mt-1">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="text-right">{getStatusBadge(order.status)}</div>
          </div>

          <TransactionStatusBanner
            status={order.status}
            isAwaitingVerification={order.is_awaiting_verification}
            paymentVerifiedAt={order.payment_verified_at}
            cancellationReason={order.cancellation_reason}
            formatDate={formatDate}
          />

          <Accordion
            defaultExpandedKeys={["items"]}
            className="grid grid-cols-12 gap-6"
            allowsMultipleExpanded
          >
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <Accordion.Item id="items">
                <Accordion.Trigger>
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="h-5 w-5" />
                    <span>Order Items ({order.items.length})</span>
                  </div>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div className="space-y-4 py-4">
                    {order.items.map((item) => (
                      <OrderItemCard
                        key={item.id}
                        item={item}
                        formatCurrency={formatCurrency}
                      />
                    ))}

                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between  dark:text-neutral-300">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between  dark:text-neutral-300">
                        <span>
                          Shipping Cost
                          {order.shipping_name && (
                            <span className="text-xs text-neutral-500 ml-1">
                              ({order.shipping_name})
                            </span>
                          )}
                        </span>
                        <span>{formatCurrency(order.shipping_cost)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-neutral-100 pt-2 border-t">
                        <span>Total</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item id="shipping">
                <Accordion.Trigger>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    <span>Shipping Address</span>
                  </div>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div className="space-y-2 py-4">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {order.shipping_address.recipient_name}
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {order.shipping_address.recipient_phone}
                      </p>
                    </div>
                    <div className="text-neutral-600 text-sm dark:text-neutral-400">
                      <p>{order.shipping_address.full_address}</p>
                      <p>
                        {order.shipping_address.subdistrict_name &&
                          `${order.shipping_address.subdistrict_name}, `}
                        {order.shipping_address.city_name},{" "}
                        {order.shipping_address.province_name}
                      </p>
                      <p>{order.shipping_address.postal_code}</p>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item id="payment">
                <Accordion.Trigger>
                  <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5" />
                    <span>Payment Method</span>
                  </div>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div className="space-y-4 py-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">
                        Payment Method
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        {order.payment_method.name}
                      </p>
                    </div>

                    {(order.payment_method.account_holder ||
                      order.payment_method.account_number) && (
                      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 space-y-3">
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                          Transfer Details
                        </p>
                        {order.payment_method.account_holder && (
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">
                              Account Name
                            </p>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                              {order.payment_method.account_holder}
                            </p>
                          </div>
                        )}
                        {order.payment_method.account_number && (
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">
                              Account Number
                            </p>
                            <p className="text-base font-mono font-bold text-neutral-900 tracking-wider ">
                              {order.payment_method.account_number}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-2">
                        Amount to Pay
                      </p>
                      <p className="text-2xl font-bold text-amber-900">
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <p className="text-sm text-blue-900">
                        💡 Please transfer the <strong>exact amount</strong> to
                        the account above.
                      </p>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </div>

            {order.can_upload_payment && (
              <div className="col-span-12 lg:col-span-4">
                <PaymentProofForm
                  orderNumber={order.order_number}
                  orderTotal={order.total}
                  contactPhone={order.contact_phone}
                />
              </div>
            )}
          </Accordion>

          <div className="flex justify-between gap-4">
            <Link href="/store">
              <Button intent="secondary">Back to Store</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

TransactionDetailSection.layout = (page: any) => <AppLayout children={page} />;
