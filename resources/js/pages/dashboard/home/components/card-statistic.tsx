import { Card, CardContent } from "@/components/ui/card";

interface CardStatisticProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  description: string;
}

export function CardStatistic({
  icon: Icon,
  label,
  value,
  description,
}: CardStatisticProps) {
  return (
    <Card className="dark:bg-fg/5 bg-primary/10 border-0">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="space-y-8">
              <h1 className="text-balance font-semibold text-lg/6">{label}</h1>
              <div className="space-y-2">
                <p className="text-2xl font-semibold mt-0.5 text-primary">
                  {value}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 text-sm">
                  {description}
                </p>
              </div>
            </div>
          </div>
          <div
            className={
              "flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5"
            }
          >
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
