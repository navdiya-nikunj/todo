"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import { realmService } from "@/lib/api/services"
import type { Realm } from "@/lib/types/realm-quest"
import type { ApiState, PaginationState } from "@/lib/types/api"

// Realm State
interface RealmState {
  realms: ApiState<Realm[]> & { pagination: PaginationState | null }
  currentRealm: ApiState<Realm>
  realmStats: ApiState<any>
}

// Realm Actions
type RealmAction =
  | { type: "FETCH_REALMS_START" }
  | { type: "FETCH_REALMS_SUCCESS"; payload: { data: Realm[]; pagination: PaginationState } }
  | { type: "FETCH_REALMS_ERROR"; payload: string }
  | { type: "FETCH_REALM_START" }
  | { type: "FETCH_REALM_SUCCESS"; payload: Realm }
  | { type: "FETCH_REALM_ERROR"; payload: string }
  | { type: "CREATE_REALM_SUCCESS"; payload: Realm }
  | { type: "UPDATE_REALM_SUCCESS"; payload: Realm }
  | { type: "DELETE_REALM_SUCCESS"; payload: string }
  | { type: "FETCH_STATS_START" }
  | { type: "FETCH_STATS_SUCCESS"; payload: any }
  | { type: "FETCH_STATS_ERROR"; payload: string }

// Realm Context
interface RealmContextType {
  state: RealmState
  fetchRealms: (page?: number, limit?: number) => Promise<void>
  fetchRealmById: (id: string) => Promise<void>
  createRealm: (realmData: any) => Promise<Realm>
  updateRealm: (id: string, realmData: any) => Promise<void>
  deleteRealm: (id: string) => Promise<void>
  fetchRealmStats: (id: string) => Promise<void>
}

const RealmContext = createContext<RealmContextType | undefined>(undefined)

// Realm Reducer
function realmReducer(state: RealmState, action: RealmAction): RealmState {
  switch (action.type) {
    case "FETCH_REALMS_START":
      return {
        ...state,
        realms: { ...state.realms, loading: true, error: null },
      }
    case "FETCH_REALMS_SUCCESS":
      return {
        ...state,
        realms: {
          data: action.payload.data,
          loading: false,
          error: null,
          pagination: action.payload.pagination,
        },
      }
    case "FETCH_REALMS_ERROR":
      return {
        ...state,
        realms: { ...state.realms, loading: false, error: action.payload },
      }
    case "FETCH_REALM_START":
      return {
        ...state,
        currentRealm: { ...state.currentRealm, loading: true, error: null },
      }
    case "FETCH_REALM_SUCCESS":
      return {
        ...state,
        currentRealm: {
          data: action.payload,
          loading: false,
          error: null,
        },
      }
    case "FETCH_REALM_ERROR":
      return {
        ...state,
        currentRealm: { ...state.currentRealm, loading: false, error: action.payload },
      }
    case "CREATE_REALM_SUCCESS":
      return {
        ...state,
        realms: {
          ...state.realms,
          data: state.realms.data ? [action.payload, ...state.realms.data] : [action.payload],
        },
      }
    case "UPDATE_REALM_SUCCESS":
      return {
        ...state,
        realms: {
          ...state.realms,
          data: state.realms.data?.map((realm) => (realm.id === action.payload.id ? action.payload : realm)) || null,
        },
        currentRealm: {
          ...state.currentRealm,
          data: state.currentRealm.data?.id === action.payload.id ? action.payload : state.currentRealm.data,
        },
      }
    case "DELETE_REALM_SUCCESS":
      return {
        ...state,
        realms: {
          ...state.realms,
          data: state.realms.data?.filter((realm) => realm.id !== action.payload) || null,
        },
      }
    case "FETCH_STATS_START":
      return {
        ...state,
        realmStats: { ...state.realmStats, loading: true, error: null },
      }
    case "FETCH_STATS_SUCCESS":
      return {
        ...state,
        realmStats: {
          data: action.payload,
          loading: false,
          error: null,
        },
      }
    case "FETCH_STATS_ERROR":
      return {
        ...state,
        realmStats: { ...state.realmStats, loading: false, error: action.payload },
      }
    default:
      return state
  }
}

// Initial State
const initialState: RealmState = {
  realms: { data: null, loading: false, error: null, pagination: null },
  currentRealm: { data: null, loading: false, error: null },
  realmStats: { data: null, loading: false, error: null },
}

// Realm Provider
export function RealmProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(realmReducer, initialState)

  const fetchRealms = async (page = 1, limit = 10) => {
    try {
      dispatch({ type: "FETCH_REALMS_START" })
      const response = await realmService.getRealms(page, limit)
      dispatch({
        type: "FETCH_REALMS_SUCCESS",
        payload: { data: response.data, pagination: response.pagination },
      })
    } catch (error: any) {
      dispatch({ type: "FETCH_REALMS_ERROR", payload: error.message || "Failed to fetch realms" })
    }
  }

  const fetchRealmById = async (id: string) => {
    try {
      dispatch({ type: "FETCH_REALM_START" })
      const response = await realmService.getRealmById(id)
      dispatch({ type: "FETCH_REALM_SUCCESS", payload: response.data })
    } catch (error: any) {
      dispatch({ type: "FETCH_REALM_ERROR", payload: error.message || "Failed to fetch realm" })
    }
  }

  const createRealm = async (realmData: any) => {
    try {
      const response = await realmService.createRealm(realmData)
      dispatch({ type: "CREATE_REALM_SUCCESS", payload: response.data })
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  const updateRealm = async (id: string, realmData: any) => {
    try {
      const response = await realmService.updateRealm(id, realmData)
      dispatch({ type: "UPDATE_REALM_SUCCESS", payload: response.data })
    } catch (error: any) {
      throw error
    }
  }

  const deleteRealm = async (id: string) => {
    try {
      await realmService.deleteRealm(id)
      dispatch({ type: "DELETE_REALM_SUCCESS", payload: id })
    } catch (error: any) {
      throw error
    }
  }

  const fetchRealmStats = async (id: string) => {
    try {
      dispatch({ type: "FETCH_STATS_START" })
      const response = await realmService.getRealmStats(id)
      dispatch({ type: "FETCH_STATS_SUCCESS", payload: response.data })
    } catch (error: any) {
      dispatch({ type: "FETCH_STATS_ERROR", payload: error.message || "Failed to fetch stats" })
    }
  }

  return (
    <RealmContext.Provider
      value={{
        state,
        fetchRealms,
        fetchRealmById,
        createRealm,
        updateRealm,
        deleteRealm,
        fetchRealmStats,
      }}
    >
      {children}
    </RealmContext.Provider>
  )
}

// Realm Hook
export function useRealm() {
  const context = useContext(RealmContext)
  if (context === undefined) {
    throw new Error("useRealm must be used within a RealmProvider")
  }
  return context
}
