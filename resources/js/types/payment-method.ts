export interface PaymentMethod {
  id: number;
  name: string;
  type: "bank" | "e_wallet";
  account_number: string;
  account_holder_name: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodFormData {
  account_number: string;
  account_holder_name: string;
}

export const PAYMENT_METHOD_TYPES = [
  { value: "bank", label: "Bank Transfer" },
  { value: "e_wallet", label: "E-Wallet" },
] as const;
