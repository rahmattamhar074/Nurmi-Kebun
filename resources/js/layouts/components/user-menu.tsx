"use client";

import {
  IconDashboard,
  IconHeadphones,
  IconLogout,
  IconSettings,
  IconShippingBag,
} from "@intentui/icons";
import { Avatar } from "@/components/ui/avatar";
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuLabel,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { usePage, router } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";
import { useState } from "react";
import DynamicDialog from "@/components/modules/dynamic-dialog";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { auth } = usePage<SharedData>().props;
  const isAdmin = auth.user.role === "administrator";
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    router.post("/logout");
  };

  return (
    <>
      <Menu>
        <MenuTrigger aria-label="Open Menu">
          <Avatar
            src={auth.user.gravatar ?? undefined}
            isSquare
            className="mr-2 size-7 *:size-7 sm:size-9 sm:*:size-9"
            alt="User Profile Picture"
          />
        </MenuTrigger>
        <MenuContent placement="bottom right" className="min-w-60 sm:min-w-56">
          <MenuSection>
            <MenuHeader separator>
              <div>{auth.user.name}</div>
              <div className="pr-6 text-sm font-normal truncate whitespace-nowrap text-muted-fg">
                {auth.user.email}
              </div>
            </MenuHeader>
          </MenuSection>

          {isAdmin ? (
            <MenuItem href="/dashboard">
              <IconDashboard />
              Dashboard
            </MenuItem>
          ) : (
            <>
              <MenuItem href={route("my-orders.index")}>
                <IconShippingBag />
                My Orders
              </MenuItem>
              <MenuItem href={route("profile.edit")}>
                <IconSettings />
                Settings
              </MenuItem>
              <MenuItem href={route("support.index")}>
                <IconHeadphones />
                Customer Support
              </MenuItem>
            </>
          )}
          <MenuSeparator />
          <MenuItem onAction={() => setLogoutDialogOpen(true)}>
            <MenuLabel>Logout</MenuLabel>
            <IconLogout />
          </MenuItem>
        </MenuContent>
      </Menu>

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
    </>
  );
}
