import { Head, usePage, router } from "@inertiajs/react";
import { ReviewTable } from "./components/review-table";
import type { SharedData } from "@/types/shared";
import type { Review } from "@/types/review";
import DashboardLayout from "@/layouts/dashboard-layout";
import { convertLaravelPagination } from "@/lib/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { useState, useEffect } from "react";
import { IconChevronDown } from "@intentui/icons";

interface PageProps extends SharedData {
  reviews: any;
  filters?: Record<string, any>;
}

const ScoreOptions = [
  { id: "", name: "All Ratings" },
  { id: "5", name: "5 Stars" },
  { id: "4", name: "4 Stars" },
  { id: "3", name: "3 Stars" },
  { id: "2", name: "2 Stars" },
  { id: "1", name: "1 Star" },
];

export default function ReviewIndex() {
  const { reviews, filters = {} } = usePage<PageProps>().props;
  const { data: reviewData, pagination } = convertLaravelPagination(reviews);

  const [scoreFilter, setScoreFilter] = useState<string>(
    filters.score?.toString() || ""
  );
  const [search, setSearch] = useState<string>(filters.search || "");

  const handleFilterChange = (newFilters: Record<string, any>) => {
    const finalParams = { ...filters, ...newFilters, page: 1 };

    router.get(window.location.pathname, finalParams, {
      preserveState: true,
      replace: true,
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== (filters.search || "")) {
        handleFilterChange({ search: search || undefined });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleScoreChange = (value: React.Key | null) => {
    const newValue = value?.toString() || "";
    setScoreFilter(newValue);
    handleFilterChange({ score: newValue || undefined });
  };

  return (
    <>
      <Head title="Reviews" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance font-semibold text-lg/6">Reviews</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              View all customer reviews and ratings
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-x-4 items-center py-4">
          <div className="min-w-40">
            <Select value={scoreFilter} onChange={handleScoreChange}>
              <SelectTrigger className="flex justify-between items-center w-full">
                {scoreFilter
                  ? ScoreOptions.find((option) => option.id === scoreFilter)
                      ?.name || "All Ratings"
                  : "All Ratings"}
                <IconChevronDown className="group-open/select:rotate-180 transition-transform" />
              </SelectTrigger>
              <SelectContent>
                {ScoreOptions.map((option) => (
                  <SelectItem key={option.id} id={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="max-w-lg w-full">
            <SearchField aria-label="Search" className={"w-full"}>
              <SearchInput
                placeholder="Search by order number..."
                className={"w-full"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchField>
          </div>
        </div>
        <ReviewTable reviews={reviewData as Review[]} pagination={pagination} />
      </div>
    </>
  );
}

ReviewIndex.layout = (page: any) => (
  <DashboardLayout
    children={page}
    breadcrumbItems={[
      {
        label: "Dashboard",
        href: "/",
      },
      {
        label: "Reviews",
        href: "/dashboard/reviews",
      },
    ]}
  />
);
