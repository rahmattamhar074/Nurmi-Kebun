import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function AddAddressBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { auth } = usePage<any>().props;

  // Don't show if:
  // - Dismissed
  // - Not logged in
  // - Email not verified
  // - Not a customer
  // - Already has addresses
  if (
    isDismissed ||
    !auth?.user ||
    !auth.user.email_verified_at ||
    auth.user.role !== "customer" ||
    auth.user.has_addresses
  ) {
    return null;
  }

  const handleAddAddress = () => {
    router.visit(route("settings.addresses.index"));
  };

  return (
    <div className="bg-blue-50 border-b border-blue-200 fixed inset-x-0 bottom-0 left-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <MapPinIcon className="size-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              <span className="font-medium">Add your delivery address</span> to
              complete your profile and start shopping.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onPress={handleAddAddress}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Address
            </Button>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors"
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
