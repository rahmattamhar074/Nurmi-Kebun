import React from "react";
import { usePage } from "@inertiajs/react";

import { Tab, TabList, Tabs } from "@/components/ui/tabs";
import {
  IconCircleCheckFill,
  IconClockFill,
  IconCube,
  IconX,
  IconPackage,
  IconCreditCard,
} from "@intentui/icons";

interface NavItem {
  url: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
const navs: NavItem[] = [
  {
    url: "/dashboard/transactions/awaiting-payment",
    label: "Awaiting Payment",
    icon: IconCreditCard,
  },
  {
    url: "/dashboard/transactions/awaiting-confirmation",
    label: "Awaiting Confirmation",
    icon: IconClockFill,
  },
  {
    url: "/dashboard/transactions/processing",
    label: "Processing",
    icon: IconPackage,
  },
  {
    url: "/dashboard/transactions/shipped",
    label: "Shipped",
    icon: IconCube,
  },
  {
    url: "/dashboard/transactions/completed",
    label: "Completed",
    icon: IconCircleCheckFill,
  },
  {
    url: "/dashboard/transactions/cancelled",
    label: "Cancelled",
    icon: IconX,
  },
];

export function TransactionTabs() {
  const { url } = usePage();

  const currentTab = navs.find((nav) => url.startsWith(nav.url));

  return (
    <Tabs aria-label="Navbar" selectedKey={currentTab?.label}>
      <TabList items={navs}>
        {(item) => (
          <Tab id={item.label} href={item.url}>
            <item.icon className="w-5 h-5" />
            {item.label}
          </Tab>
        )}
      </TabList>
    </Tabs>
  );
}

const TransactionLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-y-0.5">
        <h1 className="text-balance font-semibold text-lg/6">Transactions</h1>
        <div className="max-w-3xl text-neutral-500 dark:text-neutral-300 text-sm/6">
          Manage your transactions to organize your inventory effectively.
        </div>
      </div>
      <div className="mt-16">
        <TransactionTabs />
      </div>
      {children}
    </div>
  );
};

export default TransactionLayout;
