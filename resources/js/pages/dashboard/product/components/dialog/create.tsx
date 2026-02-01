"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { IconPlus } from "@intentui/icons";
import { ProductForm } from "../product-form";
import type { ProductCategory } from "@/types/product";

interface CreateProductTriggerProps {
  categories: ProductCategory[];
}

export function CreateProductTrigger({
  categories,
}: CreateProductTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const handleSuccess = useCallback(() => {
    setIsOpen(false);
    setDialogKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <Button
        className="flex items-center gap-x-2"
        onPress={() => setIsOpen(true)}
      >
        <IconPlus />
        <span>Add Product</span>
      </Button>
      {isOpen && (
        <Modal key={dialogKey} isOpen={isOpen} onOpenChange={setIsOpen}>
          <ModalContent isBlurred size="3xl">
            <ModalHeader>
              <ModalTitle>Create New Product</ModalTitle>
              <ModalDescription>
                Add a new product to your inventory.
              </ModalDescription>
            </ModalHeader>
            <ModalBody className="mb-4">
              <ProductForm
                categories={categories}
                onSuccess={handleSuccess}
                submitLabel="Create Product"
                onClose={() => setIsOpen(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
