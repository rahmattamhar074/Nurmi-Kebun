import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Error403() {
  return (
    <>
      <Head title="403 - Forbidden" />
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full text-center space-y-8">
          <img
            src="/assets/403.svg"
            alt="Forbidden"
            className="w-full max-w-sm mx-auto"
          />
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Access Forbidden
            </h1>
            <p className="text-lg text-muted-fg">
              You don't have permission to access this resource. Please contact
              support if you believe this is an error.
            </p>
          </div>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
