"use client";

import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Description, FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AdminFormData } from "@/types/admin";
import { TextField } from "@/components/ui/text-field";

interface AdminFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  submitLabel?: string;
}

export function AdminForm({
  onSuccess,
  onClose,
  submitLabel = "Create Admin",
}: AdminFormProps) {
  const { data, setData, post, processing, errors, reset } =
    useForm<AdminFormData>({
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("dashboard.admin-accounts.store"), {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
      onError: (errors) => {
        console.log("Validation errors:", errors);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Name</Label>
        <Description>Enter the admin's full name</Description>
        <Input
          type="text"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          placeholder="e.g., John Doe"
          required
        />
        {errors.name && (
          <FieldError className={"text-red-500 text-sm"}>
            {errors.name}
          </FieldError>
        )}
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Description>Enter a unique email address</Description>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          placeholder="e.g., admin@example.com"
          required
        />
        {errors.email && (
          <FieldError className={"text-red-500 text-sm"}>
            {errors.email}
          </FieldError>
        )}
      </div>

      <div className="space-y-2">
        <Label>Phone</Label>
        <Description>Enter the admin's phone number</Description>
        <Input
          type="text"
          value={data.phone}
          onChange={(e) => setData("phone", e.target.value)}
          placeholder="e.g., 081234567890"
          required
        />
        {errors.phone && (
          <FieldError className={"text-red-500 text-sm"}>
            {errors.phone}
          </FieldError>
        )}
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Description>
          Create a secure password (minimum 8 characters)
        </Description>
        <Input
          type="password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
          placeholder="Enter password"
          required
        />
        {errors.password && (
          <FieldError className={"text-red-500 text-sm"}>
            {errors.password}
          </FieldError>
        )}
      </div>

      <TextField
        isRequired
        isInvalid={!!(errors.password_confirmation || errors.password)}
      >
        <Label>Confirm Password</Label>
        <Description>Re-enter the password to confirm</Description>
        <Input
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData("password_confirmation", e.target.value)}
          placeholder="Confirm password"
        />
        {(errors.password_confirmation || errors.password) && (
          <FieldError className={"text-red-500 text-sm"}>
            {errors.password_confirmation || errors.password}
          </FieldError>
        )}
      </TextField>

      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        {onClose && (
          <Button
            type="button"
            intent="outline"
            onClick={onClose}
            isDisabled={processing}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" isDisabled={processing}>
          {processing ? "Creating..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
