import { Head, Form } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/text-field"
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import AuthLayout from "@/layouts/auth-layout"

export default function ConfirmPassword() {
  return (
    <>
      <Head title="Confirm Password" />

      <div className="mb-4 text-sm text-muted-fg">
        This is a secure area of the application. Please confirm your password before continuing.
      </div>

      <Form method="post" action={route("password.confirm")} resetOnSuccess={["password"]}>
        {({ processing, errors }) => (
          <>
            <TextField isRequired name="password">
              <Label>Password</Label>
              <Input name="password" type="password" autoComplete="current-password" autoFocus />
              <FieldError>{errors.password}</FieldError>
            </TextField>

            <div className="flex items-center justify-end mt-4">
              <Button isPending={processing}>
                {processing && <Loader />}
                Confirm
              </Button>
            </div>
          </>
        )}
      </Form>
    </>
  )
}

ConfirmPassword.layout = (page: any) => <AuthLayout header="Confirm password" children={page} />
