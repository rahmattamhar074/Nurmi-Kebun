import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import DynamicDialog from "@/components/modules/dynamic-dialog";

interface ConfirmCompleteTriggerProps {
  orderNumber: string;
  trackingNumber?: string;
}

export function ConfirmCompleteTrigger({
  orderNumber,
  trackingNumber,
}: ConfirmCompleteTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const completeForm = useForm({});

  const handleComplete = () => {
    completeForm.post(route("my-orders.complete", orderNumber), {
      onSuccess: () => {
        setIsOpen(false);
        setDialogKey((prev) => prev + 1);
      },
    });
  };

  return (
    <>
      <div className="flex lg:items-center gap-3 flex-col lg:flex-row">
        {trackingNumber && (
          <div className="text-left lg:text-right">
            <p className="text-xs text-muted-fg">Tracking Number</p>
            <p className="font-mono font-semibold">{trackingNumber}</p>
          </div>
        )}
        <Button onPress={() => setIsOpen(true)}>Mark as Received</Button>
      </div>

      {isOpen && (
        <DynamicDialog
          key={dialogKey}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="Confirm Order Received"
          description="Are you sure you want to mark this order as received? This action will complete your order and cannot be undone."
        >
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              intent="outline"
              onPress={() => setIsOpen(false)}
              isDisabled={completeForm.processing}
            >
              Cancel
            </Button>
            <Button
              onPress={handleComplete}
              isDisabled={completeForm.processing}
            >
              {completeForm.processing
                ? "Confirming..."
                : "Yes, Mark as Received"}
            </Button>
          </div>
        </DynamicDialog>
      )}
    </>
  );
}
