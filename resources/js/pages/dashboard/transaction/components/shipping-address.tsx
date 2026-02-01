import { MapPinIcon } from "@heroicons/react/24/outline";

interface ShippingAddressProps {
  recipientName: string;
  recipientPhone: string;
  fullAddress: string;
  subdistrictName?: string | null;
  cityName: string;
  provinceName: string;
  postalCode: string;
  customerNotes?: string | null;
}

export function ShippingAddress({
  recipientName,
  recipientPhone,
  fullAddress,
  subdistrictName,
  cityName,
  provinceName,
  postalCode,
  customerNotes,
}: ShippingAddressProps) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPinIcon className="size-5 text-neutral-500" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Shipping Address
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Recipient
          </p>
          <p className="font-medium text-neutral-900 dark:text-white">
            {recipientName}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Phone Number
          </p>
          <p className="font-medium text-neutral-900 dark:text-white">
            {recipientPhone}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Full Address
          </p>
          <p className="font-medium text-neutral-900 dark:text-white">
            {fullAddress}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
            {subdistrictName && `${subdistrictName}, `}
            {cityName}, {provinceName} {postalCode}
          </p>
        </div>
        {customerNotes && (
          <div className="col-span-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Customer Notes
            </p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
              "{customerNotes}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
