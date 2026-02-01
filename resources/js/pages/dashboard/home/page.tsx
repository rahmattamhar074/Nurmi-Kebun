import { Head } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";
import DashboardLayout from "@/layouts/dashboard-layout";
import { CardStatistic } from "./components/card-statistic";
import { ChartSection } from "./components/chart-section";
import { OrdersTable } from "./components/orders-table";
import { TopProductsTable } from "./components/top-products-table";
import {
  ShoppingCartIcon,
  CubeIcon,
  UsersIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

interface Statistics {
  orders_today: number;
  total_products: number;
  total_customers: number;
  revenue_today: number;
}

interface ChartDataPoint {
  date: string;
  orders: number;
  revenue: number;
}

interface PendingOrder {
  status: string;
  label: string;
  count: number;
}

interface TopProduct {
  product_id: number;
  product_name: string;
  units_sold: number;
  revenue: number;
  average_rating: number;
}

interface DashboardProps extends SharedData {
  statistics: Statistics;
  chartData: ChartDataPoint[];
  pendingOrders: PendingOrder[];
  topProducts: TopProduct[];
}

export default function Dashboard({
  auth,
  statistics,
  chartData,
  pendingOrders,
  topProducts,
}: DashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statisticsData = [
    {
      icon: ShoppingCartIcon,
      label: "Orders Today",
      value: statistics.orders_today,
      description: "New orders received today",
    },
    {
      icon: CubeIcon,
      label: "Total Products",
      value: statistics.total_products,
      description: "Products in inventory",
    },
    {
      icon: UsersIcon,
      label: "Total Customers",
      value: statistics.total_customers,
      description: "Registered customers",
    },
    {
      icon: BanknotesIcon,
      label: "Revenue Today",
      value: formatCurrency(statistics.revenue_today),
      description: "Total sales today",
    },
  ];

  return (
    <>
      <Head title="Dashboard" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance font-semibold text-lg/6">Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Overview of your business performance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statisticsData.map((stat, index) => (
            <CardStatistic key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <ChartSection data={chartData} />
          </div>
          <div className="lg:col-span-6">
            <OrdersTable orders={pendingOrders} />
          </div>
          <div className="lg:col-span-6">
            <TopProductsTable products={topProducts} />
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = (page: any) => <DashboardLayout children={page} />;
