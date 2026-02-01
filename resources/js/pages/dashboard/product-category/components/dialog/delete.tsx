"use client";

import { useState, useCallback } from "react";
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
import type { ProductCategory } from "@/types/product";
import { toast } from "sonner";

interface DeleteCategoryDialogProps {
  category: ProductCategory | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
  category,
  isOpen,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const [dialogKey, setDialogKey] = useState(0);
  const { delete: destroy, processing } = useForm();

  const handleDelete = useCallback(() => {
    if (!category) return;

    destroy(route("categories.destroy", category.id), {
      onSuccess: () => {
        onOpenChange(false);
        toast.success("Category deleted successfully");
        setDialogKey((prev) => prev + 1);
      },
      onError: (errors) => {
        console.error("Delete error:", errors);
        toast.error("Failed to delete category");
      },
    });
  }, [category, destroy, onOpenChange]);

  if (!category) return null;

  return (
    <Modal key={dialogKey} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent isBlurred role="alertdialog">
        <ModalHeader>
          <ModalTitle>Delete Category</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete "{category.name}"?
            {category.products_count && category.products_count > 0 && (
              <span className="block mt-2 text-amber-600 dark:text-amber-400">
                This category contains {category.products_count} product(s). You
                cannot delete a category that contains products.
              </span>
            )}
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-700 dark:text-red-300">
              This action cannot be undone. The category will be permanently
              removed from your system.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <Button
            className="bg-red-600 hover:bg-red-700"
            isDisabled={
              processing ||
              (category.products_count ? category.products_count > 0 : false)
            }
            onPress={handleDelete}
          >
            {processing ? "Deleting..." : "Delete Category"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
