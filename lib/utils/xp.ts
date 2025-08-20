// XP and level calculation utilities
export function calculateLevelFromXP(xp: number): number {
  let level = 1
  let requiredXP = 0

  while (requiredXP <= xp) {
    level++
    requiredXP += (level - 1) * 100
  }

  return level - 1
}

export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0

  let totalXP = 0
  for (let i = 2; i <= level; i++) {
    totalXP += (i - 1) * 100
  }

  return totalXP
}

export function calculateXPNeededForNextLevel(currentXP: number, currentLevel: number): number {
  const xpForNextLevel = calculateXPForLevel(currentLevel + 1)
  return Math.max(0, xpForNextLevel - currentXP)
}

export function getXPRewardForDifficulty(difficulty: "easy" | "medium" | "hard"): number {
  switch (difficulty) {
    case "easy":
      return 10
    case "medium":
      return 25
    case "hard":
      return 50
    default:
      return 10
  }
}

export function calculateStreakMultiplier(streak: number): number {
  if (streak >= 7) return 2.0 // 2x multiplier for 7+ day streak
  if (streak >= 3) return 1.5 // 1.5x multiplier for 3+ day streak
  return 1.0 // No multiplier
}
