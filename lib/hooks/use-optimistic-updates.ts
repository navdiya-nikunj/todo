"use client"

import { useState, useCallback } from "react"
import type { OptimisticUpdate } from "@/lib/types/api"

interface UseOptimisticUpdatesReturn<T> {
  data: T[]
  pendingUpdates: OptimisticUpdate<T>[]
  addOptimisticUpdate: (update: Omit<OptimisticUpdate<T>, "timestamp">) => void
  removeOptimisticUpdate: (id: string) => void
  clearOptimisticUpdates: () => void
  applyOptimisticUpdates: (serverData: T[]) => T[]
}

export function useOptimisticUpdates<T extends { id: string }>(initialData: T[] = []): UseOptimisticUpdatesReturn<T> {
  const [data, setData] = useState<T[]>(initialData)
  const [pendingUpdates, setPendingUpdates] = useState<OptimisticUpdate<T>[]>([])

  const addOptimisticUpdate = useCallback((update: Omit<OptimisticUpdate<T>, "timestamp">) => {
    const optimisticUpdate: OptimisticUpdate<T> = {
      ...update,
      timestamp: Date.now(),
    }

    setPendingUpdates((prev) => [...prev, optimisticUpdate])

    // Apply optimistic update to local data
    setData((prev) => {
      switch (update.type) {
        case "create":
          return [update.data, ...prev]
        case "update":
          return prev.map((item) => (item.id === update.id ? { ...item, ...update.data } : item))
        case "delete":
          return prev.filter((item) => item.id !== update.id)
        default:
          return prev
      }
    })
  }, [])

  const removeOptimisticUpdate = useCallback((id: string) => {
    setPendingUpdates((prev) => prev.filter((update) => update.id !== id))
  }, [])

  const clearOptimisticUpdates = useCallback(() => {
    setPendingUpdates([])
  }, [])

  const applyOptimisticUpdates = useCallback(
    (serverData: T[]): T[] => {
      let result = [...serverData]

      // Apply pending optimistic updates to server data
      pendingUpdates.forEach((update) => {
        switch (update.type) {
          case "create":
            // Only add if not already in server data
            if (!result.find((item) => item.id === update.data.id)) {
              result = [update.data, ...result]
            }
            break
          case "update":
            result = result.map((item) => (item.id === update.id ? { ...item, ...update.data } : item))
            break
          case "delete":
            result = result.filter((item) => item.id !== update.id)
            break
        }
      })

      return result
    },
    [pendingUpdates],
  )

  return {
    data,
    pendingUpdates,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    clearOptimisticUpdates,
    applyOptimisticUpdates,
  }
}
