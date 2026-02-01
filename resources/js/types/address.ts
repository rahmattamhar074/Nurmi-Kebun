export interface Address {
  id?: number;
  name: string;
  recipient_name: string;
  phone: string;
  province_id: number;
  province_name: string;
  city_id: number;
  city_name: string;
  subdistrict_id?: number;
  subdistrict_name?: string;
  postal_code: string;
  full_address: string;
  is_default: boolean;
  is_active?: boolean;
  formatted_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddressFormData {
  name: string;
  recipient_name: string;
  phone: string;
  province_id: string | number;
  province_name: string;
  city_id: string | number;
  city_name: string;
  subdistrict_id: string | number;
  subdistrict_name: string;
  postal_code: string;
  full_address: string;
  is_default: boolean;
}

export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  type: string;
  postal_code?: string;
  province_id: number;
}

export interface Subdistrict {
  id: number;
  name: string;
  city_id: number;
}
