import { Head, Form } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import AuthLayout from "@/layouts/auth-layout";
import { ErrorField } from "./register";

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword(args: ResetPasswordProps) {
  const { token, email } = args;

  return (
    <>
      <Head title="Reset Password" />

      <Form
        className="space-y-6"
        method="post"
        transform={(data) => ({ ...data, token, email })}
        action={route("password.store")}
      >
        {({ processing, errors }) => (
          <>
            <TextField isRequired name="email">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                readOnly
                className={"bg-muted"}
              />
              <ErrorField>{errors.email}</ErrorField>
            </TextField>

            <TextField isRequired name="password">
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                autoComplete="new-password"
                autoFocus
              />
              <ErrorField>{errors.password}</ErrorField>
            </TextField>

            <TextField isRequired name="password_confirmation">
              <Label>Confirm Password</Label>
              <Input
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
              />
              <ErrorField>{errors.password_confirmation}</ErrorField>
            </TextField>

            <div className="flex items-center justify-end mt-4">
              <Button type="submit" className="ml-4" isPending={processing}>
                {processing && <Loader />}
                Reset Password
              </Button>
            </div>
          </>
        )}
      </Form>
    </>
  );
}

ResetPassword.layout = (page: any) => (
  <AuthLayout
    header="Reset Password"
    description="Please enter your email address and new password to reset your password."
    children={page}
  />
);
