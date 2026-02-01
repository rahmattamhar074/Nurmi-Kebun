import { Head, usePage } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";
import type { PaymentMethod } from "@/types/payment-method";
import DashboardLayout from "@/layouts/dashboard-layout";

import { PaymentMethodTable } from "./components/payment-method.table";

interface PageProps extends SharedData {
  paymentMethods: {
    data: PaymentMethod[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export default function PaymentMethodIndex() {
  const { paymentMethods } = usePage<PageProps>().props;

  const pagination = {
    currentPage: paymentMethods.current_page,
    totalPages: paymentMethods.last_page,
    perPage: paymentMethods.per_page,
    total: paymentMethods.total,
    from: paymentMethods.from || 0,
    to: paymentMethods.to || 0,
  };

  return (
    <>
      <Head title="Payment Methods" />
      <div>
        <div className="flex flex-col gap-y-0.5">
          <h1 className="text-balance font-semibold text-lg/6">
            Payment Methods
          </h1>
          <div className="max-w-3xl text-neutral-500 dark:text-neutral-300 text-sm/6">
            Manage pre-configured payment methods for your store. You can update
            account details and toggle availability.
          </div>
        </div>

        <div className="mt-6">
          <PaymentMethodTable
            paymentMethods={paymentMethods.data}
            pagination={pagination}
          />
        </div>
      </div>
    </>
  );
}

PaymentMethodIndex.layout = (page: any) => (
  <DashboardLayout
    children={page}
    breadcrumbItems={[
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
      },
      {
        label: "Payment Methods",
        href: "/dashboard/settings/payment-methods",
      },
    ]}
  />
);
