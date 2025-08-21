"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { authService, userService } from "@/lib/api/services"
import type { User } from "@/lib/types/realm-quest"
import type { ApiState } from "@/lib/types/api"
import Cookies from "js-cookie"
// Auth State
interface AuthState extends ApiState<User> {
  isAuthenticated: boolean
  token: string | null
}

// Auth Actions
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; accessToken: string } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }

// Auth Context
interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  updateAvatar: (avatarId: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null }
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload.user,
        token: action.payload.accessToken,
        isAuthenticated: true,
      }
    case "AUTH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null,
        token: null,
        isAuthenticated: false,
      }
    case "UPDATE_USER":
      return {
        ...state,
        data: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        data: null,
        token: null,
        isAuthenticated: false,
        error: null,
      }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

// Initial State
const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  token: null,
}

// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
     
      const token = Cookies.get("token")
    
      if (token) {
        try {
          console.log("Getting current user")
          dispatch({ type: "AUTH_START" })
         
          const response = await authService.getCurrentUser()

          dispatch({
            type: "AUTH_SUCCESS",
            payload: { user: response.data, accessToken: token },
          })
          
        
        } catch (error: any) {
          // Try to refresh token if available
          const refreshToken = Cookies.get("refresh_token")
          if (refreshToken) {
            try {
              const refreshResponse = await authService.refreshToken()
              const userResponse = await authService.getCurrentUser()
              dispatch({
                type: "AUTH_SUCCESS",
                payload: { user: userResponse.data, accessToken: refreshResponse.data.accessToken },
              })
            } catch (refreshError) {
              dispatch({ type: "AUTH_ERROR", payload: "Session expired" })
              Cookies.remove("token")
              Cookies.remove("refresh_token")
            }
          } else {
            dispatch({ type: "AUTH_ERROR", payload: "Session expired" })
            Cookies.remove("token")
          }
        }
      }
    }

    checkAuth()
  }, [])
useEffect(() => {
  console.log("Auth state changed", state)
}, [state])

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" })
      const response = await authService.login({ email, password })
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.data.user, accessToken: response.data.accessToken },
      })
    } catch (error: any) {
      dispatch({ type: "AUTH_ERROR", payload: error.message || "Login failed" })
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" })
      const response = await authService.register({ username, email, password })
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.data.user, accessToken: response.data.accessToken },
      })
    } catch (error: any) {
      dispatch({ type: "AUTH_ERROR", payload: error.message || "Registration failed" })
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      dispatch({ type: "LOGOUT" })
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await userService.updateProfile(userData)
      dispatch({ type: "UPDATE_USER", payload: response.data })
    } catch (error: any) {
      dispatch({ type: "AUTH_ERROR", payload: error.message || "Update failed" })
      throw error
    }
  }

  const updateAvatar = async (avatarId: string) => {
    try {
      await userService.updateAvatar(avatarId)
      // Update the avatar in the current user state
      if (state.data) {
        dispatch({ type: "UPDATE_USER", payload: { ...state.data, avatar: avatarId } })
      }
    } catch (error: any) {
      dispatch({ type: "AUTH_ERROR", payload: error.message || "Avatar update failed" })
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        updateProfile,
        updateAvatar,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Auth Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
