import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { XMarkIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export function EmailVerificationBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (isDismissed) return null;

  const handleResend = () => {
    setIsResending(true);
    router.post(
      route("verification.send"),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsResending(false);
        },
        onError: () => {
          setIsResending(false);
        },
      }
    );
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 fixed inset-x-0 bottom-0 left-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <EnvelopeIcon className="size-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-medium">Verify your email address</span> to
              access all features. Check your inbox for the verification link.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onPress={handleResend}
              isPending={isResending}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isResending && <Loader />}
              Resend Email
            </Button>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded hover:bg-amber-100 text-amber-600 transition-colors"
              aria-label="Dismiss"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
