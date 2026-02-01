"use client";

import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import type { Product } from "@/types/product";

interface RestoreProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RestoreProductDialog({
  product,
  isOpen,
  onOpenChange,
}: RestoreProductDialogProps) {
  const { post, processing } = useForm();

  const handleRestore = () => {
    if (!product) return;

    post(route("products.deleted.restore", product.id), {
      preserveScroll: true,
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (errors) => {
        console.error("Restore error:", errors);
      },
    });
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent isBlurred role="alertdialog">
        <ModalHeader>
          <ModalTitle>Restore Product</ModalTitle>
          <ModalDescription>
            Are you sure you want to restore "{product.name}"? This product will
            be available again in your inventory.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Product will be restored
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    This product will be moved back to your active inventory and
                    will be available for sale again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <Button
            intent="primary"
            isDisabled={processing}
            onPress={handleRestore}
          >
            {processing ? "Restoring..." : "Restore Product"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
