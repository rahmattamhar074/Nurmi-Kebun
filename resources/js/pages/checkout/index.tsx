import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CartItemDisplay, CheckoutTotals } from "@/types/order";
import type { SharedData } from "@/types/shared";
import {
  IconArrowLeft,
  IconCircleInfo,
  IconCircleInfoFill,
  IconShoppingBag,
} from "@intentui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CheckoutIndexProps extends SharedData {
  cartItems: CartItemDisplay[];
  totals: CheckoutTotals | null;
  issues: string[];
}

export default function CheckoutIndex() {
  const { cartItems, totals, issues } = usePage<CheckoutIndexProps>().props;

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Head title="Checkout" />
        <div className="py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
              Checkout
            </h1>

            <Card className="py-12">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <IconShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
                  Add some products to your cart before proceeding to checkout
                </p>
                <Link href="/store">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Checkout - Review Cart" />
      <div className="py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Checkout
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Step 1 of 2: Review your cart
          </p>

          {issues && issues.length > 0 && (
            <div className="mb-6 border-yellow-200 bg-yellow-50 flex items-start gap-3 p-4">
              <IconCircleInfoFill className="h-5 w-5 text-yellow-600" />
              <div className="text-yellow-800">
                <p className="font-medium mb-2">
                  Some items in your cart have been updated:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <Card className="mb-6">
            <CardContent>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Cart Items
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
                <div className="flex justify-between  font-semibold">
                  <div className="flex items-center gap-x-2">
                    <span>Sub Total</span>
                    <Tooltip>
                      <TooltipTrigger aria-label="Pricing Info">
                        <IconCircleInfo />
                      </TooltipTrigger>
                      <TooltipContent>
                        Shipping cost will be calculated after address is set.
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <p className="text-xl font-semibold">
                    {totals
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(totals.subtotal)
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between gap-4">
            <Link href="/store">
              <Button intent="secondary">
                <div className={"flex items-center gap-x-2"}>
                  <IconArrowLeft className="h-4 w-4" />
                  Back
                </div>
              </Button>
            </Link>
            <Link href="/checkout/payment">
              <Button>Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

CheckoutIndex.layout = (page: any) => <AppLayout children={page} />;

const CartItem = ({ item }: { item: CartItemDisplay }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  return (
    <div className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
      {item.product_thumbnail && (
        <img
          src={item.product_thumbnail}
          alt={item.product_name}
          className="w-20 h-20 object-cover rounded-md"
        />
      )}
      <div className="flex-1">
        <h3 className="font-medium ">{item.product_name}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {item.product_code}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
          {formatCurrency(item.price)} × {item.quantity}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold ">{formatCurrency(item.subtotal)}</p>
      </div>
    </div>
  );
};
