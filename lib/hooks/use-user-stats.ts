"use client"

import { useState, useEffect, useCallback } from "react"
import { userService, analyticsService } from "@/lib/api/services"
import { useAuth } from "@/lib/contexts/auth-context"
import { useUI } from "@/lib/contexts/ui-context"
import type { Badge } from "@/lib/types/realm-quest"
import type { ApiState } from "@/lib/types/api"

interface UserStats {
  totalXP: number
  level: number
  completedTasks: number
  activeRealms: number
  badges: Badge[]
  streak: number
}

interface DashboardStats {
  totalXP: number
  level: number
  completedTasks: number
  activeRealms: number
  weeklyProgress: number[]
  recentActivity: any[]
}

interface UseUserStatsReturn {
  stats: ApiState<UserStats>
  dashboardStats: ApiState<DashboardStats>
  xpHistory: ApiState<{ date: string; xp: number }[]>
  refreshStats: () => Promise<void>
  refreshDashboard: () => Promise<void>
  fetchXPHistory: (days?: number) => Promise<void>
}

export function useUserStats(): UseUserStatsReturn {
  const { state: authState } = useAuth()
  const { addNotification } = useUI()

  const [stats, setStats] = useState<ApiState<UserStats>>({
    data: null,
    loading: false,
    error: null,
  })

  const [dashboardStats, setDashboardStats] = useState<ApiState<DashboardStats>>({
    data: null,
    loading: false,
    error: null,
  })

  const [xpHistory, setXpHistory] = useState<ApiState<{ date: string; xp: number }[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const refreshStats = useCallback(async () => {
    if (!authState.isAuthenticated) return

    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }))
      const response = await userService.getUserStats()
      setStats({
        data: response.data,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch user stats",
      }))
      addNotification({
        type: "error",
        title: "Stats Error",
        message: "Failed to load user statistics",
      })
    }
  }, [authState.isAuthenticated, addNotification])

  const refreshDashboard = useCallback(async () => {
    if (!authState.isAuthenticated) return

    try {
      setDashboardStats((prev) => ({ ...prev, loading: true, error: null }))
      const response = await analyticsService.getDashboardStats()
      setDashboardStats({
        data: response.data,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      setDashboardStats((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch dashboard stats",
      }))
      addNotification({
        type: "error",
        title: "Dashboard Error",
        message: "Failed to load dashboard statistics",
      })
    }
  }, [authState.isAuthenticated, addNotification])

  const fetchXPHistory = useCallback(
    async (days = 30) => {
      if (!authState.isAuthenticated) return

      try {
        setXpHistory((prev) => ({ ...prev, loading: true, error: null }))
        const response = await analyticsService.getXPHistory(days)
        setXpHistory({
          data: response.data,
          loading: false,
          error: null,
        })
      } catch (error: any) {
        setXpHistory((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to fetch XP history",
        }))
        addNotification({
          type: "error",
          title: "History Error",
          message: "Failed to load XP history",
        })
      }
    },
    [authState.isAuthenticated, addNotification],
  )

  // Auto-fetch stats when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      refreshStats()
      refreshDashboard()
    }
  }, [authState.isAuthenticated, refreshStats, refreshDashboard])

  return {
    stats,
    dashboardStats,
    xpHistory,
    refreshStats,
    refreshDashboard,
    fetchXPHistory,
  }
}
