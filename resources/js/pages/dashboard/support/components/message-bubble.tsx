import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import { ArrowDownTrayIcon, DocumentIcon } from "@heroicons/react/24/outline";
import type { SupportMessage } from "@/types/support";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: SupportMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAdmin = message.is_admin_reply;
  const [previewOpen, setPreviewOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  };

  return (
    <>
      <div
        className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            isAdmin
              ? "bg-blue-500 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
          }`}
        >
          {message.user?.name ? getInitials(message.user.name) : "?"}
        </div>

        <div
          className={`flex flex-col gap-1 max-w-[70%] ${
            isAdmin ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              isAdmin ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span className="font-semibold text-sm">{message.user?.name}</span>
            {isAdmin && (
              <Badge intent="info" className="text-xs">
                Admin
              </Badge>
            )}
            <span className="text-xs text-muted-fg">
              {formatDate(new Date(message.created_at), "dd MMM, HH:mm")}
            </span>
          </div>

          <div
            className={`rounded-lg p-4 ${
              isAdmin
                ? "bg-blue-100 dark:bg-blue-900/30 rounded-tr-none"
                : "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>

            {message.attachment_path && (
              <div className="mt-3">
                {isImage(message.attachment_name || "") ? (
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={route("dashboard.support.attachment", message.id)}
                      alt={message.attachment_name || "message attachment"}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                        Click to view
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                  >
                    <DocumentIcon className="size-8 text-gray-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {message.attachment_name}
                      </p>
                      <p className="text-xs text-muted-fg">
                        {message.formatted_attachment_size}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {message.attachment_path && (
        <Modal isOpen={previewOpen} onOpenChange={setPreviewOpen}>
          <ModalContent isBlurred size="5xl">
            <ModalHeader>
              <ModalTitle>{message.attachment_name}</ModalTitle>
              <ModalDescription className="sr-only">
                Attachment preview
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              {isImage(message.attachment_name || "") ? (
                <img
                  src={route("dashboard.support.attachment", message.id)}
                  alt={message.attachment_name || "message attachment"}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <DocumentIcon className="size-24 text-gray-400" />
                  <p className="text-lg font-medium">
                    {message.attachment_name}
                  </p>
                  <p className="text-sm text-muted-fg">
                    {message.formatted_attachment_size}
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <a
                href={route("dashboard.support.attachment", message.id)}
                download
              >
                <Button intent="primary">
                  <ArrowDownTrayIcon className="size-4 mr-2" />
                  Download
                </Button>
              </a>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
