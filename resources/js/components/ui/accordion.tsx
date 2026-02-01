"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import type {
  DisclosureGroupProps,
  DisclosurePanelProps,
  DisclosureProps,
} from "react-aria-components";
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface AccordionProps extends DisclosureGroupProps {
  className?: string;
}

const Accordion = ({ className, ...props }: AccordionProps) => {
  return (
    <DisclosureGroup className={twMerge("space-y-4", className)} {...props} />
  );
};

interface AccordionItemProps extends DisclosureProps {
  className?: string;
}

const AccordionItem = ({ className, ...props }: AccordionItemProps) => {
  return (
    <Disclosure
      className={twMerge(
        "group/accordion-item rounded-lg border bg-bg shadow-xs overflow-hidden",
        className
      )}
      {...props}
    />
  );
};

interface AccordionTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionTriggerProps) => {
  return (
    <Button
      slot="trigger"
      className={twMerge(
        "flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-fg transition-colors hover:bg-muted/50",
        "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      <ChevronDownIcon
        className={twMerge(
          "size-5 shrink-0 text-muted-fg transition-transform duration-300 ease-out",
          "group-aria-expanded/accordion-item:rotate-180"
        )}
      />
    </Button>
  );
};

interface AccordionContentProps extends DisclosurePanelProps {
  className?: string;
}

const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionContentProps) => {
  return (
    <DisclosurePanel
      {...props}
      className={twMerge(
        "overflow-hidden transition-all duration-300 ease-out",
        "data-[entering]:animate-in data-[entering]:fade-in data-[entering]:slide-in-from-top-2",
        "data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:slide-out-to-top-2"
      )}
    >
      <div className={twMerge("px-6 pb-4 pt-0", className)}>{children}</div>
    </DisclosurePanel>
  );
};

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
};
