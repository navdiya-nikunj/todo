// Realm utility functions
export function getThemeColors(theme: string) {
  const themeColors = {
    fire: {
      primary: "#FF4500",
      secondary: "#FF6B35",
      accent: "#FFD700",
      background: "from-red-900 to-orange-800",
    },
    ice: {
      primary: "#00BFFF",
      secondary: "#87CEEB",
      accent: "#E0FFFF",
      background: "from-blue-900 to-cyan-800",
    },
    nature: {
      primary: "#228B22",
      secondary: "#32CD32",
      accent: "#ADFF2F",
      background: "from-green-900 to-emerald-800",
    },
    electric: {
      primary: "#FFD700",
      secondary: "#FFFF00",
      accent: "#FFFACD",
      background: "from-yellow-900 to-amber-800",
    },
    shadow: {
      primary: "#4B0082",
      secondary: "#8A2BE2",
      accent: "#DDA0DD",
      background: "from-purple-900 to-violet-800",
    },
  }

  return themeColors[theme as keyof typeof themeColors] || themeColors.fire
}

export function calculateRealmDifficultyMultiplier(difficulty: string): number {
  switch (difficulty) {
    case "easy":
      return 1.0
    case "medium":
      return 1.2
    case "hard":
      return 1.5
    case "legendary":
      return 2.0
    default:
      return 1.0
  }
}

export function getRealmBonuses(theme: string) {
  const bonuses = {
    fire: {
      type: "xp_multiplier",
      value: 1.1,
      description: "10% bonus XP for completed tasks",
    },
    ice: {
      type: "streak_protection",
      value: true,
      description: "Streak protection on failed tasks",
    },
    nature: {
      type: "healing_bonus",
      value: 5,
      description: "Restore 5 XP on task completion",
    },
    electric: {
      type: "speed_bonus",
      value: 2.0,
      description: "Double XP for tasks completed within 1 hour",
    },
    shadow: {
      type: "risk_reward",
      value: 2.0,
      description: "Double XP but lose XP on failed tasks",
    },
  }

  return bonuses[theme as keyof typeof bonuses] || bonuses.fire
}

export function validateRealmData(data: {
  name?: string
  description?: string
  theme?: string
  difficulty?: string
}) {
  const errors: string[] = []

  if (data.name && (data.name.length < 3 || data.name.length > 50)) {
    errors.push("Realm name must be between 3 and 50 characters")
  }

  if (data.description && (data.description.length < 10 || data.description.length > 200)) {
    errors.push("Description must be between 10 and 200 characters")
  }

  if (data.theme) {
    const validThemes = ["fire", "ice", "nature", "electric", "shadow"]
    if (!validThemes.includes(data.theme)) {
      errors.push("Invalid theme selected")
    }
  }

  if (data.difficulty) {
    const validDifficulties = ["easy", "medium", "hard", "legendary"]
    if (!validDifficulties.includes(data.difficulty)) {
      errors.push("Invalid difficulty selected")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
