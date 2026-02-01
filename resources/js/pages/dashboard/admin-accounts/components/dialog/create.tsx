"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { AdminForm } from "../admin-form";

interface CreateAdminDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAdminDialog({
  isOpen,
  onOpenChange,
}: CreateAdminDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent isBlurred>
        <ModalHeader>
          <ModalTitle>Create Admin Account</ModalTitle>
          <ModalDescription>
            Add a new administrator to manage the system.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="mb-4">
          <AdminForm
            onSuccess={handleSuccess}
            submitLabel="Create Admin"
            onClose={() => onOpenChange(false)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
