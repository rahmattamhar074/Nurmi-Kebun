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
import { CategoryForm } from "../category-form";
import { IconPlus } from "@intentui/icons";

export function CreateCategoryTrigger() {
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
        <span>Add Category</span>
      </Button>
      {isOpen && (
        <Modal key={dialogKey} isOpen={isOpen} onOpenChange={setIsOpen}>
          <ModalContent isBlurred>
            <ModalHeader>
              <ModalTitle>Create New Category</ModalTitle>
              <ModalDescription>
                Add a new product category to organize your products.
              </ModalDescription>
            </ModalHeader>
            <ModalBody className="mb-4">
              <CategoryForm
                onSuccess={handleSuccess}
                submitLabel="Create Category"
                onClose={() => setIsOpen(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
