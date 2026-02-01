"use client";

import { router } from "@inertiajs/react";
import type { Order, OrderPagination } from "@/types/order";
import { OrderCard } from "./order-card";
import {
  Pagination,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  PaginationSection,
} from "@/components/ui/pagination";

interface OrderCardListProps {
  orders: Order[];
  pagination: OrderPagination;
  emptyMessage?: string;
}

export function OrderCardList({
  orders,
  pagination,
  emptyMessage = "No orders found.",
}: OrderCardListProps) {
  const handlePageChange = (page: number) => {
    router.get(
      window.location.pathname,
      { page },
      { preserveState: true, preserveScroll: true }
    );
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-fg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination>
            <PaginationList>
              <PaginationPrevious
                isDisabled={pagination.currentPage === 1}
                onPress={() => handlePageChange(pagination.currentPage - 1)}
              />
              <PaginationSection aria-label="Pagination Segment">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <PaginationItem
                    key={page}
                    isCurrent={page === pagination.currentPage}
                    onPress={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationItem>
                ))}
              </PaginationSection>
              <PaginationNext
                isDisabled={pagination.currentPage === pagination.totalPages}
                onPress={() => handlePageChange(pagination.currentPage + 1)}
              />
            </PaginationList>
          </Pagination>
        </div>
      )}
    </div>
  );
}
