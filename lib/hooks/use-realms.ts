"use client"

import { useCallback } from "react"
import { useRealm } from "@/lib/contexts/realm-context"
import { useUI } from "@/lib/contexts/ui-context"
import type { Realm } from "@/lib/types/realm-quest"

interface UseRealmsReturn {
  realms: typeof useRealm extends () => infer T ? T["state"]["realms"] : never
  currentRealm: typeof useRealm extends () => infer T ? T["state"]["currentRealm"] : never
  realmStats: typeof useRealm extends () => infer T ? T["state"]["realmStats"] : never
  fetchRealms: (page?: number, limit?: number) => Promise<void>
  fetchRealmById: (id: string) => Promise<void>
  createRealm: (realmData: any) => Promise<Realm>
  updateRealm: (id: string, realmData: any) => Promise<void>
  deleteRealm: (id: string) => Promise<void>
  fetchRealmStats: (id: string) => Promise<void>
}

export function useRealms(): UseRealmsReturn {
  const realmContext = useRealm()
  const { addNotification } = useUI()

  const createRealmWithNotification = useCallback(
    async (realmData: any): Promise<Realm> => {
      try {
        const realm = await realmContext.createRealm(realmData)
        addNotification({
          type: "success",
          title: "Realm Forged!",
          message: `${realm.name} has been created successfully`,
        })
        return realm
      } catch (error: any) {
        addNotification({
          type: "error",
          title: "Realm Creation Failed",
          message: error.message || "Failed to create realm",
        })
        throw error
      }
    },
    [realmContext, addNotification],
  )

  const updateRealmWithNotification = useCallback(
    async (id: string, realmData: any): Promise<void> => {
      try {
        await realmContext.updateRealm(id, realmData)
        addNotification({
          type: "success",
          title: "Realm Updated",
          message: "Realm has been modified successfully",
        })
      } catch (error: any) {
        addNotification({
          type: "error",
          title: "Update Failed",
          message: error.message || "Failed to update realm",
        })
        throw error
      }
    },
    [realmContext, addNotification],
  )

  const deleteRealmWithNotification = useCallback(
    async (id: string): Promise<void> => {
      try {
        await realmContext.deleteRealm(id)
        addNotification({
          type: "success",
          title: "Realm Destroyed",
          message: "Realm has been permanently removed",
        })
      } catch (error: any) {
        addNotification({
          type: "error",
          title: "Destruction Failed",
          message: error.message || "Failed to delete realm",
        })
        throw error
      }
    },
    [realmContext, addNotification],
  )

  return {
    realms: realmContext.state.realms,
    currentRealm: realmContext.state.currentRealm,
    realmStats: realmContext.state.realmStats,
    fetchRealms: realmContext.fetchRealms,
    fetchRealmById: realmContext.fetchRealmById,
    createRealm: createRealmWithNotification,
    updateRealm: updateRealmWithNotification,
    deleteRealm: deleteRealmWithNotification,
    fetchRealmStats: realmContext.fetchRealmStats,
  }
}
