// Daily quest utility functions
export function updateDailyQuestProgress(
  quests: any[],
  context: {
    tasksCompleted?: number
    realmsVisited?: number
    xpEarned?: number
    currentStreak?: number
  },
) {
  const updatedQuests = []

  for (const quest of quests) {
    if (quest.completed || quest.expiresAt < new Date()) {
      continue
    }

    let progressIncrement = 0

    switch (quest.questType) {
      case "complete_tasks":
        if (context.tasksCompleted) {
          progressIncrement = 1
        }
        break
      case "visit_realms":
        if (context.realmsVisited) {
          progressIncrement = 1
        }
        break
      case "earn_xp":
        if (context.xpEarned) {
          progressIncrement = context.xpEarned
        }
        break
      case "defeat_enemies":
        if (context.tasksCompleted) {
          progressIncrement = 1
        }
        break
      case "maintain_streak":
        if (context.currentStreak && context.currentStreak > 0) {
          progressIncrement = 1
        }
        break
    }

    if (progressIncrement > 0) {
      quest.progress = Math.min(quest.progress + progressIncrement, quest.target)

      if (quest.progress >= quest.target) {
        quest.completed = true
      }

      updatedQuests.push(quest)
    }
  }

  return updatedQuests
}

export function isQuestExpired(quest: { expiresAt: Date }): boolean {
  return quest.expiresAt < new Date()
}

export function getQuestTypeIcon(questType: string): string {
  const icons = {
    complete_tasks: "✅",
    visit_realms: "🏰",
    earn_xp: "⭐",
    defeat_enemies: "⚔️",
    maintain_streak: "🔥",
    custom: "🎯",
  }

  return icons[questType as keyof typeof icons] || "📋"
}

export function getQuestDifficulty(target: number, questType: string): "easy" | "medium" | "hard" {
  const difficultyThresholds = {
    complete_tasks: { easy: 3, medium: 5, hard: 10 },
    visit_realms: { easy: 2, medium: 3, hard: 5 },
    earn_xp: { easy: 50, medium: 100, hard: 200 },
    defeat_enemies: { easy: 5, medium: 8, hard: 15 },
    maintain_streak: { easy: 1, medium: 3, hard: 7 },
    custom: { easy: 5, medium: 10, hard: 20 },
  }

  const thresholds = difficultyThresholds[questType as keyof typeof difficultyThresholds] || difficultyThresholds.custom

  if (target <= thresholds.easy) return "easy"
  if (target <= thresholds.medium) return "medium"
  return "hard"
}

export function calculateQuestXPReward(target: number, questType: string): number {
  const difficulty = getQuestDifficulty(target, questType)
  const baseReward = target * 5 // Base 5 XP per target unit

  const multipliers = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
  }

  return Math.round(baseReward * multipliers[difficulty])
}
