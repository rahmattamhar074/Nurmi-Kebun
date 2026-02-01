/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/field";
import DynamicDialog from "@/components/modules/dynamic-dialog";

interface CancelOrderTriggerProps {
  orderNumber: string;
  status: string;
}

const CANCELLATION_REASONS = [
  { value: "changed_mind", label: "Changed my mind" },
  { value: "better_price", label: "Found better price" },
  { value: "ordered_mistake", label: "Ordered by mistake" },
  { value: "payment_issues", label: "Payment issues" },
  { value: "other", label: "Other" },
];

export function CancelOrderTrigger({
  orderNumber,
  status,
}: CancelOrderTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const cancelForm = useForm({
    cancellation_reason: "",
  });

  if (!["pending_payment", "payment_verification"].includes(status)) {
    return null;
  }

  const handleCancel = () => {
    const reasonLabel =
      CANCELLATION_REASONS.find((r) => r.value === selectedReason)?.label || "";
    const fullReason = additionalNotes
      ? `${reasonLabel}: ${additionalNotes}`
      : reasonLabel;

    cancelForm.transform((data) => ({
      ...data,
      cancellation_reason: fullReason,
    }));

    cancelForm.post(route("my-orders.cancel", orderNumber), {
      onSuccess: () => {
        setIsOpen(false);
        setDialogKey((prev) => prev + 1);
        setSelectedReason("");
        setAdditionalNotes("");
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
          title="Cancel Order"
          description="Are you sure you want to cancel this order? This action cannot be undone."
        >
          <div className="flex flex-col gap-4 pt-4">
            <div className="space-y-2">
              <Label>Reason for cancellation *</Label>
              <Select
                selectedKey={selectedReason}
                onSelectionChange={(key) => setSelectedReason(key as string)}
                isRequired
              >
                <SelectTrigger>
                  {selectedReason
                    ? CANCELLATION_REASONS.find(
                        (r) => r.value === selectedReason
                      )?.label
                    : "Select a reason"}
                </SelectTrigger>
                <SelectContent>
                  {CANCELLATION_REASONS.map((reason) => (
                    <SelectItem key={reason.value} id={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional notes (optional)</Label>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Provide more details about why you're cancelling..."
                rows={3}
              />
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
                isDisabled={cancelForm.processing || !selectedReason}
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
