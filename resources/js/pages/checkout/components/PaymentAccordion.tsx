import { Accordion } from "@/components/ui/accordion";
import { BuildingLibraryIcon, QrCodeIcon } from "@heroicons/react/24/outline";

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  icon?: string;
}

interface PaymentGroup {
  type: string;
  label: string;
  methods: PaymentMethod[];
}

interface PaymentAccordionProps {
  paymentMethods: PaymentMethod[];
  selectedMethodId: number | null;
  onMethodSelect: (methodId: number) => void;
}

export default function PaymentAccordion({
  paymentMethods,
  selectedMethodId,
  onMethodSelect,
}: PaymentAccordionProps) {
  const groupedMethods: PaymentGroup[] = [
    {
      type: "bank",
      label: "Bank Transfer",
      methods: paymentMethods.filter((m) => m.type === "bank"),
    },
    {
      type: "e_wallet",
      label: "E-Wallet",
      methods: paymentMethods.filter((m) => m.type === "e_wallet"),
    },
  ].filter((group) => group.methods.length > 0);

  return (
    <Accordion allowsMultipleExpanded>
      {groupedMethods.map((group) => {
        const Icon =
          group.type === "e_wallet" ? QrCodeIcon : BuildingLibraryIcon;
        return (
          <Accordion.Item key={group.type} id={group.type}>
            <Accordion.Trigger>
              <div className="flex items-center gap-3">
                <Icon className="size-5" />
                <p className="font-semibold text-neutral-900 dark:text-neutral-200 text-sm lg:text-base">
                  {group.label}
                </p>
                <span className="text-xs text-neutral-500">
                  {group.methods.length} option
                  {group.methods.length > 1 ? "s" : ""} available
                </span>
              </div>
            </Accordion.Trigger>
            <Accordion.Content>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 py-3">
                {group.methods.map((method) => {
                  const isSelected = selectedMethodId === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => onMethodSelect(method.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 hover:shadow-sm ${
                        isSelected
                          ? "border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400 ring-2 ring-green-500 dark:ring-green-400"
                          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-900"
                      }`}
                    >
                      {method.icon && (
                        <img
                          src={method.icon}
                          alt={`${method.name} logo`}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                      <p
                        className={`font-medium text-sm text-center ${
                          isSelected
                            ? "text-green-700 dark:text-green-300"
                            : "text-neutral-900 dark:text-neutral-200 "
                        }`}
                      >
                        {method.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
