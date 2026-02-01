export interface Product {
  id: number;
  product_code: string;
  name: string;
  thumbnail: string | null;
  images: string[] | null;
  description: string | null;
  price: number;
  stock: number;
  weight: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  categories?: ProductCategory[];
  product_category_id?: number;
  product_category?: ProductCategory;
  thumbnail_url?: string | null;
  image_urls?: string[];
  reviews_count?: number;
  reviews_avg_score?: number;
  total_sold?: number;
  category_names?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  products?: Product[];
  products_count?: number;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export type PaginatedCategories = PaginatedData<ProductCategory>;
export type PaginatedProducts = PaginatedData<Product>;
