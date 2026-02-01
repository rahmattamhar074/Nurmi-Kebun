import { Head, Form } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Loader } from "@/components/ui/loader";
import AuthLayout from "@/layouts/auth-layout";

export default function VerifyEmail({ status }: { status?: string }) {
  return (
    <>
      <Head title="Email Verification" />
      {status === "verification-link-sent" && (
        <div className="mb-4 text-sm font-medium text-green-600">
          A new verification link has been sent to the email address you
          provided during registration.
        </div>
      )}

      <Form
        method="post"
        action={route("verification.send")}
        className="flex items-center justify-between mt-4"
      >
        {({ processing }) => (
          <>
            <Button isPending={processing} type="submit">
              {processing && <Loader />}
              Resend Verification Email
            </Button>

            <Link
              href="/logout"
              routerOptions={{
                method: "post",
              }}
            >
              Log Out
            </Link>
          </>
        )}
      </Form>
    </>
  );
}

VerifyEmail.layout = (page: any) => (
  <AuthLayout
    header="Verify email"
    description="
                Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                link we just emailed to you? If you didn't receive the email, we will gladly send you another."
    children={page}
  />
);
