"use client";

import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Description, FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import { toast } from "sonner";
import type { SharedData } from "@/types/shared";
import { useEffect } from "react";

interface AdminSettingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminSettingDialog({
  isOpen,
  onOpenChange,
}: AdminSettingDialogProps) {
  const { auth } = usePage<SharedData>().props;

  const { data, setData, patch, processing, errors, reset, clearErrors } =
    useForm({
      name: auth.user.name,
      current_password: "",
      password: "",
      password_confirmation: "",
    });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setData({
        name: auth.user.name,
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      clearErrors();
    }
  }, [isOpen]);

  // Check if any password field is filled
  const hasPasswordInput =
    data.current_password || data.password || data.password_confirmation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    patch(route("dashboard.admin-settings.update"), {
      onSuccess: () => {
        toast.success("Settings updated successfully");
        onOpenChange(false);
        reset("current_password", "password", "password_confirmation");
      },
      onError: (errors) => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
          toast.error(errors[firstErrorKey]);
        }
      },
    });
  };

  return (
    <DynamicDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Account Settings"
      description="Update your name and password"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label>Name</Label>
          <Description>Your display name</Description>
          <Input
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            placeholder="Enter your name"
            required
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-fg">
              Change Password{" "}
              <span className="text-muted-fg font-normal">(optional)</span>
            </h3>
            <p className="text-sm text-muted-fg mt-1">
              Leave blank to keep your current password
            </p>
          </div>

          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={data.current_password}
              onChange={(e) => setData("current_password", e.target.value)}
              placeholder="Enter current password"
              required={!!hasPasswordInput}
            />
            {errors.current_password && (
              <FieldError>{errors.current_password}</FieldError>
            )}
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              placeholder="Enter new password"
              required={!!hasPasswordInput}
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              placeholder="Confirm new password"
              required={!!hasPasswordInput}
            />
            {errors.password_confirmation && (
              <FieldError>{errors.password_confirmation}</FieldError>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            intent="outline"
            onPress={() => onOpenChange(false)}
            isDisabled={processing}
          >
            Cancel
          </Button>
          <Button type="submit" isDisabled={processing}>
            {processing ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </DynamicDialog>
  );
}
