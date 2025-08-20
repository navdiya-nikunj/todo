import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Realm from "@/lib/db/models/Realm"
import Task from "@/lib/db/models/Task"
import XPHistory from "@/lib/db/models/XPHistory"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { id } = params

    const realm = await Realm.findOne({
      _id: id,
      userId: request.user.userId,
    })

    if (!realm) {
      return NextResponse.json(
        {
          success: false,
          message: "Realm not found",
        },
        { status: 404 },
      )
    }

    // Get detailed task statistics
    const [taskStats, recentTasks, xpHistory] = await Promise.all([
      Task.aggregate([
        { $match: { realmId: realm._id } },
        {
          $group: {
            _id: "$difficulty",
            count: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            totalXP: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$xpReward", 0] },
            },
          },
        },
      ]),
      Task.find({ realmId: id })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("title status difficulty xpReward completedAt"),
      XPHistory.find({
        userId: request.user.userId,
        source: { $regex: "task_completion" },
      })
        .populate({
          path: "taskId",
          match: { realmId: id },
          select: "title difficulty",
        })
        .sort({ createdAt: -1 })
        .limit(10),
    ])

    // Calculate completion rate by difficulty
    const difficultyStats = taskStats.reduce(
      (acc, stat) => {
        acc[stat._id] = {
          total: stat.count,
          completed: stat.completed,
          completionRate: stat.count > 0 ? (stat.completed / stat.count) * 100 : 0,
          totalXP: stat.totalXP,
        }
        return acc
      },
      {} as Record<string, any>,
    )

    // Get weekly progress (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weeklyProgress = await Task.aggregate([
      {
        $match: {
          realmId: realm._id,
          status: "completed",
          completedAt: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$completedAt" },
          },
          tasksCompleted: { $sum: 1 },
          xpEarned: { $sum: "$xpReward" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Calculate average completion time
    const completedTasks = await Task.find({
      realmId: id,
      status: "completed",
      completedAt: { $exists: true },
    }).select("createdAt completedAt")

    const completionTimes = completedTasks
      .map((task) => {
        if (task.completedAt && task.createdAt) {
          return task.completedAt.getTime() - task.createdAt.getTime()
        }
        return null
      })
      .filter((time) => time !== null)

    const averageCompletionTime =
      completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0

    const stats = {
      totalTasks: realm.totalTasks,
      completedTasks: realm.completedTasks,
      pendingTasks: realm.totalTasks - realm.completedTasks,
      completionRate: realm.totalTasks > 0 ? (realm.completedTasks / realm.totalTasks) * 100 : 0,
      totalXPEarned: realm.totalXPEarned,
      averageCompletionTime: Math.round(averageCompletionTime / (1000 * 60 * 60)), // Convert to hours
      difficultyBreakdown: {
        easy: difficultyStats.easy || { total: 0, completed: 0, completionRate: 0, totalXP: 0 },
        medium: difficultyStats.medium || { total: 0, completed: 0, completionRate: 0, totalXP: 0 },
        hard: difficultyStats.hard || { total: 0, completed: 0, completionRate: 0, totalXP: 0 },
      },
      weeklyProgress: weeklyProgress.map((day) => ({
        date: day._id,
        tasksCompleted: day.tasksCompleted,
        xpEarned: day.xpEarned,
      })),
      recentTasks: recentTasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        status: task.status,
        difficulty: task.difficulty,
        xpReward: task.xpReward,
        completedAt: task.completedAt,
      })),
      recentXPHistory: xpHistory
        .filter((entry) => entry.taskId) // Only include entries with valid taskId
        .map((entry) => ({
          id: entry._id.toString(),
          xpGained: entry.xpGained,
          taskTitle: entry.taskId?.title,
          taskDifficulty: entry.taskId?.difficulty,
          createdAt: entry.createdAt,
        })),
    }

    return NextResponse.json(
      {
        success: true,
        data: stats,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get realm stats error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
