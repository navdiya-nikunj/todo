import {
  apiClient,
  type ApiResponse,
  type PaginatedResponse,
  type LoginRequest,
  type RegisterRequest,
  type CreateRealmRequest,
  type CreateTaskRequest,
  type UpdateTaskRequest,
} from "./client"
import type { User, Realm, Task, Badge } from "@/lib/types/realm-quest"

// Authentication Services
export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>("/auth/login", credentials)
    if (response.data.token) {
      apiClient.setToken(response.data.token)
    }
    return response
  },

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>("/auth/register", userData)
    if (response.data.token) {
      apiClient.setToken(response.data.token)
    }
    return response
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout")
    apiClient.clearToken()
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>("/auth/me")
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>("/auth/refresh")
    if (response.data.token) {
      apiClient.setToken(response.data.token)
    }
    return response
  },
}

// User Services
export const userService = {
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>("/users/profile", userData)
  },

  async updateAvatar(avatarId: string): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>("/users/avatar", { avatarId })
  },

  async getUserStats(): Promise<
    ApiResponse<{
      totalXP: number
      level: number
      completedTasks: number
      activeRealms: number
      badges: Badge[]
      streak: number
    }>
  > {
    return apiClient.get<ApiResponse<any>>("/users/stats")
  },
}

// Realm Services
export const realmService = {
  async getRealms(page = 1, limit = 10): Promise<PaginatedResponse<Realm>> {
    return apiClient.get<PaginatedResponse<Realm>>(`/realms?page=${page}&limit=${limit}`)
  },

  async getRealmById(id: string): Promise<ApiResponse<Realm>> {
    return apiClient.get<ApiResponse<Realm>>(`/realms/${id}`)
  },

  async createRealm(realmData: CreateRealmRequest): Promise<ApiResponse<Realm>> {
    return apiClient.post<ApiResponse<Realm>>("/realms", realmData)
  },

  async updateRealm(id: string, realmData: Partial<CreateRealmRequest>): Promise<ApiResponse<Realm>> {
    return apiClient.patch<ApiResponse<Realm>>(`/realms/${id}`, realmData)
  },

  async deleteRealm(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/realms/${id}`)
  },

  async getRealmStats(id: string): Promise<
    ApiResponse<{
      totalTasks: number
      completedTasks: number
      totalXP: number
      completionRate: number
    }>
  > {
    return apiClient.get<ApiResponse<any>>(`/realms/${id}/stats`)
  },
}

// Task Services
export const taskService = {
  async getTasks(
    realmId: string,
    filters?: {
      completed?: boolean
      difficulty?: string
      page?: number
      limit?: number
    },
  ): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams()
    if (filters?.completed !== undefined) params.append("completed", filters.completed.toString())
    if (filters?.difficulty) params.append("difficulty", filters.difficulty)
    if (filters?.page) params.append("page", filters.page.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())

    const queryString = params.toString()
    return apiClient.get<PaginatedResponse<Task>>(`/realms/${realmId}/tasks${queryString ? `?${queryString}` : ""}`)
  },

  async getTaskById(realmId: string, taskId: string): Promise<ApiResponse<Task>> {
    return apiClient.get<ApiResponse<Task>>(`/realms/${realmId}/tasks/${taskId}`)
  },

  async createTask(realmId: string, taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return apiClient.post<ApiResponse<Task>>(`/realms/${realmId}/tasks`, taskData)
  },

  async updateTask(realmId: string, taskId: string, taskData: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return apiClient.patch<ApiResponse<Task>>(`/realms/${realmId}/tasks/${taskId}`, taskData)
  },

  async deleteTask(realmId: string, taskId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/realms/${realmId}/tasks/${taskId}`)
  },

  async completeTask(
    realmId: string,
    taskId: string,
  ): Promise<
    ApiResponse<{
      task: Task
      xpGained: number
      levelUp?: boolean
      newBadges?: Badge[]
    }>
  > {
    return apiClient.post<ApiResponse<any>>(`/realms/${realmId}/tasks/${taskId}/complete`)
  },

  async uncompleteTask(realmId: string, taskId: string): Promise<ApiResponse<Task>> {
    return apiClient.post<ApiResponse<Task>>(`/realms/${realmId}/tasks/${taskId}/uncomplete`)
  },
}

// Badge Services
export const badgeService = {
  async getUserBadges(): Promise<ApiResponse<Badge[]>> {
    return apiClient.get<ApiResponse<Badge[]>>("/badges")
  },

  async checkBadgeProgress(): Promise<
    ApiResponse<{
      availableBadges: Badge[]
      progress: Record<string, number>
    }>
  > {
    return apiClient.get<ApiResponse<any>>("/badges/progress")
  },
}

// Analytics Services
export const analyticsService = {
  async getDashboardStats(): Promise<
    ApiResponse<{
      totalXP: number
      level: number
      completedTasks: number
      activeRealms: number
      weeklyProgress: number[]
      recentActivity: any[]
    }>
  > {
    return apiClient.get<ApiResponse<any>>("/analytics/dashboard")
  },

  async getXPHistory(days = 30): Promise<
    ApiResponse<
      {
        date: string
        xp: number
      }[]
    >
  > {
    return apiClient.get<ApiResponse<any>>(`/analytics/xp-history?days=${days}`)
  },
}
