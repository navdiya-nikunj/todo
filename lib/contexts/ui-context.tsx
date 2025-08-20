"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

// UI State
interface UIState {
  notifications: Notification[]
  modals: {
    levelUp: { isOpen: boolean; data: any }
    badgeEarned: { isOpen: boolean; data: any }
    taskComplete: { isOpen: boolean; data: any }
  }
  loading: {
    global: boolean
    tasks: Record<string, boolean>
  }
  theme: "dark" | "light"
}

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
  timestamp: number
}

// UI Actions
type UIAction =
  | { type: "ADD_NOTIFICATION"; payload: Omit<Notification, "id" | "timestamp"> }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "OPEN_MODAL"; payload: { modal: keyof UIState["modals"]; data?: any } }
  | { type: "CLOSE_MODAL"; payload: keyof UIState["modals"] }
  | { type: "SET_GLOBAL_LOADING"; payload: boolean }
  | { type: "SET_TASK_LOADING"; payload: { taskId: string; loading: boolean } }
  | { type: "SET_THEME"; payload: "dark" | "light" }

// UI Context
interface UIContextType {
  state: UIState
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  openModal: (modal: keyof UIState["modals"], data?: any) => void
  closeModal: (modal: keyof UIState["modals"]) => void
  setGlobalLoading: (loading: boolean) => void
  setTaskLoading: (taskId: string, loading: boolean) => void
  setTheme: (theme: "dark" | "light") => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

// UI Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      }
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
      }
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }
    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      }
    case "OPEN_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: {
            isOpen: true,
            data: action.payload.data || null,
          },
        },
      }
    case "CLOSE_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: {
            isOpen: false,
            data: null,
          },
        },
      }
    case "SET_GLOBAL_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          global: action.payload,
        },
      }
    case "SET_TASK_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          tasks: {
            ...state.loading.tasks,
            [action.payload.taskId]: action.payload.loading,
          },
        },
      }
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      }
    default:
      return state
  }
}

// Initial State
const initialState: UIState = {
  notifications: [],
  modals: {
    levelUp: { isOpen: false, data: null },
    badgeEarned: { isOpen: false, data: null },
    taskComplete: { isOpen: false, data: null },
  },
  loading: {
    global: false,
    tasks: {},
  },
  theme: "dark",
}

// UI Provider
export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState)

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification })

    // Auto-remove notification after duration
    const duration = notification.duration || 5000
    setTimeout(() => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: notification.id || "" })
    }, duration)
  }

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id })
  }

  const clearNotifications = () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" })
  }

  const openModal = (modal: keyof UIState["modals"], data?: any) => {
    dispatch({ type: "OPEN_MODAL", payload: { modal, data } })
  }

  const closeModal = (modal: keyof UIState["modals"]) => {
    dispatch({ type: "CLOSE_MODAL", payload: modal })
  }

  const setGlobalLoading = (loading: boolean) => {
    dispatch({ type: "SET_GLOBAL_LOADING", payload: loading })
  }

  const setTaskLoading = (taskId: string, loading: boolean) => {
    dispatch({ type: "SET_TASK_LOADING", payload: { taskId, loading } })
  }

  const setTheme = (theme: "dark" | "light") => {
    dispatch({ type: "SET_THEME", payload: theme })
  }

  return (
    <UIContext.Provider
      value={{
        state,
        addNotification,
        removeNotification,
        clearNotifications,
        openModal,
        closeModal,
        setGlobalLoading,
        setTaskLoading,
        setTheme,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

// UI Hook
export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider")
  }
  return context
}
