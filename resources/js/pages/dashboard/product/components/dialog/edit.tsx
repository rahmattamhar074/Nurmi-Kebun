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
import { ProductForm } from "../product-form";
import type { Product, ProductCategory } from "@/types/product";

interface EditProductDialogProps {
  product: Product | null;
  categories: ProductCategory[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function EditProductDialog({
  product,
  categories,
  isOpen,
  onOpenChange,
  trigger,
}: EditProductDialogProps) {
  const [dialogKey, setDialogKey] = useState(0);

  const handleSuccess = useCallback(() => {
    onOpenChange(false);
    setDialogKey((prev) => prev + 1);
  }, [onOpenChange]);

  if (!product) return null;

  return (
    <Modal key={dialogKey} isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger && <ModalTrigger>{trigger}</ModalTrigger>}
      <ModalContent isBlurred size="3xl">
        <ModalHeader>
          <ModalTitle>Edit Product</ModalTitle>
          <ModalDescription>
            Update the details for "{product.name}" product.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="mb-4">
          <ProductForm
            product={product}
            categories={categories}
            onSuccess={handleSuccess}
            submitLabel="Update Product"
            onClose={() => onOpenChange(false)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
