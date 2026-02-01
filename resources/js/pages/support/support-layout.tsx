import { useMediaQuery } from "@/hooks/use-media-query";
import { composeTailwindRenderProps } from "@/lib/primitive";
import {
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
} from "react-aria-components";
import { Tab, TabList, Tabs } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CreateTicketDialog } from "./components/create-ticket-dialog";
import { IconCircleQuestionmark } from "@intentui/icons";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const navItems = [
    {
      name: "Active",
      href: route("support.active"),
      isCurrent: route().current("support.active"),
    },
    {
      name: "Resolved",
      href: route("support.resolved"),
      isCurrent: route().current("support.resolved"),
    },
    {
      name: "Closed",
      href: route("support.closed"),
      isCurrent: route().current("support.closed"),
    },
  ];

  const currentTab = navItems.find((item) => item.isCurrent)?.name;

  return (
    <AppLayout>
      <div className="py-6 sm:py-0 lg:mt-8">
        <div className="flex-col lg:flex-row mb-6 mt-6 lg:mt-0 flex lg:items-center justify-between gap-2">
          <div>
            <div className="text-3xl font-bold flex items-center gap-2">
              <IconCircleQuestionmark className="inline-block size-8" />
              <h3>Support Ticket</h3>
            </div>
            <p className="text-muted-fg mt-2">
              Get help with your orders and account
            </p>
          </div>
          <Button onPress={() => setCreateDialogOpen(true)}>
            <PlusIcon className="size-4 mr-2" />
            Create Ticket
          </Button>
        </div>
        <div className="flex flex-col items-start gap-6 md:flex-row md:gap-16">
          {isMobile ? (
            <div className="w-full overflow-x-auto pb-2">
              <Tabs selectedKey={currentTab}>
                <TabList aria-label="Support Ticket Status Menu">
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
              <ListBox
                aria-label="Support Ticket Status Menu"
                selectionMode="single"
              >
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

      <CreateTicketDialog
        isOpen={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
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
