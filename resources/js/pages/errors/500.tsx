import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Error500() {
  return (
    <>
      <Head title="500 - Server Error" />
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full text-center space-y-8">
          <img
            src="/assets/500.svg"
            alt="Server Error"
            className="w-full max-w-sm mx-auto"
          />
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Server Error
            </h1>
            <p className="text-lg text-muted-fg">
              Something went wrong on our end. We're working to fix it. Please
              try again later.
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
