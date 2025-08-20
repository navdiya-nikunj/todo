// Task utility functions
export function validateTaskData(data: {
  title?: string
  description?: string
  difficulty?: string
  dueDate?: string
}) {
  const errors: string[] = []

  if (data.title && (data.title.length < 3 || data.title.length > 100)) {
    errors.push("Task title must be between 3 and 100 characters")
  }

  if (data.description && (data.description.length < 10 || data.description.length > 500)) {
    errors.push("Description must be between 10 and 500 characters")
  }

  if (data.difficulty) {
    const validDifficulties = ["easy", "medium", "hard"]
    if (!validDifficulties.includes(data.difficulty)) {
      errors.push("Invalid difficulty selected")
    }
  }

  if (data.dueDate && new Date(data.dueDate) < new Date()) {
    errors.push("Due date cannot be in the past")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function getTaskStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "text-green-500"
    case "pending":
      return "text-yellow-500"
    default:
      return "text-gray-500"
  }
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "text-green-500"
    case "medium":
      return "text-yellow-500"
    case "hard":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

export function calculateTaskPriority(task: {
  difficulty: string
  dueDate?: Date
  createdAt: Date
}): number {
  let priority = 0

  // Base priority from difficulty
  switch (task.difficulty) {
    case "easy":
      priority += 1
      break
    case "medium":
      priority += 2
      break
    case "hard":
      priority += 3
      break
  }

  // Add urgency based on due date
  if (task.dueDate) {
    const now = new Date()
    const daysUntilDue = Math.ceil((task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilDue <= 1) {
      priority += 5 // Very urgent
    } else if (daysUntilDue <= 3) {
      priority += 3 // Urgent
    } else if (daysUntilDue <= 7) {
      priority += 1 // Somewhat urgent
    }
  }

  // Add age factor (older tasks get slightly higher priority)
  const ageInDays = Math.ceil((new Date().getTime() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  priority += Math.min(ageInDays * 0.1, 2) // Max 2 points for age

  return priority
}

export function isTaskOverdue(task: { dueDate?: Date; status: string }): boolean {
  if (!task.dueDate || task.status === "completed") {
    return false
  }

  return new Date() > task.dueDate
}

export function getTaskCompletionTime(task: { createdAt: Date; completedAt?: Date }): number | null {
  if (!task.completedAt) {
    return null
  }

  return task.completedAt.getTime() - task.createdAt.getTime()
}
