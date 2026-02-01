import { Head, Form } from "@inertiajs/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/components/ui/link";
import { TextField } from "@/components/ui/text-field";
import { Loader } from "@/components/ui/loader";
import AuthLayout from "@/layouts/auth-layout";
import { Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorField } from "./register";

interface LoginProps {
  status: string;
  canResetPassword: boolean;
}

export default function Login(args: LoginProps) {
  const { status, canResetPassword } = args;
  return (
    <>
      <Head title="Log in" />

      {status && (
        <div className="mb-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {status}
        </div>
      )}

      <Form
        method="post"
        action="/login"
        resetOnSuccess={["password"]}
        className="flex flex-col gap-y-4"
      >
        {({ processing, errors }) => (
          <>
            <TextField isRequired name="email">
              <Label>Email</Label>
              <Input name="email" id="email" type="email" />
              <ErrorField>{errors.email}</ErrorField>
            </TextField>
            <TextField isRequired name="password">
              <Label>Password</Label>
              <Input name="password" id="password" type="password" />
              <ErrorField>{errors.password}</ErrorField>
            </TextField>
            <div className="flex items-center justify-between">
              <Checkbox name="remember">Remember me</Checkbox>
              {canResetPassword && (
                <Link href="/forgot-password" className="sm:text-sm">
                  Forgot your password?
                </Link>
              )}
            </div>
            <Button isPending={processing} type="submit">
              {processing && <Loader />}
              Log in
            </Button>
            <div className="flex items-center justify-center gap-x-1">
              <p>Dont have account? </p>
              <Link href="/register" className="sm:text-sm text-primary">
                Register
              </Link>
            </div>
          </>
        )}
      </Form>
    </>
  );
}

Login.layout = (page: React.ReactNode) => (
  <AuthLayout
    children={page}
    header={"Login"}
    description={"Enter your email and password to log in."}
  />
);
