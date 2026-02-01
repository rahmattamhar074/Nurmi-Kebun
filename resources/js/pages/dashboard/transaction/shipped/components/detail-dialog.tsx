"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import type { Order } from "@/types/order";
import { DetailContent } from "./detail-content";
import { useState } from "react";

interface DetailDialogProps {
  order: Order | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailDialog({
  order,
  isOpen,
  onOpenChange,
}: DetailDialogProps) {
  const [dialogKey, setDialogKey] = useState(0);

  if (!order) return null;

  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} key={dialogKey} onOpenChange={onOpenChange}>
      <ModalContent isBlurred size="5xl" className="sm:max-w-6xl">
        <ModalHeader>
          <ModalTitle>Order Details - {order.order_number}</ModalTitle>
        </ModalHeader>
        <ModalBody className="mb-4">
          <DetailContent order={order} onClose={() => onOpenChange(false)} />
        </ModalBody>
      </ModalContent>
    </Modal>
      )}
    </>
  );
}
