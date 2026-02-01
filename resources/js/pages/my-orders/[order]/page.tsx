import type React from "react";
import type { Order } from "@/types/order";
import type { Review } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import OrderDetailLayout from "./order-detail-layout";
import AppLayout from "@/layouts/app-layout";
import { ConfirmCompleteTrigger } from "./components/confirm-complete-trigger";
import { ReviewTrigger } from "./components/review-trigger";
import { MyReviewContent } from "./components/my-review-content";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

interface OrderDetailProps {
  order: Order;
  reviews?: Review[];
}

const OrderDetail = ({ order, reviews = [] }: OrderDetailProps) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const orderItemsContent = (
    <Card>
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
            >
              {item.product_thumbnail && (
                <img
                  src={item.product_thumbnail}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{item.product_name}</h3>
                <p className="text-sm text-muted-fg">{item.product_code}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-fg">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const shippingInfoContent = (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-fg">Recipient</p>
            <p className="font-medium">{order.recipient_name}</p>
            <p className="text-sm">{order.recipient_phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-fg">Address</p>
            <p className="text-sm">{order.full_address}</p>
            <p className="text-sm">
              {order.subdistrict_name}, {order.city_name}
            </p>
            <p className="text-sm">
              {order.province_name} {order.postal_code}
            </p>
          </div>
          {order.tracking_number && (
            <div>
              <p className="text-sm text-muted-fg">Tracking Number</p>
              <p className="font-mono font-bold">{order.tracking_number}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const paymentInfoContent = (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-fg">Payment Method</p>
            <p className="font-medium">{order.payment_method_name}</p>
          </div>
          {order.payment_account_number && (
            <div>
              <p className="text-sm text-muted-fg">Account Number</p>
              <p className="font-mono text-sm">
                {order.payment_account_number}
              </p>
            </div>
          )}
          {order.payment_account_holder && (
            <div>
              <p className="text-sm text-muted-fg">Account Holder</p>
              <p className="text-sm">{order.payment_account_holder}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const cancellationInfoContent =
    order.status === "cancelled" ? (
      <Card>
        <CardHeader>
          <CardTitle>Cancellation Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.cancelled_at && (
              <div>
                <p className="text-sm text-muted-fg">Cancelled On</p>
                <p className="font-medium">
                  {new Date(order.cancelled_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
            {order.cancelled_by && (
              <div>
                <p className="text-sm text-muted-fg">Cancelled By</p>
                <p className="font-medium capitalize">{order.cancelled_by}</p>
              </div>
            )}
            {order.cancellation_reason && (
              <div>
                <p className="text-sm text-muted-fg">Reason</p>
                <p className="text-sm">{order.cancellation_reason}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ) : null;

  const orderSummaryContent = (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-fg">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-fg">Shipping</span>
            <span>{formatPrice(order.shipping_cost)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const myReviewContent = <MyReviewContent reviews={reviews} />;

  const renderActions = () => {
    const actions = [];

    if (["processing", "shipped", "completed"].includes(order.status)) {
      actions.push(
        <a
          key="invoice"
          href={route("my-orders.invoice", order.order_number)}
          download
        >
          <Button intent="outline" className="flex items-center gap-2">
            <DocumentArrowDownIcon className="w-5 h-5" />
            Download Invoice
          </Button>
        </a>
      );
    }

    if (order.status === "pending_payment") {
      actions.push(
        <Link
          key="payment"
          href={route("transactions.show", order.order_number)}
        >
          <Button>Upload Payment Proof</Button>
        </Link>
      );
    }

    if (order.status === "shipped") {
      actions.push(
        <ConfirmCompleteTrigger
          key="complete"
          orderNumber={order.order_number}
          trackingNumber={order.tracking_number || undefined}
        />
      );
    }

    if (order.status === "completed" && order.items && !order.has_reviews) {
      actions.push(
        <ReviewTrigger
          key="review"
          orderNumber={order.order_number}
          orderItems={order.items}
        />
      );
    }

    return actions.length > 0 ? <>{actions}</> : null;
  };

  return (
    <OrderDetailLayout
      order={order}
      actions={renderActions()}
      children={{
        orderItems: orderItemsContent,
        shippingInfo: shippingInfoContent,
        paymentInfo: paymentInfoContent,
        cancellationInfo: cancellationInfoContent,
        orderSummary: orderSummaryContent,
        myReview: myReviewContent,
      }}
    />
  );
};

OrderDetail.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default OrderDetail;
