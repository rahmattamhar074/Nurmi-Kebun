"use client";

import React from "react";
import {
  type TableProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationFirst,
  PaginationGap,
  PaginationInfo,
  PaginationItem,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  PaginationSection,
} from "@/components/ui/pagination";
import {
  ResizableTableContainer,
  type Selection,
  type SortDescriptor,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { IconInboxEmpty } from "@intentui/icons";

interface Column<T = any> {
  key: string;
  label: string | React.ReactNode;
  sortable?: boolean;
  resizable?: boolean;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  className?: string;
  width?: string | number;
  isRowHeader?: boolean;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
}

interface DatatableProps<T = any>
  extends Omit<
    TableProps,
    | "children"
    | "selectedKeys"
    | "onSelectionChange"
    | "sortDescriptor"
    | "onSortChange"
  > {
  data: T[];
  columns: Column<T>[];
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  showPagination?: boolean;
  showPaginationInfo?: boolean;
  paginationPosition?: "top" | "bottom" | "both";
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  onRowAction?: (key: React.Key) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
}

const generatePageNumbers = (
  currentPage: number,
  totalPages: number
): (number | "gap")[] => {
  const pages: (number | "gap")[] = [];
  const delta = 2;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > delta + 2) {
      pages.push("gap");
    }

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - delta - 1) {
      pages.push("gap");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }

  return pages;
};

const LoadingSkeleton = ({ columns }: { columns: Column[] }) => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {columns.map((column) => (
          <TableCell key={column.key} className="py-4">
            <div className="h-4 bg-muted animate-pulse rounded" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const EmptyState = ({
  message,
  columns,
}: {
  message: string;
  columns: Column[];
}) => (
  <TableRow>
    <TableCell colSpan={columns.length} className="text-center py-12">
      <div className="flex w-fit mx-auto gap-x-4 items-center">
        <IconInboxEmpty className="size-5" />
        <p className="text-base text-muted-fg">{message}</p>
      </div>
    </TableCell>
  </TableRow>
);

const Datatable = <T extends Record<string, any>>({
  data,
  columns,
  pagination,
  onPageChange,
  onSort,
  loading = false,
  emptyMessage = "No data available",
  className,
  showPagination = true,
  showPaginationInfo = true,
  paginationPosition = "bottom",
  selectionMode = "none",
  selectedKeys,
  onSelectionChange,
  onRowAction,
  sortDescriptor,
  onSortChange,
  ...tableProps
}: DatatableProps<T>) => {
  const columnKeyMap = React.useMemo(() => {
    const map = new Map<number, string>();
    columns.forEach((column, index) => {
      map.set(index, column.key);
    });
    return map;
  }, [columns]);

  const keyToIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    columns.forEach((column, index) => {
      map.set(column.key, index);
    });
    return map;
  }, [columns]);

  const reactAriaSortDescriptor = React.useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) {
      return undefined;
    }

    const columnKey = sortDescriptor.column.toString();
    const columnIndex = keyToIndexMap.get(columnKey);

    if (columnIndex === undefined) {
      return undefined;
    }

    const reactAriaId = `react-aria-${columnIndex + 1}`;

    return {
      column: reactAriaId,
      direction: sortDescriptor.direction,
    } as const;
  }, [sortDescriptor, keyToIndexMap]);

  const handleSortChange = (descriptor: SortDescriptor) => {
    if (onSort && descriptor.column) {
      const columnId = descriptor.column.toString();
      let actualColumnKey = columnId;

      if (columnId.startsWith("react-aria-")) {
        const match = columnId.match(/react-aria-(\d+)/);
        if (match) {
          const index = parseInt(match[1]) - 1;
          const mappedKey = columnKeyMap.get(index);
          if (mappedKey) {
            actualColumnKey = mappedKey;
          }
        }
      }

      const direction = descriptor.direction === "ascending" ? "asc" : "desc";
      onSort(actualColumnKey, direction);
    }

    if (onSortChange) {
      onSortChange(descriptor);
    }
  };

  const renderPagination = () => {
    if (!showPagination || !pagination) return null;

    const pages = generatePageNumbers(
      pagination.currentPage,
      pagination.totalPages
    );

    return (
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 w-fit ml-auto">
        {showPaginationInfo && (
          <PaginationInfo className="whitespace-nowrap">
            Showing <strong>{pagination.from}</strong> to{" "}
            <strong>{pagination.to}</strong> of{" "}
            <strong>{pagination.total}</strong> results
          </PaginationInfo>
        )}

        <Pagination className="flex justify-end w-fit">
          <PaginationList>
            <PaginationSection>
              <PaginationFirst
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.currentPage > 1) {
                    onPageChange?.(1);
                  }
                }}
                className={
                  pagination.currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.currentPage > 1) {
                    onPageChange?.(pagination.currentPage - 1);
                  }
                }}
                className={
                  pagination.currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationSection>

            <PaginationSection>
              {pages.map((page, index) =>
                page === "gap" ? (
                  <PaginationGap key={`gap-${index}`} />
                ) : (
                  <PaginationItem
                    key={page}
                    href="#"
                    isCurrent={page === pagination.currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(page);
                    }}
                  >
                    {page}
                  </PaginationItem>
                )
              )}
            </PaginationSection>

            <PaginationSection>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.currentPage < pagination.totalPages) {
                    onPageChange?.(pagination.currentPage + 1);
                  }
                }}
                className={
                  pagination.currentPage === pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
              <PaginationLast
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.currentPage < pagination.totalPages) {
                    onPageChange?.(pagination.totalPages);
                  }
                }}
                className={
                  pagination.currentPage === pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationSection>
          </PaginationList>
        </Pagination>
      </div>
    );
  };

  const hasResizableColumns = columns.some((column) => column.resizable);

  const renderTable = () => (
    <Table
      allowResize={hasResizableColumns}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      sortDescriptor={reactAriaSortDescriptor}
      onSortChange={handleSortChange}
      {...tableProps}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            key={column.key}
            allowsSorting={column.sortable}
            isResizable={column.resizable}
            isRowHeader={column.isRowHeader}
            className={column.className}
            style={
              column.width
                ? {
                    width:
                      typeof column.width === "number"
                        ? `${column.width}px`
                        : column.width,
                  }
                : undefined
            }
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>

      <TableBody>
        {loading ? (
          <LoadingSkeleton columns={columns} />
        ) : data.length === 0 ? (
          <EmptyState message={emptyMessage} columns={columns} />
        ) : (
          data.map((item, index) => (
            <TableRow
              key={item.id || index}
              onAction={
                onRowAction ? () => onRowAction(item.id || index) : undefined
              }
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render
                    ? column.render(item[column.key], item, index)
                    : item[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className={twMerge("space-y-4", className)}>
      {paginationPosition === "top" || paginationPosition === "both"
        ? renderPagination()
        : null}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        {hasResizableColumns ? (
          <ResizableTableContainer>{renderTable()}</ResizableTableContainer>
        ) : (
          renderTable()
        )}
      </div>

      {paginationPosition === "bottom" || paginationPosition === "both"
        ? renderPagination()
        : null}
    </div>
  );
};

export default Datatable;
export type { DatatableProps, Column, PaginationData };
