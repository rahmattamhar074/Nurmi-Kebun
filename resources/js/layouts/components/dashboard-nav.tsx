"use client";

import { SidebarNav, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface DashboardSidebarNavProps {
  breadcrumbItems?: { href?: string; label: string }[];
}
export default function DashboardSidebarNav({
  breadcrumbItems,
}: DashboardSidebarNavProps) {
  return (
    <SidebarNav className="md:border flex justify-between w-full">
      <div className="justify-between flex items-center w-full">
        <div className="flex items-center gap-x-4 flex-1">
          <SidebarTrigger className="-ml-2" />
          {breadcrumbItems && (
            <Breadcrumbs className="hidden md:flex whitespace-nowrap">
              {breadcrumbItems.map((item, index) =>
                item.href ? (
                  <Breadcrumbs.Item key={index} href={item.href}>
                    {item.label}
                  </Breadcrumbs.Item>
                ) : (
                  <Breadcrumbs.Item key={index}>{item.label}</Breadcrumbs.Item>
                )
              )}
            </Breadcrumbs>
          )}
        </div>
        <ThemeSwitcher className="**:data-[slot=icon]:size-4" />
      </div>
    </SidebarNav>
  );
}
