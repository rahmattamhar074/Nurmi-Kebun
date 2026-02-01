import { Badge } from "@/components/ui/badge";
import { CreditCardIcon } from "@heroicons/react/24/outline";

interface PaymentMethodInfoProps {
  paymentMethodName: string;
  paymentMethodType: string;
  accountNumber?: string | null;
  accountHolder?: string | null;
}

export function PaymentMethodInfo({
  paymentMethodName,
  paymentMethodType,
  accountNumber,
  accountHolder,
}: PaymentMethodInfoProps) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCardIcon className="size-5 text-neutral-500" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Payment Method
        </h3>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Payment Method
          </p>
          <p className="font-medium text-neutral-900 dark:text-white">
            {paymentMethodName}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Type</p>
          <Badge intent="secondary" className="mt-1">
            {paymentMethodType}
          </Badge>
        </div>
        {accountNumber && (
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Account Number
            </p>
            <p className="font-mono font-medium text-neutral-900 dark:text-white">
              {accountNumber}
            </p>
          </div>
        )}
        {accountHolder && (
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Account Holder
            </p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {accountHolder}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
