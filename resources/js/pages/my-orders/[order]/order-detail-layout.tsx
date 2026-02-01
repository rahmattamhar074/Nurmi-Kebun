import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { composeTailwindRenderProps } from "@/lib/primitive";
import {
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
} from "react-aria-components";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import type { Order } from "@/types/order";
import { Head, Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { formatDate } from "date-fns";

interface OrderDetailLayoutProps {
  order: Order;
  actions?: React.ReactNode;
  children: {
    orderItems: React.ReactNode;
    shippingInfo: React.ReactNode;
    paymentInfo: React.ReactNode;
    cancellationInfo?: React.ReactNode;
    orderSummary: React.ReactNode;
    myReview?: React.ReactNode;
  };
}

const statusConfig = {
  pending_payment: { label: "Pending Payment", intent: "warning" as const },
  payment_verification: {
    label: "Awaiting Confirmation",
    intent: "info" as const,
  },
  processing: { label: "Processing", intent: "secondary" as const },
  shipped: { label: "Shipped", intent: "info" as const },
  completed: { label: "Completed", intent: "success" as const },
  cancelled: { label: "Cancelled", intent: "danger" as const },
};

export default function OrderDetailLayout({
  order,
  actions,
  children,
}: OrderDetailLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "items", name: "Order Items", content: children.orderItems },
    ];

    if (order.has_reviews && children.myReview) {
      baseTabs.push({
        id: "review",
        name: "My Review",
        content: children.myReview,
      });
    }

    baseTabs.push({
      id: "summary",
      name: "Summary",
      content: children.orderSummary,
    });

    if (["processing", "shipped", "completed"].includes(order.status)) {
      baseTabs.splice(baseTabs.length - 1, 0, {
        id: "shipping",
        name: "Shipping Info",
        content: children.shippingInfo,
      });
    }

    baseTabs.splice(baseTabs.length - 1, 0, {
      id: "payment",
      name: "Payment",
      content: children.paymentInfo,
    });

    if (order.status === "cancelled" && children.cancellationInfo) {
      baseTabs.splice(baseTabs.length - 1, 0, {
        id: "cancellation",
        name: "Cancellation Info",
        content: children.cancellationInfo,
      });
    }

    return baseTabs;
  };

  const tabs = getAvailableTabs();
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);
  const statusInfo = statusConfig[order.status];

  return (
    <div>
      <Head title={`Order ${order.order_number}`} />
      <div className="py-6 sm:py-0 lg:mt-8">
        <Link href={route("my-orders.index")}>
          <Button intent="plain" size="sm" className="mb-6">
            <ArrowLeftIcon className="size-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Order {order.order_number}
              </h1>
              <Badge intent={statusInfo.intent}>{statusInfo.label}</Badge>
            </div>
            <p className="text-muted-fg mt-2">
              Placed on{" "}
              {formatDate(
                new Date(order.created_at),
                "dd MMMM yyyy 'at' HH:mm"
              )}
            </p>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
          {isMobile ? (
            <div className="w-full">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
              >
                <div className="overflow-x-auto pb-2 mb-6">
                  <TabList aria-label="Order Details">
                    {tabs.map((tab) => (
                      <Tab key={tab.id} id={tab.id}>
                        {tab.name}
                      </Tab>
                    ))}
                  </TabList>
                </div>
                {tabs.map((tab) => (
                  <TabPanel key={tab.id} id={tab.id}>
                    {tab.content}
                  </TabPanel>
                ))}
              </Tabs>
            </div>
          ) : (
            <>
              <div className="w-full shrink-0 lg:w-64">
                <ListBox
                  aria-label="Order Details"
                  selectionMode="single"
                  selectedKeys={[selectedTab]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (selected) setSelectedTab(selected as string);
                  }}
                >
                  {tabs.map((tab) => (
                    <NavLink
                      key={tab.id}
                      id={tab.id}
                      isCurrent={selectedTab === tab.id}
                    >
                      {tab.name}
                    </NavLink>
                  ))}
                </ListBox>
              </div>
              <div className="w-full min-w-0">
                {tabs.find((tab) => tab.id === selectedTab)?.content}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface NavLinkProps extends ListBoxItemProps {
  isCurrent?: boolean;
}

export function NavLink({ isCurrent, className, ...props }: NavLinkProps) {
  return (
    <ListBoxItem
      textValue={props.children as string}
      className={composeTailwindRenderProps(className, [
        "block py-2 font-medium text-sm cursor-pointer",
        isCurrent ? "font-semibold text-fg" : "text-muted-fg hover:text-fg",
      ])}
      {...props}
    />
  );
}
