import { MapPinIcon, UserIcon, PhoneIcon } from "@heroicons/react/24/outline";

interface ShippingInfoProps {
  recipientName: string;
  recipientPhone: string;
  fullAddress: string;
  subdistrictName?: string | null;
  cityName: string;
  provinceName: string;
  postalCode: string;
}

export function ShippingInfo({
  recipientName,
  recipientPhone,
  fullAddress,
  subdistrictName,
  cityName,
  provinceName,
  postalCode,
}: ShippingInfoProps) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPinIcon className="size-5 text-neutral-500" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Shipping Address
        </h3>
      </div>

      <div className="space-y-4 grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <UserIcon className="size-5 text-neutral-400 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Recipient Name
            </p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {recipientName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <PhoneIcon className="size-5 text-neutral-400 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Phone Number
            </p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {recipientPhone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPinIcon className="size-5 text-neutral-400 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Full Address
            </p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {fullAddress}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {subdistrictName && `${subdistrictName}, `}
              {cityName}, {provinceName} {postalCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
