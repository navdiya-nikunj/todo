import type { RealmTheme, RealmDifficulty, TaskDifficulty, AvatarRarity } from "@/lib/types/realm-quest"

export const XP_REWARDS = {
  easy: 10,
  medium: 25,
  hard: 50,
} as const

export const LEVEL_CALCULATION = {
  baseXP: 100,
  multiplier: 1,
} as const

export const COMBO_WINDOW_MS = 10000 // 10 seconds

export const REALM_THEMES: Record<
  RealmTheme,
  {
    name: string
    primary: string
    secondary: string
    background: string
    description: string
  }
> = {
  fire: {
    name: "Fire Realm",
    primary: "red-400",
    secondary: "orange-400",
    background: "from-red-900/20 to-orange-900/20",
    description: "Blazing dungeons filled with flame enemies",
  },
  ice: {
    name: "Ice Realm",
    primary: "blue-400",
    secondary: "cyan-400",
    background: "from-blue-900/20 to-cyan-900/20",
    description: "Frozen wastelands with crystalline foes",
  },
  nature: {
    name: "Nature Realm",
    primary: "green-400",
    secondary: "emerald-400",
    background: "from-green-900/20 to-emerald-900/20",
    description: "Verdant forests teeming with wild beasts",
  },
  electric: {
    name: "Electric Realm",
    primary: "yellow-400",
    secondary: "amber-400",
    background: "from-yellow-900/20 to-amber-900/20",
    description: "Stormy domains crackling with lightning",
  },
  shadow: {
    name: "Shadow Realm",
    primary: "purple-400",
    secondary: "violet-400",
    background: "from-purple-900/20 to-violet-900/20",
    description: "Dark dimensions filled with spectral enemies",
  },
} as const

export const THEME_COLORS: Record<RealmTheme, string> = {
  fire: "border-red-400/30 bg-red-400/5",
  ice: "border-blue-400/30 bg-blue-400/5",
  nature: "border-green-400/30 bg-green-400/5",
  electric: "border-yellow-400/30 bg-yellow-400/5",
  shadow: "border-purple-400/30 bg-purple-400/5",
}

export const DIFFICULTY_COLORS: Record<RealmDifficulty | TaskDifficulty, string> = {
  easy: "text-green-400 bg-green-400/10 border-green-400/30",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  hard: "text-red-400 bg-red-400/10 border-red-400/30",
  legendary: "text-purple-400 bg-purple-400/10 border-purple-400/30",
}

export const RARITY_COLORS: Record<AvatarRarity, string> = {
  common: "border-gray-400/30 bg-gray-400/5",
  rare: "border-blue-400/30 bg-blue-400/5",
  epic: "border-purple-400/30 bg-purple-400/5",
  legendary: "border-yellow-400/30 bg-yellow-400/5",
}

export const RARITY_TEXT_COLORS: Record<AvatarRarity, string> = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
}

export const ANIMATION_DURATIONS = {
  hover: "duration-300",
  scale: "duration-500",
  progress: "duration-1000",
  particle: "duration-3000",
} as const

export const DAILY_QUEST_TYPES = {
  complete_tasks: {
    title: "Task Slayer",
    description: "Complete {target} tasks today",
    baseReward: 50,
    icon: "sword",
  },
  visit_realms: {
    title: "Realm Explorer",
    description: "Visit {target} different realms",
    baseReward: 30,
    icon: "map",
  },
  earn_xp: {
    title: "XP Hunter",
    description: "Earn {target} XP points",
    baseReward: 40,
    icon: "star",
  },
  maintain_streak: {
    title: "Consistency Master",
    description: "Maintain your daily streak",
    baseReward: 75,
    icon: "flame",
  },
  defeat_enemies: {
    title: "Monster Hunter",
    description: "Defeat {target} enemies of any difficulty",
    baseReward: 60,
    icon: "shield",
  },
} as const

export const DAILY_QUEST_TARGETS = {
  complete_tasks: [3, 5, 8],
  visit_realms: [2, 3, 4],
  earn_xp: [100, 150, 200],
  maintain_streak: [1],
  defeat_enemies: [5, 8, 12],
} as const
