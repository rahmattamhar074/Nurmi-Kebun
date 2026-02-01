"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DateRangePicker,
  DateRangePickerTrigger,
} from "@/components/ui/date-range-picker";
import { IconChevronDown } from "@intentui/icons";
import type { DateRange } from "react-aria-components";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import { Label } from "@/components/ui/field";
import {
  DocumentChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

interface ExportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const generateMonthOptions = () => {
  const months = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    months.push({ value, label });
  }

  return months;
};

const monthOptions = generateMonthOptions();

export function ExportDialog({ isOpen, onOpenChange }: ExportDialogProps) {
  const [period, setPeriod] = useState<string>(monthOptions[0].value);
  const [isCustom, setIsCustom] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (period === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setDateRange(null);
      setError("");
    }
  }, [period]);

  const validateDateRange = (): boolean => {
    if (!isCustom) return true;

    if (!dateRange?.start || !dateRange?.end) {
      setError("Please select both start and end dates");
      return false;
    }

    const start = new Date(
      dateRange.start.year,
      dateRange.start.month - 1,
      dateRange.start.day
    );
    const end = new Date(
      dateRange.end.year,
      dateRange.end.month - 1,
      dateRange.end.day
    );
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      setError("Date range cannot exceed 30 days");
      return false;
    }

    setError("");
    return true;
  };

  const handleExport = (type: "excel" | "pdf") => {
    if (!validateDateRange()) return;

    const params: Record<string, string> = {};

    if (isCustom && dateRange?.start && dateRange?.end) {
      params.start_date = `${dateRange.start.year}-${String(
        dateRange.start.month
      ).padStart(2, "0")}-${String(dateRange.start.day).padStart(2, "0")}`;
      params.end_date = `${dateRange.end.year}-${String(
        dateRange.end.month
      ).padStart(2, "0")}-${String(dateRange.end.day).padStart(2, "0")}`;
    } else {
      params.period = period;
    }

    const route =
      type === "excel"
        ? window.route("dashboard.reports.export.excel", params)
        : window.route("dashboard.reports.export.pdf", params);

    window.location.href = route;
    onOpenChange(false);
  };

  return (
    <DynamicDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Export Reports"
      description="Select a period to export completed transaction reports"
    >
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            htmlFor="period"
          >
            Period
          </label>
          <Select
            name="period"
            value={period}
            onChange={(key) =>
              setPeriod(key?.toString() || monthOptions[0].value)
            }
          >
            <SelectTrigger className="flex justify-between items-center w-full">
              {isCustom
                ? "Custom Range"
                : monthOptions.find((opt) => opt.value === period)?.label ||
                  monthOptions[0].label}
              <IconChevronDown className="group-open/select:rotate-180 transition-transform" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} id={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              <SelectItem key="custom" id="custom">
                Custom Range
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isCustom && (
          <div>
            <DateRangePicker
              isRequired
              value={dateRange}
              onChange={setDateRange}
              aria-label="Select date range"
              className="mb-2"
              isDateUnavailable={(date) => {
                if (!dateRange?.start) return false;

                const startDate = new Date(
                  dateRange.start.year,
                  dateRange.start.month - 1,
                  dateRange.start.day
                );
                const maxDate = new Date(startDate);
                maxDate.setDate(maxDate.getDate() + 30);

                const currentDate = new Date(
                  date.year,
                  date.month - 1,
                  date.day
                );

                return currentDate > maxDate;
              }}
            >
              <Label>Date Range (Max 30 days)</Label>
              <DateRangePickerTrigger />
            </DateRangePicker>
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            intent="primary"
            onPress={() => handleExport("excel")}
            className="flex items-center gap-x-2"
          >
            <DocumentChartBarIcon className="text-white" />
            Export to Excel
          </Button>
          <Button
            intent="secondary"
            onPress={() => handleExport("pdf")}
            className="flex items-center gap-x-2"
          >
            <DocumentTextIcon className="text-white" />
            Export to PDF
          </Button>
        </div>
      </div>
    </DynamicDialog>
  );
}
