"use client"

import { useState, useEffect, useCallback } from "react"
import { taskService } from "@/lib/api/services"
import { useUI } from "@/lib/contexts/ui-context"
import type { Task } from "@/lib/types/realm-quest"
import type { ApiState, PaginationState } from "@/lib/types/api"

interface UseTasksOptions {
  realmId: string
  filters?: {
    completed?: boolean
    difficulty?: string
  }
  autoFetch?: boolean
}

interface UseTasksReturn {
  tasks: ApiState<Task[]> & { pagination: PaginationState | null }
  createTask: (taskData: any) => Promise<Task>
  updateTask: (taskId: string, taskData: any) => Promise<Task>
  deleteTask: (taskId: string) => Promise<void>
  completeTask: (taskId: string) => Promise<any>
  uncompleteTask: (taskId: string) => Promise<Task>
  refetch: () => Promise<void>
  loadMore: () => Promise<void>
}

export function useTasks({ realmId, filters, autoFetch = true }: UseTasksOptions): UseTasksReturn {
  const { addNotification, openModal } = useUI()
  const [tasks, setTasks] = useState<ApiState<Task[]> & { pagination: PaginationState | null }>({
    data: null,
    loading: false,
    error: null,
    pagination: null,
  })
  const [page, setPage] = useState(1)

  const fetchTasks = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        setTasks((prev) => ({ ...prev, loading: true, error: null }))
        const response = await taskService.getTasks(realmId, {
          ...filters,
          page: pageNum,
          limit: 10,
        })

        setTasks((prev) => ({
          data: append && prev.data ? [...prev.data, ...response.data] : response.data,
          loading: false,
          error: null,
          pagination: response.pagination,
        }))
      } catch (error: any) {
        setTasks((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to fetch tasks",
        }))
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to load tasks",
        })
      }
    },
    [realmId, filters, addNotification],
  )

  const createTask = useCallback(
    async (taskData: any): Promise<Task> => {
      try {
        const response = await taskService.createTask(realmId, taskData)

        // Optimistic update
        setTasks((prev) => ({
          ...prev,
          data: prev.data ? [response.data, ...prev.data] : [response.data],
        }))

        addNotification({
          type: "success",
          title: "Enemy Summoned!",
          message: `${response.data.title} has entered the realm`,
        })

        return response.data
      } catch (error: any) {
        addNotification({
          type: "error",
          title: "Summoning Failed",
          message: error.message || "Failed to create task",
        })
        throw error
      }
    },
    [realmId, addNotification],
  )

  const updateTask = useCallback(
    async (taskId: string, taskData: any): Promise<Task> => {
      try {
        const response = await taskService.updateTask(realmId, taskId, taskData)

        // Optimistic update
        setTasks((prev) => ({
          ...prev,
          data: prev.data?.map((task) => (task.id === taskId ? response.data : task)) || null,
        }))

        addNotification({
          type: "success",
          title: "Enemy Updated",
          message: "Task has been modified",
        })

        return response.data
      } catch (error: any) {
        addNotification({
          type: "error",
          title: "Update Failed",
          message: error.message || "Failed to update task",
        })
        throw error
      }
    },
    [realmId, addNotification],
  )

  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      try {
        await taskService.deleteTask(realmId, taskId)

        // Optimistic update
        setTasks((prev) => ({
          ...prev,
          data: prev.data?.filter((task) => task.id !== taskId) || null,
        }))

        addNotification({
          type: "success",
          title: "Enemy Banished",
          message: "Task has been removed from the realm",
        })
      } catch (error: any) {
        addNotification({
          type: "error",
          title: "Banishment Failed",
          message: error.message || "Failed to delete task",
        })
        throw error
      }
    },
    [realmId, addNotification],
  )

  const completeTask = useCallback(
    async (taskId: string): Promise<any> => {
      try {
        const response = await taskService.completeTask(realmId, taskId)

        // Optimistic update
        setTasks((prev) => ({
          ...prev,
          data: prev.data?.map((task) => (task.id === taskId ? response.data.task : task)) || null,
        }))

        // Show reward modal
        openModal("taskComplete", {
          xpGained: response.data.xpGained,
          levelUp: response.data.levelUp,
          newBadges: response.data.newBadges,
        })

        if (response.data.levelUp) {
          openModal("levelUp", response.data)
        }

        if (response.data.newBadges?.length > 0) {
          openModal("badgeEarned", { badges: response.data.newBadges })
        }

        return response.data
      } catch (error: any) {
        addNotification({
          type: "error",
          title: "Battle Failed",
          message: error.message || "Failed to complete task",
        })
        throw error
      }
    },
    [realmId, addNotification, openModal],
  )

  const uncompleteTask = useCallback(
    async (taskId: string): Promise<Task> => {
      try {
        const response = await taskService.uncompleteTask(realmId, taskId)

        // Optimistic update
        setTasks((prev) => ({
          ...prev,
          data: prev.data?.map((task) => (task.id === taskId ? response.data : task)) || null,
        }))

        return response.data
      } catch (error: any) {
        addNotification({
          type: "error",
          title: "Uncomplete Failed",
          message: error.message || "Failed to uncomplete task",
        })
        throw error
      }
    },
    [realmId, addNotification],
  )

  const refetch = useCallback(() => {
    setPage(1)
    return fetchTasks(1, false)
  }, [fetchTasks])

  const loadMore = useCallback(() => {
    if (tasks.pagination && page < tasks.pagination.totalPages) {
      const nextPage = page + 1
      setPage(nextPage)
      return fetchTasks(nextPage, true)
    }
    return Promise.resolve()
  }, [fetchTasks, tasks.pagination, page])

  // Auto-fetch on mount and dependency changes
  useEffect(() => {
    if (autoFetch && realmId) {
      fetchTasks(1, false)
    }
  }, [autoFetch, realmId, fetchTasks])

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    refetch,
    loadMore,
  }
}
