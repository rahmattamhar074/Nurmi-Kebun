import type { PaginationData } from "@/components/modules/datatable"
import type { PaginatedData } from "@/types/product"

/**
 * Converts Laravel pagination format to Datatable pagination format
 */
export function convertLaravelPagination<T>(
  laravelData: PaginatedData<T>
): { data: T[]; pagination: PaginationData } {
  return {
    data: laravelData.data,
    pagination: {
      currentPage: laravelData.current_page,
      totalPages: laravelData.last_page,
      perPage: laravelData.per_page,
      total: laravelData.total,
      from: laravelData.from || 0,
      to: laravelData.to || 0,
    },
  }
}