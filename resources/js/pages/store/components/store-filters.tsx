"use client";

import { Card } from "@/components/ui/card";
import { TextField } from "@/components/ui/text-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { ProductCategory } from "@/types/product";
import {
  IconSearch,
  IconFilter,
  IconSortAsc,
  IconSortDesc,
} from "@intentui/icons";
import { Button } from "@/components/ui/button";

interface StoreFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  categories: ProductCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  direction: string;
  onDirectionChange: (direction: string) => void;
  resetFilters: () => void;
}

export function StoreFilters({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  sort,
  onSortChange,
  direction,
  onDirectionChange,
  resetFilters,
}: StoreFiltersProps) {
  const sortOptions = [
    { value: "created_at", label: "Newest First" },
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <IconSearch className="h-5 w-5 text-neutral-500" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">
            Search
          </h3>
        </div>
        <TextField name="search">
          <Input
            name="search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </TextField>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <IconFilter className="h-5 w-5 text-neutral-500" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">
            Categories
          </h3>
        </div>
        <Select
          placeholder="All Categories"
          selectedKey={selectedCategory || ""}
          onSelectionChange={(value) => onCategoryChange(value as string)}
        >
          <SelectTrigger>
            {selectedCategory
              ? categories.find((c) => c.id.toString() === selectedCategory)
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
            onSelectionChange={(value) => onSortChange(value as string)}
          >
            <SelectTrigger>
              {sortOptions.find((option) => option.value === sort)?.label ||
                "Sort by..."}
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
            onSelectionChange={(value) => onDirectionChange(value as string)}
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

      {(search ||
        selectedCategory ||
        sort !== "created_at" ||
        direction !== "desc") && (
        <Card className="p-4">
          <Button
            type="button"
            intent="danger"
            onClick={() => {
              resetFilters();
            }}
          >
            Clear All Filters
          </Button>
        </Card>
      )}
    </div>
  );
}

export default StoreFilters;
