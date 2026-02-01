import { Head, useForm, usePage } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
import { FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import SettingsLayout from "@/pages/settings/settings-layout";

interface Props {
  mustVerifyEmail: boolean;
  status?: string;
}

const title = "Profile";

export default function Profile({ mustVerifyEmail, status }: Props) {
  const { auth } = usePage<SharedData>().props;
  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: auth.user.name ?? "",
      email: auth.user.email ?? "",
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route("profile.update"), {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title={title} />
      <h1 className="sr-only">{title}</h1>
      <Card>
        <Card.Header>
          <Card.Title>Profile Information</Card.Title>
          <Card.Description>
            Update your account's profile information and email address.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Form
            validationErrors={errors}
            onSubmit={submit}
            className="max-w-lg space-y-6"
          >
            <TextField isRequired name="name">
              <Label>Name</Label>
              <Input
                name="name"
                type="text"
                value={data.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData("name", e.target.value)
                }
                autoComplete="name"
                autoFocus
              />
              <FieldError>{errors.name}</FieldError>
            </TextField>

            <TextField isRequired name="email">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={data.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData("email", e.target.value)
                }
                autoComplete="email"
              />
              <FieldError>{errors.email}</FieldError>
            </TextField>

            {mustVerifyEmail && auth.user.email_verified_at === null && (
              <div>
                <p className="mt-2 text-sm">
                  Your email address is unverified.
                  <Link
                    href="/email/verification-notification"
                    routerOptions={{
                      method: "post",
                    }}
                  >
                    Click here to re-send the verification email.
                  </Link>
                </p>

                {status === "verification-link-sent" && (
                  <div className="mt-2 font-medium text-green-600 text-sm">
                    A new verification link has been sent to your email address.
                  </div>
                )}
              </div>
            )}

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

Profile.layout = (page: any) => <SettingsLayout children={page} />;
