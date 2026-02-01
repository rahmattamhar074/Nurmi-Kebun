/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/field";
import DynamicDialog from "@/components/modules/dynamic-dialog";

interface AdminCancelOrderTriggerProps {
  orderId: number;
  orderNumber: string;
  onSuccess?: () => void;
}

export function AdminCancelOrderTrigger({
  orderId,
  orderNumber,
  onSuccess,
}: AdminCancelOrderTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [adminNotes, setAdminNotes] = useState("");

  const cancelForm = useForm({
    admin_notes: "",
  });

  const handleCancel = () => {
    cancelForm.transform((data) => ({
      ...data,
      admin_notes: adminNotes,
    }));

    cancelForm.post(route("dashboard.transactions.cancel", orderId), {
      onSuccess: () => {
        setIsOpen(false);
        setDialogKey((prev) => prev + 1);
        setAdminNotes("");
        onSuccess?.();
      },
    });
  };

  return (
    <>
      <Button intent="danger" size="sm" onPress={() => setIsOpen(true)}>
        Cancel Order
      </Button>

      {isOpen && (
        <DynamicDialog
          key={dialogKey}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title={`Cancel Order ${orderNumber}`}
          description="This will cancel the order and restore stock if applicable. Please provide a reason for cancellation."
        >
          <div className="flex flex-col gap-4 pt-4">
            <div className="space-y-2">
              <Label>Admin Notes (Required) *</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Explain why this order is being cancelled..."
                rows={4}
                required
              />
              <p className="text-xs text-muted-fg">
                These notes will be visible to the customer as the cancellation
                reason.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                intent="outline"
                onPress={() => setIsOpen(false)}
                isDisabled={cancelForm.processing}
              >
                Keep Order
              </Button>
              <Button
                intent="danger"
                onPress={handleCancel}
                isDisabled={cancelForm.processing || !adminNotes.trim()}
              >
                {cancelForm.processing ? "Cancelling..." : "Yes, Cancel Order"}
              </Button>
            </div>
          </div>
        </DynamicDialog>
      )}
    </>
  );
}
