import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { TruckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Link } from "../ui/link";

export function SameCityDeliveryBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { url } = usePage();

  const isCheckoutPage = url.startsWith("/checkout");

  if (isDismissed || !isCheckoutPage) {
    return null;
  }

  return (
    <div className="bg-green-50 border-b border-green-200 fixed inset-x-0 bottom-0 left-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <TruckIcon className="size-5 text-green-600 shrink-0" />
            <p className="text-sm text-green-800">
              <span className="font-medium">Ordering from Amuntai?</span> Please
              contact our admin directly for faster same-day delivery via local
              courier services.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="https://wa.me/6281348151616" target="_blank">
              <Button type="button" onClick={() => setIsDismissed(true)}>
                Contact Admin
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded hover:bg-green-100 text-green-600 transition-colors"
              aria-label="Dismiss"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
