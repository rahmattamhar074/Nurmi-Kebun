import { Form, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { TextField } from "@/components/ui/text-field";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import AuthLayout from "@/layouts/auth-layout";
import { Label } from "@/components/ui/field";

export default function Register() {
  return (
    <>
      <Head title="Register" />

      <Form
        method="post"
        action="/register"
        resetOnSuccess={["password", "password_confirmation"]}
        disableWhileProcessing
        className="flex flex-col gap-y-4"
      >
        {({ processing, errors }) => {
          console.log(errors);
          return (
            <>
              <TextField isRequired name="name">
                <Label>Name</Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  autoFocus
                />
                <ErrorField>{errors.name}</ErrorField>
              </TextField>

              <TextField isRequired name="email">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@domain.com"
                  autoComplete="username"
                />
                <ErrorField>{errors.email}</ErrorField>
              </TextField>

              <TextField isRequired name="phone">
                <Label>Phone Number</Label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="081234567890"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]*"
                  minLength={9}
                  maxLength={15}
                  onKeyDown={(e) => {
                    if (
                      [
                        "Backspace",
                        "Delete",
                        "Tab",
                        "Escape",
                        "Enter",
                        "ArrowLeft",
                        "ArrowRight",
                      ].includes(e.key)
                    ) {
                      return;
                    }
                    if (
                      (e.ctrlKey || e.metaKey) &&
                      ["a", "c", "v", "x"].includes(e.key.toLowerCase())
                    ) {
                      return;
                    }
                    if (!/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <ErrorField>{errors.phone}</ErrorField>
              </TextField>

              <TextField isRequired name="password">
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Shhh, it's secret"
                  autoComplete="new-password"
                />
                <ErrorField>{errors.password}</ErrorField>
              </TextField>

              <TextField isRequired name="password_confirmation">
                <Label>Confirm Password</Label>
                <Input
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <ErrorField>{errors.password_confirmation}</ErrorField>
              </TextField>
              <Button type="submit" className="w-full" isPending={processing}>
                {processing && <Loader />}
                Register
              </Button>
              <div className="justify-center flex items-center gap-x-1">
                <p> Already registered?</p>
                <Link href="/login" className="sm:text-sm text-primary">
                  Log in
                </Link>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}

Register.layout = (page: React.ReactNode) => (
  <AuthLayout
    header="Register"
    description="Create an account to get started."
    children={page}
  />
);

export const ErrorField = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-red-500 text-sm">{children}</div>;
};
