export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  gravatar: string;
  email_verified_at: string | null;
  [key: string]: unknown;
}
