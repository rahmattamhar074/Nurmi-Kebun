import { Card } from "@/components/ui/card";
import SettingsLayout from "@/pages/settings/settings-layout";
import { type Theme, useTheme } from "@/hooks/use-theme";
import { IconDeviceDesktop2, IconMoon, IconSun } from "@intentui/icons";
import { Choicebox } from "@/components/ui/choicebox";
import { Head } from "@inertiajs/react";

interface Themes {
  value: Theme;
  icon: React.FC<React.SVGAttributes<SVGSVGElement>>;
  label: string;
  description: string;
}

const title = "Appearance";

export default function Appearance() {
  const { theme, updateTheme } = useTheme();
  const themes: Themes[] = [
    {
      value: "light",
      icon: IconSun,
      label: "Light",
      description: "Ideal for daytime use.",
    },
    {
      value: "dark",
      icon: IconMoon,
      label: "Dark",
      description: "Comfortable for nighttime use.",
    },
    {
      value: "system",
      icon: IconDeviceDesktop2,
      label: "System",
      description: "Automatically match the theme with your system settings.",
    },
  ];

  return (
    <>
      <Head title={title} />
      <h1 className="sr-only">{title}</h1>
      <Card>
        <Card.Header>
          <Card.Title>{title}</Card.Title>

          <Card.Description className="max-w-lg">
            Choose the most comfortable theme to make your experience using this
            app more enjoyable.
          </Card.Description>
        </Card.Header>

        <Card.Content className="max-w-lg">
          <Choicebox
            selectedKeys={new Set([theme])}
            onSelectionChange={(v) => {
              // @ts-ignore
              updateTheme([...v][0]);
            }}
            columns={1}
            gap={0}
            selectionMode="single"
            aria-label="Choose theme"
            items={themes}
          >
            {(item) => (
              <Choicebox.Item
                id={item.value}
                textValue={item.label}
                label={item.label}
                description={item.description}
              />
            )}
          </Choicebox>
        </Card.Content>
      </Card>
    </>
  );
}

Appearance.layout = (page: any) => <SettingsLayout children={page} />;
