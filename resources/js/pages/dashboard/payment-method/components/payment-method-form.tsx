"use client";

import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Description, FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { PaymentMethod } from "@/types/payment-method";
import { useEffect } from "react";
import { toast } from "sonner";

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod;
  onSuccess?: () => void;
  onClose?: () => void;
  submitLabel?: string;
}

export function PaymentMethodForm({
  paymentMethod,
  onSuccess,
  onClose,
  submitLabel = "Update Account Details",
}: PaymentMethodFormProps) {
  const { data, setData, post, processing, errors } = useForm({
    account_number: paymentMethod?.account_number || "",
    account_holder_name: paymentMethod?.account_holder_name || "",
    _method: undefined as string | undefined,
  });

  useEffect(() => {
    if (paymentMethod) {
      setData({
        account_number: paymentMethod.account_number,
        account_holder_name: paymentMethod.account_holder_name,
        _method: undefined,
      });
    }
  }, [paymentMethod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const options = {
      onSuccess: () => {
        toast.success("Payment method updated successfully!");
        onSuccess?.();
      },
      onError: (errors: any) => {
        console.log("Validation errors:", errors);
        toast.error("Failed to update payment method. Please try again.");
      },
    };

    if (paymentMethod) {
      setData("_method", "PUT");
      post(
        route("dashboard.payment-methods.update", paymentMethod.id),
        options
      );
    }
  };

  if (!paymentMethod) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          {paymentMethod.icon_url && (
            <img
              src={paymentMethod.icon_url}
              alt={`${paymentMethod.name} icon`}
              className="w-12 h-12 object-contain rounded"
            />
          )}
          <div>
            <div className="font-semibold text-lg text-neutral-900 dark:text-white">
              {paymentMethod.name}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {paymentMethod.type === "bank" ? "Bank Transfer" : "E-Wallet"}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Account Number</Label>
        <Description>Enter the account number or wallet address</Description>
        <Input
          type="text"
          value={data.account_number}
          onChange={(e) => setData("account_number", e.target.value)}
          placeholder="e.g., 1234567890, wallet address"
          required
        />
        {errors.account_number && (
          <FieldError>{errors.account_number}</FieldError>
        )}
      </div>

      <div className="space-y-2">
        <Label>Account Holder Name</Label>
        <Description>Enter the name of the account holder</Description>
        <Input
          type="text"
          value={data.account_holder_name}
          onChange={(e) => setData("account_holder_name", e.target.value)}
          placeholder="e.g., John Doe, Company Name"
          required
        />
        {errors.account_holder_name && (
          <FieldError>{errors.account_holder_name}</FieldError>
        )}
      </div>

      <div className="flex gap-3 pt-4 justify-end">
        <Button
          type="button"
          intent="secondary"
          onPress={onClose}
          isDisabled={processing}
        >
          Cancel
        </Button>
        <Button type="submit" isDisabled={processing}>
          {processing ? "Updating..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
