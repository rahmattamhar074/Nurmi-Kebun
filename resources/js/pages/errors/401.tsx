import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Error401() {
  return (
    <>
      <Head title="401 - Unauthorized" />
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full text-center space-y-8">
          <img
            src="/assets/401.svg"
            alt="Unauthorized"
            className="w-full max-w-sm mx-auto"
          />
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Unauthorized
            </h1>
            <p className="text-lg text-muted-fg">
              You need to be logged in to access this page. Please authenticate
              to continue.
            </p>
          </div>
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
