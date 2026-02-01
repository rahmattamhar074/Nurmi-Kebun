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
import type { Order } from "@/types/order";
import { DetailContent } from "./detail-content";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

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
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const approveForm = useForm({});
  const rejectForm = useForm({});

  const handleApprove = () => {
    if (!order) return;

    approveForm.post(route("dashboard.transactions.approve", order.id), {
      onSuccess: () => {
        toast.success("Order approved successfully!");
        setApproveDialogOpen(false);
        onOpenChange(false);
        setDialogKey((prev) => prev + 1);
      },
      onError: (errors) => {
        console.error("Approve error:", errors);
        toast.error("Failed to approve order. Please try again.");
      },
    });
  };

  const handleReject = () => {
    if (!order) return;

    rejectForm.post(route("dashboard.transactions.reject", order.id), {
      onSuccess: () => {
        toast.success("Order rejected successfully!");
        setRejectDialogOpen(false);
        onOpenChange(false);
        setDialogKey((prev) => prev + 1);
      },
      onError: (errors) => {
        console.error("Reject error:", errors);
        toast.error("Failed to reject order. Please try again.");
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
              <Button
                intent="danger"
                onPress={() => setRejectDialogOpen(true)}
                className="mr-auto"
              >
                <div className="flex items-center gap-2">
                  <XCircleIcon className="size-5" />
                  Reject Payment
                </div>
              </Button>
              <Button
                intent="primary"
                onPress={() => setApproveDialogOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="size-5" />
                  Approve Payment
                </div>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <Modal isOpen={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <ModalContent isBlurred role="alertdialog">
          <ModalHeader>
            <ModalTitle>Approve Payment</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="size-6 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Are you sure you want to approve this payment?
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    This will move the order to "Processing" status and the
                    stock will be deducted. This action cannot be undone.
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
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              intent="outline"
              onPress={() => setApproveDialogOpen(false)}
              isDisabled={approveForm.processing}
            >
              Cancel
            </Button>
            <Button
              intent="primary"
              onPress={handleApprove}
              isDisabled={approveForm.processing}
            >
              {approveForm.processing ? "Approving..." : "Approve Payment"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <ModalContent isBlurred role="alertdialog">
          <ModalHeader>
            <ModalTitle>Reject Payment</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <XCircleIcon className="size-6 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Are you sure you want to reject this payment?
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    This will move the order back to "Awaiting Payment" status
                    and clear all payment information. The customer will need to
                    upload payment proof again.
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
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              intent="outline"
              onPress={() => setRejectDialogOpen(false)}
              isDisabled={rejectForm.processing}
            >
              Cancel
            </Button>
            <Button
              intent="danger"
              onPress={handleReject}
              isDisabled={rejectForm.processing}
            >
              {rejectForm.processing ? "Rejecting..." : "Reject Payment"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
