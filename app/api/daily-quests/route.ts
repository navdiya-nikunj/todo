import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import DailyQuest from "@/lib/db/models/DailyQuest"
import { withAuth } from "@/lib/auth/middleware"

// Generate daily quests for a user
async function generateDailyQuests(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Check if user already has quests for today
  const existingQuests = await DailyQuest.find({
    userId,
    createdAt: { $gte: today },
    isCustom: false,
  })

  if (existingQuests.length > 0) {
    return existingQuests
  }

  // Generate 3 random daily quests
  const questTemplates = [
    {
      title: "Task Warrior",
      description: "Complete 3 tasks today",
      questType: "complete_tasks",
      target: 3,
      xpReward: 30,
    },
    {
      title: "Realm Explorer",
      description: "Visit 2 different realms",
      questType: "visit_realms",
      target: 2,
      xpReward: 20,
    },
    {
      title: "XP Hunter",
      description: "Earn 50 XP today",
      questType: "earn_xp",
      target: 50,
      xpReward: 25,
    },
    {
      title: "Enemy Slayer",
      description: "Defeat 5 enemies (complete tasks)",
      questType: "defeat_enemies",
      target: 5,
      xpReward: 40,
    },
    {
      title: "Streak Keeper",
      description: "Maintain your daily streak",
      questType: "maintain_streak",
      target: 1,
      xpReward: 35,
    },
  ]

  // Randomly select 3 quests
  const selectedQuests = questTemplates.sort(() => 0.5 - Math.random()).slice(0, 3)

  const quests = selectedQuests.map(
    (quest) =>
      new DailyQuest({
        userId,
        title: quest.title,
        description: quest.description,
        questType: quest.questType,
        target: quest.target,
        xpReward: quest.xpReward,
        progress: 0,
        completed: false,
        isCustom: false,
        expiresAt: tomorrow,
      }),
  )

  await DailyQuest.insertMany(quests)
  return quests
}

export const GET = withAuth(async (request) => {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const includeExpired = searchParams.get("includeExpired") === "true"

    // Generate daily quests if needed
    await generateDailyQuests(request.user.userId)

    // Build filter
    const filter: any = { userId: request.user.userId }

    if (!includeExpired) {
      filter.expiresAt = { $gt: new Date() }
    }

    // Get daily quests
    const quests = await DailyQuest.find(filter).sort({ createdAt: -1 })

    const formattedQuests = quests.map((quest) => ({
      id: quest._id.toString(),
      title: quest.title,
      description: quest.description,
      questType: quest.questType,
      target: quest.target,
      progress: quest.progress,
      xpReward: quest.xpReward,
      completed: quest.completed,
      isCustom: quest.isCustom,
      expiresAt: quest.expiresAt,
      createdAt: quest.createdAt,
    }))

    return NextResponse.json(
      {
        success: true,
        data: formattedQuests,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get daily quests error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})

export const POST = withAuth(async (request) => {
  try {
    await connectDB()

    const { title, description, target, xpReward } = await request.json()

    // Validate required fields
    if (!title || !description || !target || !xpReward) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, target, and XP reward are required",
        },
        { status: 400 },
      )
    }

    // Validate values
    if (target < 1 || target > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Target must be between 1 and 100",
        },
        { status: 400 },
      )
    }

    if (xpReward < 1 || xpReward > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "XP reward must be between 1 and 200",
        },
        { status: 400 },
      )
    }

    // Create custom daily quest
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const quest = new DailyQuest({
      userId: request.user.userId,
      title: title.trim(),
      description: description.trim(),
      questType: "custom",
      target,
      xpReward,
      progress: 0,
      completed: false,
      isCustom: true,
      expiresAt: tomorrow,
    })

    await quest.save()

    const questData = {
      id: quest._id.toString(),
      title: quest.title,
      description: quest.description,
      questType: quest.questType,
      target: quest.target,
      progress: quest.progress,
      xpReward: quest.xpReward,
      completed: quest.completed,
      isCustom: quest.isCustom,
      expiresAt: quest.expiresAt,
      createdAt: quest.createdAt,
    }

    return NextResponse.json(
      {
        success: true,
        message: "Custom daily quest created successfully",
        data: questData,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create daily quest error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})


