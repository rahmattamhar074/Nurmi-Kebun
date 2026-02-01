import { Button } from "./ui/button"
import { IconMoon, IconSun } from "@intentui/icons"
import { useTheme } from "@/hooks/use-theme"

export function ThemeSwitcher({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { theme, updateTheme } = useTheme()

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light"
    updateTheme(nextTheme)
  }

  return (
    <Button
      size="sq-sm"
      className={"**:data-[slot=icon]:text-fg"}
      aria-label="Switch theme"
      onPress={toggleTheme}
      intent="plain"
      {...props}
    >
      {theme === "light" ? <IconSun /> : <IconMoon />}
    </Button>
  )
}
