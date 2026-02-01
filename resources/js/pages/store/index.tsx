import { Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { ProductGrid, StoreFilters, StorePagination } from "./components";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IconFilter, IconSortAsc, IconSortDesc } from "@intentui/icons";
import { Button, buttonStyles } from "@/components/ui/button";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
interface StorePageProps {
  products: {
    data: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
  };
  categories: any[];
  filters?: Record<string, any>;
  [key: string]: any;
}

export default function Store() {
  const {
    products,
    categories,
    filters = {},
  } = usePage<StorePageProps>().props;

  const [search, setSearch] = useState<string>(filters.search || "");
  const [category, setCategory] = useState<string>(
    filters.category?.toString() || ""
  );
  const [sort, setSort] = useState<string>(filters.sort || "created_at");
  const [direction, setDirection] = useState<string>(
    filters.direction || "desc"
  );

  const handleFilterChange = (newFilters: Record<string, any>) => {
    // Filter out null and undefined values
    const params = Object.fromEntries(
      Object.entries({ ...filters, ...newFilters, page: 1 }).filter(
        ([_, value]) => value != null
      )
    );

    router.get("/store", params, {
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

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    handleFilterChange({ category: newCategory || undefined });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    handleFilterChange({ sort: newSort });
  };

  const handleDirectionChange = (newDirection: string) => {
    setDirection(newDirection);
    handleFilterChange({ direction: newDirection });
  };

  const handlePageChange = (page: number) => {
    const params = Object.fromEntries(
      Object.entries({ ...filters, page }).filter(([_, value]) => value != null)
    );

    router.get("/store", params, {
      preserveState: true,
      replace: true,
    });
  };

  const sortOptions = [
    { value: "created_at", label: "Newest First" },
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
  ];

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setSort("created_at");
    setDirection("desc");
    router.get("/store", {}, { preserveState: false, replace: true });
  };

  return (
    <>
      <Head title="Store" />
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Our Store
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Discover our amazing collection of products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <StoreFilters
              search={search}
              onSearchChange={setSearch}
              categories={categories}
              selectedCategory={category}
              onCategoryChange={handleCategoryChange}
              sort={sort}
              onSortChange={handleSortChange}
              direction={direction}
              onDirectionChange={handleDirectionChange}
              resetFilters={resetFilters}
            />
          </div>
          <div className="lg:hidden flex items-center gap-x-3">
            <SearchField aria-label="Search" className={"w-full"}>
              <SearchInput
                placeholder="Search products..."
                className={"w-full"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchField>
            <Drawer>
              <DrawerTrigger className={buttonStyles({ intent: "outline" })}>
                <IconFilter className="text-primary stroke-primary" />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter</DrawerTitle>
                  <DrawerDescription>
                    Refine your product search with filters.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <IconFilter className="h-5 w-5 text-neutral-500" />
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        Categories
                      </h3>
                    </div>
                    <Select
                      placeholder="All Categories"
                      selectedKey={category || ""}
                      onSelectionChange={(value) =>
                        handleCategoryChange(value as string)
                      }
                    >
                      <SelectTrigger>
                        {category
                          ? categories.find((c) => c.id.toString() === category)
                              ?.name || "All Categories"
                          : "All Categories"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem id="" textValue="All Categories">
                          All Categories
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            id={category.id.toString()}
                            textValue={category.name}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      {direction === "asc" ? (
                        <IconSortAsc className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <IconSortDesc className="h-5 w-5 text-neutral-500" />
                      )}
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        Sort By
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <Select
                        placeholder="Sort by..."
                        selectedKey={sort}
                        onSelectionChange={(value) =>
                          handleSortChange(value as string)
                        }
                      >
                        <SelectTrigger>
                          {sortOptions.find((option) => option.value === sort)
                            ?.label || "Sort by..."}
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              id={option.value}
                              textValue={option.label}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        placeholder="Direction"
                        selectedKey={direction}
                        onSelectionChange={(value) =>
                          handleDirectionChange(value as string)
                        }
                      >
                        <SelectTrigger>
                          {direction === "asc" ? "Low to High" : "High to Low"}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem id="asc" textValue="Low to High">
                            Low to High
                          </SelectItem>
                          <SelectItem id="desc" textValue="High to Low">
                            High to Low
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                </DrawerBody>
                <DrawerFooter>
                  <Button
                    onClick={() => {
                      resetFilters();
                    }}
                  >
                    Reset
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="flex-1">
            <ProductGrid products={products.data} />
            <div className="mt-8">
              <StorePagination
                paginationData={products}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Store.layout = (page: any) => <AppLayout children={page} />;
