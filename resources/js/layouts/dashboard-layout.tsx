import { Flash } from "@/components/flash";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { PropsWithChildren } from "react";
import DashboardSidebarNav from "./components/dashboard-nav";
import DashboardSidebar from "./components/dashboard-sidebar";

interface DashboardLayoutProps extends PropsWithChildren {
  breadcrumbItems?: { href?: string; label: string }[];
}
const DashboardLayout = ({
  children,
  breadcrumbItems,
}: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <DashboardSidebar collapsible="dock" />
      <SidebarInset>
        <div className="flex">
          <DashboardSidebarNav breadcrumbItems={breadcrumbItems} />
        </div>
        <div className="p-4 lg:p-6">{children}</div>
      </SidebarInset>
      <Flash />
    </SidebarProvider>
  );
};

export default DashboardLayout;
