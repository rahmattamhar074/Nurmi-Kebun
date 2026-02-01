"use client";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import {
  Navbar,
  NavbarGap,
  NavbarItem,
  NavbarMobile,
  type NavbarProps,
  NavbarProvider,
  NavbarSection,
  NavbarSeparator,
  NavbarSpacer,
  NavbarStart,
  NavbarTrigger,
} from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "./user-menu";
import { usePage } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { CartDrawer, CartPopover } from "./cart";

export default function AppNavbar(props: NavbarProps) {
  const { auth } = usePage<SharedData>().props;
  return (
    <NavbarProvider>
      <Navbar {...props} intent="float" isSticky>
        <NavbarStart>
          <Link
            className="flex items-center font-medium gap-x-2"
            aria-label="Goto documentation of Navbar"
            href="/"
          >
            <img
              src="/assets/brand.webp"
              alt="brand-logo"
              className="size-6 sm:size-5"
            />
            <span>
              Nurmi <span className="text-muted-fg">Kebun</span>
            </span>
          </Link>
        </NavbarStart>
        <NavbarGap />
        <NavbarSection>
          <NavbarItem href="/" isCurrent={route().current("home")}>
            Home
          </NavbarItem>
          <NavbarItem href={"/store"} isCurrent={route().current("store")}>
            Shop
          </NavbarItem>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection className="max-md:hidden">
          <ThemeSwitcher className="ml-3 **:data-[slot=icon]:size-5" />
          {auth.user && auth.user.role === "customer" && <CartPopover />}
          <Separator orientation="vertical" className="h-5 ml-1 mr-3" />
          {auth.user ? (
            <UserMenu />
          ) : (
            <NavbarItem
              className={buttonStyles({
                intent: "outline",
                size: "sm",
              })}
              href="/login"
            >
              Login
            </NavbarItem>
          )}
        </NavbarSection>
      </Navbar>
      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />
        <ThemeSwitcher className="**:data-[slot=icon]:size-4" />
        {auth.user && auth.user.role === "customer" && <CartDrawer />}
        <NavbarSeparator className="mr-2.5" />
        {auth.user ? (
          <UserMenu />
        ) : (
          <NavbarItem
            className={buttonStyles({
              intent: "outline",
              size: "sm",
            })}
            href="/login"
          >
            Login
          </NavbarItem>
        )}
      </NavbarMobile>
    </NavbarProvider>
  );
}
