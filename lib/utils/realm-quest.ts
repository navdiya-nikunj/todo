import type {
  RealmTheme,
  RealmDifficulty,
  TaskDifficulty,
  AvatarRarity,
  UserProfile,
  AvatarOption,
  Badge,
  DailyQuest,
  DailyQuestType,
  CustomDailyQuest,
  CreateCustomQuestData,
} from "@/lib/types/realm-quest"
import {
  XP_REWARDS,
  LEVEL_CALCULATION,
  THEME_COLORS,
  DIFFICULTY_COLORS,
  RARITY_COLORS,
  RARITY_TEXT_COLORS,
  DAILY_QUEST_TARGETS,
  DAILY_QUEST_TYPES,
} from "@/lib/constants/realm-quest"

export function calculateLevel(xp: number): number {
  return Math.floor(xp / LEVEL_CALCULATION.baseXP) + 1
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  return currentLevel * LEVEL_CALCULATION.baseXP
}

export function getXPProgress(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP) - 1
  const xpForCurrentLevel = currentLevel * LEVEL_CALCULATION.baseXP
  const xpForNextLevel = (currentLevel + 1) * LEVEL_CALCULATION.baseXP
  return ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
}

export function getXPReward(difficulty: TaskDifficulty): number {
  return XP_REWARDS[difficulty]
}

export function getThemeColor(theme: RealmTheme): string {
  return THEME_COLORS[theme] || THEME_COLORS.nature
}

export function getDifficultyColor(difficulty: RealmDifficulty | TaskDifficulty): string {
  return DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.medium
}

export function getRarityColor(rarity: AvatarRarity): string {
  return RARITY_COLORS[rarity] || RARITY_COLORS.common
}

export function getRarityTextColor(rarity: AvatarRarity): string {
  return RARITY_TEXT_COLORS[rarity] || RARITY_TEXT_COLORS.common
}

export function isAvatarUnlocked(avatar: AvatarOption, user: UserProfile): boolean {
  if (avatar.category === "starter") return true
  if (!avatar.unlockRequirement) return true

  switch (avatar.unlockRequirement.type) {
    case "level":
      return user.level >= (avatar.unlockRequirement.value as number)
    case "badge":
      return user.badges.some((badge) => badge.id === avatar.unlockRequirement?.value)
    case "tasks":
      return user.stats.tasksCompleted >= (avatar.unlockRequirement.value as number)
    case "realms":
      return user.stats.realmsCleared >= (avatar.unlockRequirement.value as number)
    default:
      return false
  }
}

export function getUnlockRequirementText(avatar: AvatarOption, availableBadges: Badge[]): string {
  if (!avatar.unlockRequirement) return ""

  switch (avatar.unlockRequirement.type) {
    case "level":
      return `Reach Level ${avatar.unlockRequirement.value}`
    case "badge":
      const badgeName = availableBadges.find((b) => b.id === avatar.unlockRequirement?.value)?.name || "Unknown Badge"
      return `Earn ${badgeName} badge`
    case "tasks":
      return `Complete ${avatar.unlockRequirement.value} tasks`
    case "realms":
      return `Clear ${avatar.unlockRequirement.value} realms`
    default:
      return "Unknown requirement"
  }
}

export function checkForNewBadges(user: UserProfile): Badge[] {
  const newBadges: Badge[] = []

  if (user.stats.tasksCompleted >= 100 && !user.badges.some((badge) => badge.id === "dungeon_master")) {
    newBadges.push({ id: "dungeon_master", name: "Dungeon Master" })
  }

  if (user.stats.tasksCompleted >= 50 && !user.badges.some((badge) => badge.id === "streak_king")) {
    newBadges.push({ id: "streak_king", name: "Streak King" })
  }

  if (user.stats.tasksCompleted >= 1 && !user.badges.some((badge) => badge.id === "first_clear")) {
    newBadges.push({ id: "first_clear", name: "First Clear" })
  }

  return newBadges
}

export function calculateProgressPercentage(current: number, total: number): number {
  return Math.min((current / total) * 100, 100)
}

export function formatSuccessRate(tasksCompleted: number, totalAttempts = 0): number {
  const attempts = totalAttempts || tasksCompleted + 5 // Mock failed attempts
  return Math.round((tasksCompleted / attempts) * 100)
}

export function generateDailyQuests(): DailyQuest[] {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const questTypes: DailyQuestType[] = ["complete_tasks", "visit_realms", "earn_xp", "defeat_enemies"]
  const selectedQuests = questTypes.slice(0, 3) // 3 daily quests

  return selectedQuests.map((type, index) => {
    const targets = DAILY_QUEST_TARGETS[type]
    const target = targets[Math.floor(Math.random() * targets.length)]
    const baseReward = DAILY_QUEST_TYPES[type].baseReward

    return {
      id: `daily_${type}_${today.getTime()}_${index}`,
      title: DAILY_QUEST_TYPES[type].title,
      description: DAILY_QUEST_TYPES[type].description.replace("{target}", target.toString()),
      xpReward: baseReward + target * 5,
      progress: 0,
      target,
      completed: false,
      expiresAt: tomorrow.toISOString(),
      questType: type,
    }
  })
}

export function updateDailyQuestProgress(quests: DailyQuest[], questType: DailyQuestType, increment = 1): DailyQuest[] {
  return quests.map((quest) => {
    if (quest.questType === questType && !quest.completed) {
      const newProgress = Math.min(quest.progress + increment, quest.target)
      return {
        ...quest,
        progress: newProgress,
        completed: newProgress >= quest.target,
      }
    }
    return quest
  })
}

export function isDailyQuestExpired(quest: DailyQuest): boolean {
  return new Date() > new Date(quest.expiresAt)
}

export function getDailyQuestIcon(questType: DailyQuestType): string {
  return DAILY_QUEST_TYPES[questType].icon
}

export function createCustomDailyQuest(questData: CreateCustomQuestData): CustomDailyQuest {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: questData.title,
    description: questData.description,
    xpReward: questData.xpReward,
    progress: 0,
    target: questData.target,
    completed: false,
    expiresAt: tomorrow.toISOString(),
    questType: "custom",
    isCustom: true,
  }
}

export function updateCustomQuestProgress(quest: CustomDailyQuest): CustomDailyQuest {
  const newProgress = Math.min(quest.progress + 1, quest.target)
  return {
    ...quest,
    progress: newProgress,
    completed: newProgress >= quest.target,
  }
}
