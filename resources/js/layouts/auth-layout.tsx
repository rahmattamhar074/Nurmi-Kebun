import { Flash } from "@/components/flash";
import { Link } from "@/components/ui/link";
import type { PropsWithChildren, ReactNode } from "react";

interface GuestLayoutProps {
  header?: string | null;
  description?: string | ReactNode | null;
}
export default function AuthLayout({
  description = null,
  header = null,
  children,
}: PropsWithChildren<GuestLayoutProps>) {
  return (
    <>
      <Flash />
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="relative hidden bg-muted lg:block">
          <img
            src="https://images.unsplash.com/photo-1597305877032-0668b3c6413a?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="auth illustration"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="flex items-center justify-center rounded-md">
                <img
                  src="/assets/brand-full.webp"
                  alt="brand-logo"
                  className="h-8 w-auto lg:h-12"
                />
              </div>
              <span className="font-semibold">
                Nurmi <span className="text-muted-fg">Kebun</span>
              </span>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto">
            <div className="w-full mb-8 space-y-4">
              <p className="text-2xl font-semibold">{header}</p>
              <p className="max-w-md opacity-70">{description}</p>
            </div>
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
