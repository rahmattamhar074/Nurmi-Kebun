import { useMediaQuery } from "@/hooks/use-media-query";
import { composeTailwindRenderProps } from "@/lib/primitive";
import {
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
} from "react-aria-components";
import { Tab, TabList, Tabs } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import { IconShoppingBag } from "@intentui/icons";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const navItems = [
    {
      name: "Pending Payment",
      href: route("my-orders.pending-payment"),
      isCurrent: route().current("my-orders.pending-payment"),
    },
    {
      name: "Awaiting Confirmation",
      href: route("my-orders.awaiting-confirmation"),
      isCurrent: route().current("my-orders.awaiting-confirmation"),
    },
    {
      name: "Processing",
      href: route("my-orders.processing"),
      isCurrent: route().current("my-orders.processing"),
    },
    {
      name: "Shipped",
      href: route("my-orders.shipped"),
      isCurrent: route().current("my-orders.shipped"),
    },
    {
      name: "Completed",
      href: route("my-orders.completed"),
      isCurrent: route().current("my-orders.completed"),
    },
    {
      name: "Cancelled",
      href: route("my-orders.cancelled"),
      isCurrent: route().current("my-orders.cancelled"),
    },
  ];

  const currentTab = navItems.find((item) => item.isCurrent)?.name;

  return (
    <AppLayout>
      <div className="py-6 sm:py-0 lg:mt-8">
        <div className="mb-6 mt-6 lg:mt-0">
          <div className="text-3xl font-bold flex items-center gap-2">
            <IconShoppingBag className="inline-block size-8" />
            <h3>My Orders</h3>
          </div>
          <p className="text-muted-fg mt-2">View and manage your orders</p>
        </div>
        <div className="flex flex-col items-start gap-6 md:flex-row md:gap-16">
          {isMobile ? (
            <div className="w-full overflow-x-auto pb-2">
              <Tabs selectedKey={currentTab}>
                <TabList aria-label="Order Status Menu">
                  {navItems.map((item) => (
                    <Tab key={item.name} id={item.name} href={item.href}>
                      {item.name}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </div>
          ) : (
            <div className="w-full shrink-0 md:w-64">
              <ListBox aria-label="Order Status Menu" selectionMode="single">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    href={item.href}
                    isCurrent={!!item.isCurrent}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </ListBox>
            </div>
          )}
          <div className="w-full min-w-0">{children}</div>
        </div>
      </div>
    </AppLayout>
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
        "block py-2 font-medium text-sm",
        isCurrent ? "font-semibold text-fg" : "text-muted-fg hover:text-fg",
      ])}
      {...props}
    />
  );
}
