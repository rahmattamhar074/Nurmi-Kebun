"use client";

import { usePage, router } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";
import {
  IconChevronsY,
  IconCreditCardFill,
  IconCurrencyDollar,
  IconDashboardFill,
  IconGearFill,
  IconGrid4Fill,
  IconLogout,
  IconMessageFill,
  IconPeople,
  IconPersonPasskeyFill,
  IconPieChart2Fill,
  IconReceipt2Fill,
  IconShoppingBagFill,
  IconStarFill,
} from "@intentui/icons";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "@/components/ui/link";
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarRail,
  SidebarSection,
  SidebarSectionGroup,
} from "@/components/ui/sidebar";
import { useState } from "react";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import { AdminSettingDialog } from "./admin-setting-dialog";
import { Button } from "@/components/ui/button";
import { useNewOrders } from "@/hooks/use-new-orders";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  badge?: string;
  isCurrent?: boolean;
  isDisabled?: boolean;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

interface NavLinks {
  sections: NavSection[];
}

export default function DashboardSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const { auth } = usePage<SharedData>().props;
  const currentUrl = usePage().url;
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const { count: newOrdersCount } = useNewOrders();

  const handleLogout = () => {
    router.post("/logout");
  };

  const getRoute = (routeName: string, params?: any): string => {
    try {
      return window.route
        ? window.route(routeName, params)
        : `/${routeName.replace(".", "/")}`;
    } catch {
      console.warn(`Route '${routeName}' not found, using fallback URL`);
      return `/${routeName.replace(".", "/")}`;
    }
  };

  const isRouteActive = (routeName: string): boolean => {
    const routeUrl = getRoute(routeName);
    if (routeUrl === "#") return false;

    if (routeUrl === currentUrl) return true;

    if (routeName === "dashboard" && currentUrl === "/dashboard") return true;

    const routePrefixMap: Record<string, string> = {
      products: "/dashboard/products",
      categories: "/dashboard/categories",
      transactions: "/dashboard/transactions",
      reviews: "/dashboard/reviews",
      customers: "/dashboard/customers",
      reports: "/dashboard/reports",
      support: "/dashboard/support",
      "payment-methods": "/dashboard/settings/payment-methods",
      "admin-accounts": "/dashboard/settings/admin-accounts",
    };

    for (const [key, prefix] of Object.entries(routePrefixMap)) {
      if (routeName.includes(key) && currentUrl.startsWith(prefix)) {
        return true;
      }
    }

    return false;
  };

  const navLinks: NavLinks = {
    sections: [
      {
        label: "Overview",
        items: [
          {
            label: "Overview",
            href: getRoute("dashboard"),
            icon: IconPieChart2Fill,
            tooltip: "Overview",
            isCurrent: isRouteActive("dashboard"),
          },
          {
            label: "Customers",
            href: getRoute("dashboard.customers.index"),
            icon: IconPeople,
            tooltip: "Customers",
            isCurrent: isRouteActive("dashboard.customers.index"),
          },

          {
            label: "Reports",
            href: getRoute("dashboard.reports.index"),
            icon: IconReceipt2Fill,
            tooltip: "Reports",
            isCurrent: isRouteActive("dashboard.reports.index"),
          },
          {
            label: "Support Tickets",
            href: route("dashboard.support.index"),
            icon: IconMessageFill,
            tooltip: "Support Tickets",
            isCurrent: isRouteActive("dashboard.support.index"),
          },
        ],
      },
      {
        label: "Product",
        items: [
          {
            label: "Products",
            href: getRoute("products.index"),
            icon: IconShoppingBagFill,
            tooltip: "Products",
            isCurrent: isRouteActive("products.index"),
          },
          {
            label: "Categories",
            href: getRoute("categories.index"),
            icon: IconGrid4Fill,
            tooltip: "Categories",
            isCurrent: isRouteActive("categories.index"),
          },
          {
            label: "Transactions",
            href: getRoute("dashboard.transactions.index"),
            icon: IconCurrencyDollar,
            tooltip: "Transactions",
            isCurrent: isRouteActive("dashboard.transactions.index"),
            badge: newOrdersCount > 0 ? newOrdersCount.toString() : undefined,
          },
          {
            label: "Reviews",
            href: getRoute("dashboard.reviews.index"),
            icon: IconStarFill,
            tooltip: "Reviews",
            isCurrent: isRouteActive("dashboard.reviews.index"),
          },
        ],
      },
      {
        label: "Settings",
        items: [
          {
            label: "Payment Methods",
            href: getRoute("dashboard.payment-methods.index"),
            icon: IconCreditCardFill,
            tooltip: "Payment Methods",
            isCurrent: isRouteActive("dashboard.payment-methods.index"),
          },
          {
            label: "Admin Accounts",
            href: getRoute("dashboard.admin-accounts.index"),
            icon: IconPersonPasskeyFill,
            tooltip: "Admin Accounts",
            isCurrent: isRouteActive("dashboard.admin-accounts.index"),
          },
        ],
      },
    ],
  };

  const renderNavItem = (item: NavItem) => {
    return (
      <SidebarItem
        key={item.label}
        tooltip={item.tooltip}
        isCurrent={item.isCurrent}
        href={item.href}
        badge={item.badge}
        isDisabled={item.isDisabled}
      >
        <item.icon />
        <SidebarLabel>{item.label}</SidebarLabel>
      </SidebarItem>
    );
  };

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <Link
            href="/docs/components/layouts/sidebar"
            className="flex items-center gap-x-2"
          >
            <img
              src="/assets/brand.webp"
              alt="brand-logo"
              className="size-6 sm:size-8"
            />
            <SidebarLabel className="font-medium ">
              <p className="text-xl">
                Nurmi <span className="text-muted-fg">Kebun</span>
              </p>
              <p className="text-sm font-semibold text-primary">
                Admin Dashboard
              </p>
            </SidebarLabel>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSectionGroup>
            {navLinks.sections.map((section, sectionIndex) => (
              <SidebarSection key={sectionIndex} label={section.label}>
                {section.items.map((item) => renderNavItem(item))}
              </SidebarSection>
            ))}
          </SidebarSectionGroup>
        </SidebarContent>

        <SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
          <Menu>
            <MenuTrigger
              className="flex w-full items-center justify-between"
              aria-label="Profile"
            >
              <div className="flex items-center gap-x-2">
                <Avatar
                  className="size-8 *:size-8 group-data-[state=collapsed]:size-6 group-data-[state=collapsed]:*:size-6"
                  isSquare
                  src={auth.user.gravatar}
                />

                <div className="in-data-[collapsible=dock]:hidden text-sm">
                  <SidebarLabel>{auth.user.name}</SidebarLabel>
                  <span className="-mt-0.5 block text-muted-fg">
                    {auth.user.email}
                  </span>
                </div>
              </div>
              <IconChevronsY data-slot="chevron" />
            </MenuTrigger>
            <MenuContent
              className="in-data-[sidebar-collapsible=collapsed]:min-w-56 min-w-(--trigger-width)"
              placement="bottom right"
            >
              <MenuSection>
                <MenuHeader separator>
                  <span className="block">{auth.user.name}</span>
                  <span className="font-normal text-muted-fg">
                    {auth.user.email}
                  </span>
                </MenuHeader>
              </MenuSection>

              <MenuItem href="/">
                <IconDashboardFill />
                Store
              </MenuItem>
              <MenuItem onAction={() => setSettingsDialogOpen(true)}>
                <IconGearFill />
                Settings
              </MenuItem>
              <MenuSeparator />
              <MenuItem onAction={() => setLogoutDialogOpen(true)}>
                <IconLogout />
                Log out
              </MenuItem>
            </MenuContent>
          </Menu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <DynamicDialog
        isOpen={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to login again to access your account."
      >
        <div className="flex items-center justify-end gap-3 p-4">
          <Button intent="outline" onPress={() => setLogoutDialogOpen(false)}>
            Cancel
          </Button>
          <Button intent="danger" onPress={handleLogout}>
            Yes, Logout
          </Button>
        </div>
      </DynamicDialog>

      <AdminSettingDialog
        isOpen={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </>
  );
}
