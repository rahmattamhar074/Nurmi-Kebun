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
import { toast } from "sonner";

interface DeleteProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProductDialog({
  product,
  isOpen,
  onOpenChange,
}: DeleteProductDialogProps) {
  const { delete: destroy, processing } = useForm();

  const handleDelete = () => {
    if (!product) return;

    destroy(route("products.destroy", product.id), {
      onSuccess: () => {
        onOpenChange(false);
        toast.success("Product deleted successfully");
      },
      onError: (errors) => {
        console.error("Delete error:", errors);
        toast.error("Failed to delete product");
      },
    });
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent isBlurred role="alertdialog">
        <ModalHeader>
          <ModalTitle>Delete Product</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete "{product.name}"? This action cannot
            be undone and will permanently remove the product from your
            inventory.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  This action cannot be undone
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>
                    Deleting this product will permanently remove it from your
                    inventory. All associated data will be lost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <Button
            intent="danger"
            isDisabled={processing}
            onPress={handleDelete}
          >
            {processing ? "Deleting..." : "Delete Product"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
