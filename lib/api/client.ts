// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// API Client with error handling and auth
class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
    }
  }

  getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Handle token expiration
      if (response.status === 401 && this.token && endpoint !== "/auth/refresh") {
        const refreshToken = localStorage.getItem("refresh_token")
        if (refreshToken) {
          try {
            // Try to refresh the token
            const refreshResponse = await fetch(`${this.baseURL}/auth/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            })

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json()
              this.setToken(refreshData.data.accessToken)
              localStorage.setItem("refresh_token", refreshData.data.refreshToken)

              // Retry the original request with new token
              const retryConfig = {
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${refreshData.data.accessToken}`,
                },
              }
              const retryResponse = await fetch(url, retryConfig)
              
              if (!retryResponse.ok) {
                const errorData = await retryResponse.json().catch(() => ({}))
                throw new ApiError(errorData.message || `HTTP ${retryResponse.status}`, retryResponse.status, errorData)
              }
              
              return await retryResponse.json()
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens
            this.clearToken()
            throw new ApiError("Session expired", 401, refreshError)
          }
        } else {
          // No refresh token, clear session
          this.clearToken()
          throw new ApiError("Session expired", 401, {})
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status, errorData)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError("Network error occurred", 0, error)
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Request types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface CreateRealmRequest {
  name: string
  description: string
  theme: string
  difficulty: "easy" | "medium" | "hard"
}

export interface CreateTaskRequest {
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  dueDate?: string
  realmId: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  difficulty?: "easy" | "medium" | "hard"
  dueDate?: string
  completed?: boolean
}
