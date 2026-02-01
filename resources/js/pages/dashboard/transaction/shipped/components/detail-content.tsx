"use client";

import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import type { Order } from "@/types/order";
import {
  OrderInformation,
  OrderItemsList,
  ShippingInfo,
} from "../../components";

interface DetailContentProps {
  order: Order;
  onClose?: () => void;
}

export function DetailContent({ order, onClose }: DetailContentProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);

    router.post(
      route("dashboard.transactions.complete", order.id),
      {},
      {
        onSuccess: () => {
          toast.success("Order completed successfully!");
          setShowConfirmDialog(false);
          onClose?.();
        },
        onError: (errors) => {
          toast.error(errors.message || "Failed to complete order");
        },
        onFinish: () => {
          setIsCompleting(false);
        },
      }
    );
  };

  return (
    <>
      <div className="space-y-6 w-full">
        <OrderInformation
          orderNumber={order.order_number}
          status={order.status}
          user={order.user}
          createdAt={order.created_at}
          shippingService={order.shipping_name}
          trackingNumber={order.tracking_number}
        />

        <ShippingInfo
          recipientName={order.recipient_name}
          recipientPhone={order.recipient_phone}
          fullAddress={order.full_address}
          subdistrictName={order.subdistrict_name}
          cityName={order.city_name}
          provinceName={order.province_name}
          postalCode={order.postal_code}
        />

        <OrderItemsList
          items={order.items}
          subtotal={order.subtotal}
          shippingCost={order.shipping_cost}
          total={order.total}
        />

        <div className="flex justify-end pt-4 border-t">
          <Button
            onPress={() => setShowConfirmDialog(true)}
            isDisabled={isCompleting}
          >
            Complete Order
          </Button>
        </div>
      </div>

      <Modal isOpen={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <ModalContent isBlurred>
          <ModalHeader>
            <ModalTitle>Complete Order</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-muted-fg">
              Are you sure you want to mark this order as completed? This action
              will finalize the transaction.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              intent="secondary"
              onPress={() => setShowConfirmDialog(false)}
              isDisabled={isCompleting}
            >
              Cancel
            </Button>
            <Button onPress={handleComplete} isDisabled={isCompleting}>
              {isCompleting ? "Completing..." : "Complete Order"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
