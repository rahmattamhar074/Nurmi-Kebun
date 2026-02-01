import { Head, Form } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/text-field"
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import AuthLayout from "@/layouts/auth-layout"

interface ForgotPasswordProps {
  status: string
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
  return (
    <>
      <Head title="Forgot Password" />
      {status && <div className="text-sm font-medium text-success">{status}</div>}

      <Form className="mt-4 space-y-4" action={route("password.email")} method="post">
        {({ processing, errors }) => (
          <>
            <TextField isRequired name="email">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="Enter your email address"
              />
              <FieldError>{errors.email}</FieldError>
            </TextField>

            <div className="flex items-center justify-end">
              <Button type="submit" className="w-full" isPending={processing}>
                {processing && <Loader />}
                Email Password Reset Link
              </Button>
            </div>
          </>
        )}
      </Form>
    </>
  )
}

ForgotPassword.layout = (page: any) => (
  <AuthLayout
    header="Forgot Password"
    description="
                    Forgot your password? No problem. Just let us know your email address and we will email you a password
                    reset link that will allow you to choose a new one."
    children={page}
  />
)
