import { Card } from "@/components/ui/card";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import type { OrderStatus } from "@/types/transaction";

interface TransactionStatusBannerProps {
  status: OrderStatus;
  isAwaitingVerification: boolean;
  paymentVerifiedAt: string | null;
  cancellationReason: string | null;
  formatDate: (date: string) => string;
}

export function TransactionStatusBanner({
  status,
  isAwaitingVerification,
  paymentVerifiedAt,
  cancellationReason,
  formatDate,
}: TransactionStatusBannerProps) {
  if (isAwaitingVerification) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <Card.Content>
          <div className="flex items-center gap-3">
            <ClockIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">
                Payment Verification in Progress
              </h3>
              <p className="text-sm text-blue-700">
                Your payment proof has been submitted and is being verified by
                our team. This usually takes 1-2 business days.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (paymentVerifiedAt) {
    return (
      <Card className="bg-green-50 border-green-200">
        <Card.Content>
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Payment Verified</h3>
              <p className="text-sm text-green-700">
                Your payment has been verified on{" "}
                {formatDate(paymentVerifiedAt)}. Your order is now being
                processed.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (status === "cancelled") {
    return (
      <Card className="bg-red-50 border-red-200">
        <Card.Content>
          <div>
            <h3 className="font-semibold text-red-900">Order Cancelled</h3>
            {cancellationReason && (
              <p className="text-sm text-red-700 mt-1">
                Reason: {cancellationReason}
              </p>
            )}
          </div>
        </Card.Content>
      </Card>
    );
  }

  return null;
}
