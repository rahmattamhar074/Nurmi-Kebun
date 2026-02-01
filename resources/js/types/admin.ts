export interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  email_verified_at: string | null;
  role: string;
  gravatar: string;
}

export interface AdminFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}
