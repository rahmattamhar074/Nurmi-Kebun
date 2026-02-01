import {
  Pagination,
  PaginationFirst,
  PaginationLabel,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  PaginationSection,
} from "@/components/ui/pagination";

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  data: any[];
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
}

interface StorePaginationProps {
  paginationData: PaginationData;
  onPageChange: (page: number) => void;
}

export default function StorePagination({
  paginationData,
  onPageChange,
}: StorePaginationProps) {
  const { current_page, last_page, total, from, to } = paginationData;

  if (last_page <= 1 || total === 0) {
    return null;
  }

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handlePreviousPage = () => {
    if (current_page > 1) {
      onPageChange(current_page - 1);
    }
  };

  const handleNextPage = () => {
    if (current_page < last_page) {
      onPageChange(current_page + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(last_page);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4">
      <div className="text-sm text-neutral-700 dark:text-neutral-300 shrink-0">
        {from && to ? (
          <>
            Showing {from} to {to} of {total} results
          </>
        ) : (
          <>Showing {total} results</>
        )}
      </div>
      <div>
        <Pagination className="w-fit">
          <PaginationList>
            <PaginationFirst
              onPress={handleFirstPage}
              isDisabled={current_page <= 1}
            />
            <PaginationPrevious
              onPress={handlePreviousPage}
              isDisabled={current_page <= 1}
            />
            <PaginationSection className="rounded-lg border px-3 *:min-w-4">
              <PaginationLabel>{current_page}</PaginationLabel>
              <PaginationLabel className="text-muted-fg">/</PaginationLabel>
              <PaginationLabel>{last_page}</PaginationLabel>
            </PaginationSection>
            <PaginationNext
              onPress={handleNextPage}
              isDisabled={current_page >= last_page}
            />
            <PaginationLast
              onPress={handleLastPage}
              isDisabled={current_page >= last_page}
            />
          </PaginationList>
        </Pagination>
      </div>
    </div>
  );
}

export function SimplePagination({
  paginationData,
  onPageChange,
}: StorePaginationProps) {
  const { current_page, last_page, total } = paginationData;

  if (last_page <= 1 || total === 0) {
    return null;
  }

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handlePreviousPage = () => {
    if (current_page > 1) {
      onPageChange(current_page - 1);
    }
  };

  const handleNextPage = () => {
    if (current_page < last_page) {
      onPageChange(current_page + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(last_page);
  };

  return (
    <Pagination>
      <PaginationList>
        <PaginationFirst
          onPress={handleFirstPage}
          isDisabled={current_page <= 1}
        />
        <PaginationPrevious
          onPress={handlePreviousPage}
          isDisabled={current_page <= 1}
        />
        <PaginationSection className="rounded-lg border px-3 *:min-w-4">
          <PaginationLabel>{current_page}</PaginationLabel>
          <PaginationLabel className="text-muted-fg">/</PaginationLabel>
          <PaginationLabel>{last_page}</PaginationLabel>
        </PaginationSection>
        <PaginationNext
          onPress={handleNextPage}
          isDisabled={current_page >= last_page}
        />
        <PaginationLast
          onPress={handleLastPage}
          isDisabled={current_page >= last_page}
        />
      </PaginationList>
    </Pagination>
  );
}
