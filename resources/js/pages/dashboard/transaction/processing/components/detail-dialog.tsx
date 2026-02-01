"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FieldError, Label } from "@/components/ui/field";

import type { Order } from "@/types/order";
import { DetailContent } from "./detail-content";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { TruckIcon } from "@heroicons/react/24/outline";
import { TextField } from "@/components/ui/text-field";
import { Input } from "@/components/ui/input";

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
  const [shipDialogOpen, setShipDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const shipForm = useForm({
    tracking_number: "",
  });

  const handleShip = () => {
    if (!order) return;

    shipForm.post(route("dashboard.transactions.ship", order.id), {
      onSuccess: () => {
        toast.success("Order shipped successfully!");
        setShipDialogOpen(false);
        onOpenChange(false);
        shipForm.reset();
        setDialogKey((prev) => prev + 1);
      },
      onError: (errors) => {
        console.error("Ship error:", errors);
        if (errors.tracking_number) {
          toast.error(errors.tracking_number);
        } else {
          toast.error("Failed to ship order. Please try again.");
        }
      },
    });
  };

  if (!order) return null;

  return (
    <>
      {isOpen && (
        <Modal key={dialogKey} isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent isBlurred size="5xl" className="sm:max-w-6xl">
            <ModalHeader>
              <ModalTitle>Order Details - {order.order_number}</ModalTitle>
            </ModalHeader>
            <ModalBody className="mb-4">
              <DetailContent order={order} />
            </ModalBody>
            <ModalFooter>
              <Button intent="primary" onPress={() => setShipDialogOpen(true)}>
                <div className="flex items-center gap-2">
                  <TruckIcon className="size-5" />
                  Ship Order
                </div>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <Modal isOpen={shipDialogOpen} onOpenChange={setShipDialogOpen}>
        <ModalContent isBlurred role="alertdialog">
          <ModalHeader>
            <ModalTitle>Ship Order</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <TruckIcon className="size-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Ready to ship this order?
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Enter the tracking number to mark this order as shipped. The
                    customer will be notified.
                  </p>
                  <div className="mt-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      Order: {order.order_number}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Customer: {order.user?.name}
                    </p>
                  </div>
                </div>
              </div>

              <TextField
                isRequired
                isInvalid={!!shipForm.errors.tracking_number}
              >
                <Label>Tracking Number</Label>
                <Input
                  value={shipForm.data.tracking_number}
                  onChange={(e) =>
                    shipForm.setData("tracking_number", e.target.value)
                  }
                  placeholder="Enter tracking number"
                  autoFocus
                />
                {shipForm.errors.tracking_number && (
                  <FieldError>{shipForm.errors.tracking_number}</FieldError>
                )}
              </TextField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              intent="outline"
              onPress={() => {
                setShipDialogOpen(false);
                shipForm.reset();
              }}
              isDisabled={shipForm.processing}
            >
              Cancel
            </Button>
            <Button
              intent="primary"
              onPress={handleShip}
              isDisabled={shipForm.processing || !shipForm.data.tracking_number}
            >
              {shipForm.processing ? "Shipping..." : "Ship Order"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
