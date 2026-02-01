"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import type { PaymentMethod } from "@/types/payment-method";
import { PaymentMethodForm } from "../payment-method-form";

interface EditPaymentMethodDialogProps {
  paymentMethod: PaymentMethod | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPaymentMethodDialog({
  paymentMethod,
  isOpen,
  onOpenChange,
}: EditPaymentMethodDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  if (!paymentMethod) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent isBlurred>
        <ModalHeader>
          <ModalTitle>Edit Payment Method</ModalTitle>
          <ModalDescription>
            Update account number and holder name for this payment method.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="mb-4">
          <PaymentMethodForm
            paymentMethod={paymentMethod}
            onSuccess={handleSuccess}
            submitLabel="Update Account Details"
            onClose={() => onOpenChange(false)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
