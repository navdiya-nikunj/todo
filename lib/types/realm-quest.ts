export interface User {
  id: string
  name: string
  email: string
  level: number
  xp: number
  badges: Badge[]
  stats: UserStats
  avatar?: string
  username?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  level: number
  xp: number
  badges: Badge[]
  stats: UserStats
  avatar?: string
}

export interface UserStats {
  tasksCompleted: number
  realmsCleared: number
  streak?: number
  totalXP?: number
  activeRealms?: number
}

export interface Badge {
  id: string
  name: string
  description?: string
  icon?: string
  rarity?: AvatarRarity
  unlockedAt?: string
}

export interface Realm {
  id: string
  name: string
  description: string
  theme: RealmTheme
  tasksCompleted: number
  totalTasks: number
  difficulty?: RealmDifficulty
  createdAt?: string
  updatedAt?: string
  userId?: string
}

export interface Task {
  id: string
  title: string
  description: string
  difficulty: TaskDifficulty
  status: TaskStatus
  realmId: string
  xpReward?: number
  dueDate?: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
}

export interface AvatarOption {
  id: string
  name: string
  image: string
  category: AvatarCategory
  unlockRequirement?: UnlockRequirement
  description: string
  rarity: AvatarRarity
}

export interface UnlockRequirement {
  type: "level" | "badge" | "tasks" | "realms"
  value: number | string
}

export interface DailyQuest {
  id: string
  title: string
  description: string
  xpReward: number
  progress: number
  target: number
  completed: boolean
  expiresAt: string
  questType: DailyQuestType
}

export interface CustomDailyQuest extends DailyQuest {
  isCustom: true
  questType: "custom"
}

export interface CreateCustomQuestData {
  title: string
  description: string
  target: number
  xpReward: number
}

export interface DailyQuestProgress {
  tasksCompleted: number
  realmsVisited: number
  xpEarned: number
  streakDays: number
  lastCompletedDate?: string
}

export type RealmTheme = "fire" | "ice" | "nature" | "electric" | "shadow"
export type RealmDifficulty = "easy" | "medium" | "hard" | "legendary"
export type TaskDifficulty = "easy" | "medium" | "hard"
export type TaskStatus = "pending" | "completed"
export type AvatarCategory = "starter" | "level" | "badge" | "premium"
export type AvatarRarity = "common" | "rare" | "epic" | "legendary"
export type AuthMode = "login" | "signup"
export type ViewType = "dashboard" | "realms" | "realm-detail" | "avatar-customization"
export type DailyQuestType =
  | "complete_tasks"
  | "visit_realms"
  | "earn_xp"
  | "maintain_streak"
  | "defeat_enemies"
  | "custom"
