"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AreaChart } from "@/components/ui/area-charts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartBarIcon, BanknotesIcon } from "@heroicons/react/24/outline";

interface ChartDataPoint {
  date: string;
  orders: number;
  revenue: number;
}

interface ChartSectionProps {
  data: ChartDataPoint[];
}

export function ChartSection({ data }: ChartSectionProps) {
  const [selectedMetric, setSelectedMetric] = useState<"orders" | "revenue">(
    "orders"
  );

  const chartConfig = {
    [selectedMetric]: {
      label: selectedMetric === "orders" ? "Orders" : "Revenue",
      color: "var(--primary)",
    },
  };

  const formatValue = (value: number) => {
    if (selectedMetric === "revenue") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    }
    return value.toString();
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {selectedMetric === "orders" ? "Orders" : "Revenue"} Overview
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Last 7 days performance
            </p>
          </div>
          <ToggleGroup
            size="sm"
            selectionMode="single"
            selectedKeys={[selectedMetric]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as "orders" | "revenue";
              if (selected) setSelectedMetric(selected);
            }}
          >
            <ToggleGroupItem
              id="orders"
              className={"flex items-center gap-x-2 rounded-none"}
            >
              <ChartBarIcon className="h-4 w-4" />
              Orders
            </ToggleGroupItem>
            <ToggleGroupItem
              id="revenue"
              className={"flex items-center gap-x-2 rounded-none"}
            >
              <BanknotesIcon className="h-4 w-4" />
              Revenue
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <AreaChart
          data={data}
          dataKey="date"
          config={chartConfig}
          valueFormatter={formatValue}
          hideYAxis={false}
          hideXAxis={false}
          hideGridLines={false}
          legend={false}
          chartProps={{
            margin: { top: 5, right: 10, left: 20, bottom: 0 },
          }}
        />
      </CardContent>
    </Card>
  );
}
