"use client";

import { useState, useCallback } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { CategoryForm } from "../category-form";
import type { ProductCategory } from "@/types/product";
import { toast } from "sonner";

interface EditCategoryDialogProps {
  category: ProductCategory | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function EditCategoryDialog({
  category,
  isOpen,
  onOpenChange,
  trigger,
}: EditCategoryDialogProps) {
  const [dialogKey, setDialogKey] = useState(0);

  const handleSuccess = useCallback(() => {
    onOpenChange(false);
    toast.success("Category updated successfully");
    setDialogKey((prev) => prev + 1);
  }, [onOpenChange]);

  if (!category) return null;

  return (
    <Modal key={dialogKey} isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger && <ModalTrigger>{trigger}</ModalTrigger>}
      <ModalContent isBlurred>
        <ModalHeader>
          <ModalTitle>Edit Category</ModalTitle>
          <ModalDescription>
            Update the details for "{category.name}" category.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="mb-4">
          <CategoryForm
            category={category}
            onSuccess={handleSuccess}
            submitLabel="Update Category"
            onClose={() => onOpenChange(false)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
