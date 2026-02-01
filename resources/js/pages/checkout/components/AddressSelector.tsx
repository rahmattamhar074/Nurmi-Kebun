import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import type { UserAddress } from "@/pages/settings/addresses";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface AddressSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: UserAddress[];
  selectedAddressId: number;
}

export default function AddressSelector({
  isOpen,
  onOpenChange,
  addresses,
  selectedAddressId,
}: AddressSelectorProps) {
  const [tempSelectedId, setTempSelectedId] = useState(selectedAddressId);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    if (tempSelectedId !== selectedAddressId) {
      setIsLoading(true);
      router.get(
        `/checkout/payment?address_id=${tempSelectedId}`,
        {},
        {
          onFinish: () => setIsLoading(false),
        }
      );
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Select Shipping Address</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {addresses.map((address) => {
              const isSelected = tempSelectedId === address.id;
              const isCurrentlyUsed = selectedAddressId === address.id;

              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => setTempSelectedId(address.id)}
                  className={`w-full text-left border rounded-lg p-4 transition-all min-h-[120px] ${
                    isSelected
                      ? "border-green-500 "
                      : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p
                          className={`font-semibold ${
                            isSelected
                              ? "text-green-700 dark:text-green-300"
                              : "text-neutral-900 dark:text-neutral-100"
                          }`}
                        >
                          {address.name}
                        </p>
                        {address.is_default && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                        {isCurrentlyUsed && !isSelected && (
                          <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-900 dark:text-neutral-100">
                        {address.recipient_name} - {address.phone}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {address.full_address}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-500">
                        {address.subdistrict_name &&
                          `${address.subdistrict_name}, `}
                        {address.city_name}, {address.province_name}{" "}
                        {address.postal_code}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 w-6 h-6">
                        <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose isDisabled={isLoading}>Cancel</ModalClose>
          <Button onPress={handleConfirm} isDisabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Recalculating...
              </div>
            ) : tempSelectedId !== selectedAddressId ? (
              "Confirm & Recalculate Shipping"
            ) : (
              "Confirm"
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
