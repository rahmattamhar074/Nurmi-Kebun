import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { CheckoutTotals } from "@/types/order";
import type { PaymentMethod } from "@/types/payment-method";
import type { UserAddress } from "@/pages/settings/addresses";
import type { SharedData } from "@/types/shared";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconCircleInfo,
  IconMap,
  IconSendFill,
  IconTruck,
} from "@intentui/icons";
import { CreditCardIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import ShippingAccordion from "./components/ShippingAccordion";
import PaymentAccordion from "./components/PaymentAccordion";
import AddressSelector from "./components/AddressSelector";

interface ShippingService {
  service_code: string;
  service_name: string;
  description: string;
  duration: string;
  price: number;
  type: string;
}

interface CourierGroup {
  courier_code: string;
  courier_name: string;
  services: ShippingService[];
}

interface PaymentPageProps extends SharedData {
  paymentMethods: PaymentMethod[];
  selectedAddress: UserAddress;
  allAddresses: UserAddress[];
  courierGroups: CourierGroup[];
  totals: CheckoutTotals;
  totalWeight: number;
  issues: string[];
}

export default function PaymentPage() {
  const {
    paymentMethods,
    selectedAddress,
    allAddresses,
    courierGroups,
    totals,
    totalWeight,
    issues,
  } = usePage<PaymentPageProps>().props;

  const [addressSelectorOpen, setAddressSelectorOpen] = useState(false);

  const [selectedShipping, setSelectedShipping] = useState<{
    courier_code: string;
    service: ShippingService;
  } | null>(null);

  const { data, setData, post, processing } = useForm({
    payment_method_id: null as number | null,
    user_address_id: selectedAddress?.id || null,
    shipping_service: selectedShipping?.service.service_code || null,
    shipping_cost: selectedShipping?.service.price || 0,
    customer_notes: "",
  });

  useEffect(() => {
    if (selectedAddress) {
      setData("user_address_id", selectedAddress.id);
    }
  }, [selectedAddress?.id]);

  const handleShippingSelect = (
    courierCode: string,
    service: ShippingService
  ) => {
    setSelectedShipping({ courier_code: courierCode, service });
    setData({
      ...data,
      shipping_service: `${courierCode}-${service.service_code}`,
      shipping_cost: service.price,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.payment_method_id) {
      toast.error("Please select a payment method");
      return;
    }

    if (!data.shipping_service) {
      toast.error("Please select a shipping method");
      return;
    }

    post("/checkout/process");
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const finalTotal = totals.subtotal + (selectedShipping?.service.price || 0);

  return (
    <>
      <Head title="Checkout - Payment & Shipping" />
      <div className="py-8">
        <div className="container">
          <div className="flex items-center gap-x-3 mb-2">
            <Link>
              <IconArrowLeft className="size-5" />
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100 ">
              Checkout
            </h1>
          </div>
          <p className="text-sm font-medium lg:text-base text-neutral-600 mb-8">
            Step 2 of 2: Select payment method and shipping
          </p>

          {issues && issues.length > 0 && (
            <div className="mb-6 border-yellow-200 bg-yellow-50 flex items-start gap-3 p-4 rounded-lg">
              <IconCircleInfo className="h-5 w-5 text-yellow-600" />
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

          <form
            onSubmit={handleSubmit}
            className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCardIcon className="size-4 lg:size-5 text-neutral-500" />
                    <h2 className="lg:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Payment Method
                    </h2>
                  </div>

                  {paymentMethods.length === 0 ? (
                    <p className="text-neutral-500 text-sm">
                      No payment methods available. Please contact support.
                    </p>
                  ) : (
                    <PaymentAccordion
                      paymentMethods={paymentMethods}
                      selectedMethodId={data.payment_method_id}
                      onMethodSelect={(methodId) =>
                        setData("payment_method_id", methodId)
                      }
                    />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-4">
                      <IconTruck className="h-5 w-5 text-neutral-500" />
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Shipping Method
                      </h2>
                    </div>
                    <p className="text-xs text-neutral-500 mb-3">
                      Total weight: {(totalWeight / 1000).toFixed(2)} kg
                    </p>
                  </div>

                  {courierGroups.length === 0 ? (
                    <div className="text-center py-4 border border-red-200 bg-red-50 rounded-lg">
                      <p className="text-red-600 text-sm">
                        Unable to fetch shipping costs. Please try again later
                        or contact support.
                      </p>
                    </div>
                  ) : (
                    <ShippingAccordion
                      courierGroups={courierGroups}
                      selectedService={
                        selectedShipping
                          ? {
                              courier_code: selectedShipping.courier_code,
                              service_code:
                                selectedShipping.service.service_code,
                            }
                          : null
                      }
                      onServiceSelect={handleShippingSelect}
                      formatCurrency={formatCurrency}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <IconMap className="h-5 w-5 text-neutral-500" />
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Shipping Address
                      </h2>
                    </div>
                    {allAddresses.length > 1 && (
                      <Button
                        type="button"
                        intent="plain"
                        size="sm"
                        onPress={() => setAddressSelectorOpen(true)}
                      >
                        Change
                      </Button>
                    )}
                  </div>

                  {selectedAddress ? (
                    <div className="border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {selectedAddress.name}
                        </p>
                        {selectedAddress.is_default && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-900 dark:text-neutral-100 ">
                        {selectedAddress.recipient_name} -{" "}
                        {selectedAddress.phone}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {selectedAddress.full_address}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {selectedAddress.subdistrict_name &&
                          `${selectedAddress.subdistrict_name}, `}
                        {selectedAddress.city_name},{" "}
                        {selectedAddress.province_name}{" "}
                        {selectedAddress.postal_code}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-neutral-500 text-sm mb-4">
                        No default address found. Please add an address first.
                      </p>
                      <Link href="/settings/addresses">
                        <Button type="button" intent="secondary">
                          Add Address
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent>
                  <Label htmlFor="customer_notes" className="font-semibold">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="customer_notes"
                    value={data.customer_notes}
                    onChange={(e) => setData("customer_notes", e.target.value)}
                    placeholder="Any special instructions for your order..."
                    className="mt-2 min-h-32"
                  />
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>
                        Shipping (
                        {selectedShipping?.service.service_name ||
                          "Not selected"}
                        )
                      </span>
                      <span>
                        {formatCurrency(selectedShipping?.service.price || 0)}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        <span>Total</span>
                        <span>{formatCurrency(finalTotal)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="submit"
                  isDisabled={
                    processing ||
                    !data.payment_method_id ||
                    !data.shipping_service ||
                    courierGroups.length === 0
                  }
                  className={"flex items-center gap-x-2"}
                >
                  <div>
                    <IconSendFill className="size-4" />
                  </div>
                  {processing ? "Creating Order..." : "Create Order"}
                </Button>
              </div>
            </div>
          </form>

          <AddressSelector
            isOpen={addressSelectorOpen}
            onOpenChange={setAddressSelectorOpen}
            addresses={allAddresses}
            selectedAddressId={selectedAddress.id}
          />
        </div>
      </div>
    </>
  );
}

PaymentPage.layout = (page: any) => <AppLayout children={page} />;
