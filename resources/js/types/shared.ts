import type { Config } from "ziggy-js";
import type { Auth } from "./auth";
import type {
  PaginatedCategories,
  PaginatedProducts,
  ProductCategory,
} from "./product";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "message";

export type FlashProps = {
  type: ToastType;
  message: string;
};

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  flash: FlashProps;

  categories?: PaginatedCategories | ProductCategory[];
  products?: PaginatedProducts;

  [key: string]: unknown;
}
