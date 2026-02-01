import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Label, Description } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { FileTrigger } from "@/components/ui/file-trigger";
import type { SupportTicket } from "@/types/support";

interface TicketReplyFormProps {
  ticket: SupportTicket;
}

export function TicketReplyForm({ ticket }: TicketReplyFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data, setData, post, processing, reset } = useForm({
    message: "",
    attachment: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("dashboard.support.reply", ticket.ticket_number), {
      onSuccess: () => {
        reset();
        setSelectedFile(null);
      },
    });
  };

  if (ticket.status === "closed") {
    return null;
  }

  return (
    <div className="p-6 rounded-lg border border-neutral-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="font-bold mb-3 block">Send a Message</Label>
          <Textarea
            value={data.message}
            onChange={(e) => setData("message", e.target.value)}
            placeholder="Type your reply here..."
            rows={4}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedFile && (
              <div className="relative">
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <p className="text-sm">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)}{" "}
                    KB)
                  </p>
                </div>
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
            >
              <p>{selectedFile ? "Change File" : "Attach File"}</p>
            </FileTrigger>
            <Description className="text-xs">
              Max 2MB. Images & PDF only
            </Description>
          </div>

          <Button type="submit" isDisabled={processing || !data.message}>
            {processing ? "Sending..." : "Send Reply"}
          </Button>
        </div>
      </form>
    </div>
  );
}
