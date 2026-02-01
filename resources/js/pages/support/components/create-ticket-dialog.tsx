"use client";

import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Label, Description, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileTrigger } from "@/components/ui/file-trigger";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import { toast } from "sonner";

interface CreateTicketDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTicketDialog({
  isOpen,
  onOpenChange,
}: CreateTicketDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data, setData, post, processing, reset, errors } = useForm({
    subject: "",
    order_id: "",
    message: "",
    attachment: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("support.create"), {
      onSuccess: () => {
        reset();
        setSelectedFile(null);
        onOpenChange(false);
        toast.success("Support ticket created successfully!");
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0];
        if (firstError) {
          toast.error(firstError);
        }
      },
    });
  };

  return (
    <DynamicDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create Support Ticket"
      description="Submit a support request and we'll get back to you as soon as possible."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Subject</Label>
          <Description>Brief description of your issue</Description>
          <Input
            type="text"
            placeholder="e.g., Issue with order payment"
            value={data.subject}
            onChange={(e) => setData("subject", e.target.value)}
            required
          />
          {errors.subject && <FieldError>{errors.subject}</FieldError>}
        </div>

        <div className="space-y-2">
          <Label>Related Order (Optional)</Label>
          <Description>
            Enter order number if this is related to an order
          </Description>
          <Input
            type="text"
            placeholder="e.g., ORD-20231224-0001"
            value={data.order_id}
            onChange={(e) => setData("order_id", e.target.value)}
          />
          {errors.order_id && <FieldError>{errors.order_id}</FieldError>}
        </div>

        <div className="space-y-2">
          <Label>Message</Label>
          <Description>Describe your issue in detail</Description>
          <Textarea
            value={data.message}
            onChange={(e) => setData("message", e.target.value)}
            placeholder="Please describe your issue..."
            rows={5}
            required
          />
          {errors.message && <FieldError>{errors.message}</FieldError>}
        </div>

        <div className="space-y-2">
          <Label>Attachment (Optional)</Label>
          <Description>
            Max 2MB. Allowed: Images (jpg, png, gif, webp) and PDF
          </Description>
          <div className="flex items-center gap-4">
            {selectedFile && (
              <div className="relative">
                {selectedFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Attachment preview"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md border">
                    <svg
                      className="w-10 h-10 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setData("attachment", null);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
            <FileTrigger
              acceptedFileTypes={[
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/webp",
                "application/pdf",
              ]}
              onSelect={(files) => {
                const fileArray = Array.from(files || []);
                const file = fileArray[0] || null;
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    alert("File size must not exceed 2MB");
                    return;
                  }
                  setSelectedFile(file);
                  setData("attachment", file);
                }
              }}
            />
          </div>
          {errors.attachment && <FieldError>{errors.attachment}</FieldError>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            intent="outline"
            onPress={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isDisabled={processing || !data.subject || !data.message}
          >
            {processing ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      </form>
    </DynamicDialog>
  );
}
