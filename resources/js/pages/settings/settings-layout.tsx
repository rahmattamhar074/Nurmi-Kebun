import { useMediaQuery } from "@/hooks/use-media-query";
import { composeTailwindRenderProps } from "@/lib/primitive";
import {
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
} from "react-aria-components";
import { Tab, TabList, Tabs } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import { IconSettings } from "@intentui/icons";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const navItems = [
    {
      name: "Profile",
      href: route("profile.edit"),
      isCurrent: route().current("profile.edit"),
    },

    {
      name: "Shipping Addresses",
      href: route("settings.addresses.index"),
      isCurrent: route().current("settings.addresses.*"),
    },
    {
      name: "Appearance",
      href: route("settings.appearance"),
      isCurrent: route().current("settings.appearance"),
    },
    {
      name: "Change password",
      href: route("password.edit"),
      isCurrent: route().current("password.edit"),
    },
    {
      name: "Delete Account",
      href: route("settings.delete-account"),
      isCurrent: route().current("settings.delete-account"),
    },
  ];

  const currentTab = navItems.find((item) => item.isCurrent)?.name;

  return (
    <AppLayout>
      <div className="py-6 sm:py-0 lg:mt-8">
        <div className="mb-6 mt-6 lg:mt-0">
          <div className="text-3xl font-bold flex items-center gap-2">
            <IconSettings className="inline-block size-8" />
            <h3>Settings</h3>
          </div>
          <p className="text-muted-fg mt-2">View and manage your settings</p>
        </div>
        <div className="flex flex-col items-start gap-6 md:flex-row md:gap-16">
          {isMobile ? (
            <div className="w-full overflow-x-auto pb-2">
              <Tabs selectedKey={currentTab}>
                <TabList aria-label="Settings Menu">
                  {navItems.map((item) => (
                    <Tab key={item.name} id={item.name} href={item.href}>
                      {item.name}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </div>
          ) : (
            <div className="w-full shrink-0 md:w-56">
              <ListBox aria-label="Menu" selectionMode="single">
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
