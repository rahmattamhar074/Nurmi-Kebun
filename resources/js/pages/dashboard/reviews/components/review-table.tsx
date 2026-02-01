"use client";

import { router } from "@inertiajs/react";
import Datatable, { type Column } from "@/components/modules/datatable";
import type { Review } from "@/types/review";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import { StarIcon } from "@heroicons/react/20/solid";

interface ReviewTableProps {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export function ReviewTable({
  reviews,
  pagination,
  loading = false,
  onPageChange,
}: ReviewTableProps) {
  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`size-4 ${
              star <= score
                ? "text-yellow-400 fill-yellow-400"
                : "text-neutral-300 dark:text-neutral-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const getScoreBadge = (score: number) => {
    if (score >= 4) return <Badge intent="success">{score}/5</Badge>;
    if (score >= 3) return <Badge intent="primary">{score}/5</Badge>;
    if (score >= 2) return <Badge intent="warning">{score}/5</Badge>;
    return <Badge intent="danger">{score}/5</Badge>;
  };

  const columns: Column<Review>[] = [
    {
      key: "order_number",
      label: "Order Number",
      sortable: false,
      width: 150,
      render: (value) => (
        <span className="font-mono text-sm text-neutral-700 dark:text-neutral-300">
          {value}
        </span>
      ),
    },
    {
      key: "product_name",
      label: "Product",
      sortable: false,
      resizable: true,
      width: 250,
      isRowHeader: true,
      render: (value) => (
        <div className="font-medium text-neutral-900 dark:text-white">
          {value}
        </div>
      ),
    },
    {
      key: "user_name",
      label: "Customer",
      sortable: false,
      width: 180,
      render: (value) => (
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {value}
        </span>
      ),
    },
    {
      key: "score",
      label: "Rating",
      sortable: false,
      width: 150,
      className: "text-center",
      render: (_value, review) => (
        <div className="flex flex-col items-center gap-1">
          {renderStars(review.score)}
          {getScoreBadge(review.score)}
        </div>
      ),
    },
    {
      key: "review",
      label: "Review",
      sortable: false,
      resizable: true,
      width: 350,
      render: (value) => (
        <div className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {value || (
            <span className="italic text-neutral-400">No review text</span>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      sortable: false,
      width: 150,
      render: (value) => (
        <div className="text-sm text-neutral-500 dark:text-neutral-300">
          {formatDate(new Date(value), "dd MMM yyyy")}
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      router.get(window.location.pathname, { page }, { preserveState: true });
    }
  };

  return (
    <Datatable
      data={reviews}
      columns={columns}
      pagination={pagination}
      loading={loading}
      onPageChange={handlePageChange}
      emptyMessage="No reviews found."
      striped
    />
  );
}
