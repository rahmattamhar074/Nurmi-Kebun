import { Accordion } from "@/components/ui/accordion";

interface ShippingService {
  service_code: string;
  service_name: string;
  description: string;
  duration: string;
  price: number;
  type: string;
}

interface CourierGroup {
  courier_code: string;
  courier_name: string;
  services: ShippingService[];
}

interface ShippingAccordionProps {
  courierGroups: CourierGroup[];
  selectedService: {
    courier_code: string;
    service_code: string;
  } | null;
  onServiceSelect: (courierCode: string, service: ShippingService) => void;
  formatCurrency: (price: number) => string;
}

export default function ShippingAccordion({
  courierGroups,
  selectedService,
  onServiceSelect,
  formatCurrency,
}: ShippingAccordionProps) {
  return (
    <Accordion allowsMultipleExpanded>
      {courierGroups.map((courier) => (
        <Accordion.Item key={courier.courier_code} id={courier.courier_code}>
          <Accordion.Trigger>
            <div className="flex items-center gap-3">
              <img
                src={`/assets/logo/${courier.courier_code}.png`}
                alt={courier.courier_name}
                className="w-12 h-auto"
              />
              <span className="font-semibold  text-sm lg:text-base">
                {courier.courier_name}
              </span>
              <span className="text-xs lg:text-sm text-neutral-500">
                {courier.services.length} service
                {courier.services.length > 1 ? "s" : ""} available
              </span>
            </div>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="space-y-2 py-3">
              {courier.services.map((service) => {
                const isSelected =
                  selectedService?.courier_code === courier.courier_code &&
                  selectedService?.service_code === service.service_code;

                return (
                  <button
                    key={service.service_code}
                    type="button"
                    onClick={() =>
                      onServiceSelect(courier.courier_code, service)
                    }
                    className={`w-full border rounded-lg p-3 cursor-pointer transition-all text-left ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping_service"
                        checked={isSelected}
                        onChange={() =>
                          onServiceSelect(courier.courier_code, service)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium  text-sm lg:text-base">
                            {service.service_name}
                          </p>
                          <p className="font-semibold  text-sm lg:text-base">
                            {formatCurrency(service.price)}
                          </p>
                        </div>
                        {service.description && (
                          <p className="text-xs lg:text-sm text-neutral-600 mt-1">
                            {service.description}
                          </p>
                        )}
                        {service.duration && (
                          <p className="text-xs lg:text-sm text-neutral-500 mt-1">
                            Estimated delivery: {service.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
