import { Head, useForm } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import SettingsLayout from "@/pages/settings/settings-layout";
import { FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const title = "Change Password";

export default function Password() {
  const { data, setData, put, errors, reset, processing, recentlySuccessful } =
    useForm({
      current_password: "",
      password: "",
      password_confirmation: "",
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
      },
      onError: () => {
        if (errors.password) {
          reset("password", "password_confirmation");
        }

        if (errors.current_password) {
          reset("current_password");
        }
      },
    });
  };

  return (
    <>
      <Head title={title} />
      <h1 className="sr-only">{title}</h1>
      <Card>
        <Card.Header>
          <Card.Title>{title}</Card.Title>
          <Card.Description>
            Ensure your account is using a long, random password to stay secure.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Form
            validationErrors={errors}
            onSubmit={submit}
            className="max-w-lg space-y-6"
          >
            <TextField isRequired name="current_password">
              <Label>Current Password</Label>
              <Input
                name="current_password"
                type="password"
                value={data.current_password}
                onChange={(e) => setData("current_password", e.target.value)}
                autoComplete="current-password"
                autoFocus
              />
              <FieldError>{errors.current_password}</FieldError>
            </TextField>

            <TextField isRequired name="password">
              <Label>New Password</Label>
              <Input
                name="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                autoComplete="new-password"
              />
              <FieldError>{errors.password}</FieldError>
            </TextField>

            <TextField isRequired name="password_confirmation">
              <Label>Confirm Password</Label>
              <Input
                name="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData("password_confirmation", e.target.value)
                }
                autoComplete="new-password"
              />
              <FieldError>{errors.password_confirmation}</FieldError>
            </TextField>

            <div className="flex items-center gap-4">
              <Button type="submit" isDisabled={processing}>
                Save
              </Button>

              {recentlySuccessful && (
                <p className="text-muted-fg text-sm">Saved.</p>
              )}
            </div>
          </Form>
        </Card.Content>
      </Card>
    </>
  );
}

Password.layout = (page: any) => <SettingsLayout children={page} />;
