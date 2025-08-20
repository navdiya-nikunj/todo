import { Flame, Snowflake, Leaf, Zap, Moon, Sword } from "lucide-react"
import type { RealmTheme } from "@/lib/types/realm-quest"

interface ThemeIconProps {
  theme: RealmTheme
  className?: string
}

export function ThemeIcon({ theme, className = "w-5 h-5" }: ThemeIconProps) {
  switch (theme) {
    case "fire":
      return <Flame className={`${className} text-red-400`} />
    case "ice":
      return <Snowflake className={`${className} text-blue-400`} />
    case "nature":
      return <Leaf className={`${className} text-green-400`} />
    case "electric":
      return <Zap className={`${className} text-yellow-400`} />
    case "shadow":
      return <Moon className={`${className} text-purple-400`} />
    default:
      return <Sword className={`${className} text-realm-neon-blue`} />
  }
}
