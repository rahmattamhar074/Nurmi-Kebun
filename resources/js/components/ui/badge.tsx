import { tv, type VariantProps } from "tailwind-variants";

const badgeStyles = tv({
  base: [
    "inline-flex items-center gap-x-1.5 py-0.5 font-medium text-xs/5 forced-colors:outline",
    "*:data-[slot=icon]:size-3 *:data-[slot=icon]:shrink-0",
    "transition-colors duration-200",
  ],
  variants: {
    intent: {
      primary:
        "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/30",
      secondary:
        "bg-neutral-500/10 text-neutral-700 ring-1 ring-neutral-500/20 dark:bg-neutral-500/20 dark:text-neutral-300 dark:ring-neutral-500/30",
      success:
        "bg-green-500/10 text-green-700 ring-1 ring-green-500/20 dark:bg-green-500/20 dark:text-green-300 dark:ring-green-500/30",
      info: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:bg-sky-500/20 dark:text-sky-300 dark:ring-sky-500/30",
      warning:
        "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/30",
      danger:
        "bg-red-500/10 text-red-700 ring-1 ring-red-500/20 dark:bg-red-500/20 dark:text-red-300 dark:ring-red-500/30",
      outline:
        "bg-transparent text-neutral-700 dark:text-neutral-300 ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600",
    },
    isCircle: {
      true: "rounded-full px-2",
      false: "rounded-md px-1.5",
    },
  },
  defaultVariants: {
    intent: "primary",
    isCircle: true,
  },
});

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeStyles> {
  className?: string;
  children: React.ReactNode;
}

const Badge = ({
  children,
  intent,
  isCircle = true,
  className,
  ...props
}: BadgeProps) => {
  return (
    <span {...props} className={badgeStyles({ intent, isCircle, className })}>
      {children}
    </span>
  );
};

export type { BadgeProps };
export { Badge, badgeStyles };
