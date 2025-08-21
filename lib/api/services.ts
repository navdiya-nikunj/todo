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
import Cookies from "js-cookie"
// Authentication Services
export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>("/auth/login", credentials)
    if (response.data.accessToken) {
      apiClient.setToken(response.data.accessToken)
      Cookies.set("token", response.data.accessToken)
      Cookies.set("refresh_token", response.data.refreshToken)
    }
    return response
  },

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>("/auth/register", userData)
    if (response.data.accessToken) {
      apiClient.setToken(response.data.accessToken)
      Cookies.set("token", response.data.accessToken)
      Cookies.set("refresh_token", response.data.refreshToken)
    }
    return response
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout")
    apiClient.clearToken()
    Cookies.remove("token")
    Cookies.remove("refresh_token")
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>("/auth/me")
  },

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const refreshToken = Cookies.get("refresh_token")
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>("/auth/refresh", { refreshToken })
    if (response.data.accessToken) {
      apiClient.setToken(response.data.accessToken)
      Cookies.set("token", response.data.accessToken)
      Cookies.set("refresh_token", response.data.refreshToken)
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
  async getRealms(page = 1, limit = 10): Promise<ApiResponse<Realm[]>> {
    return apiClient.get<ApiResponse<Realm[]>>(`/realms?page=${page}&limit=${limit}`)
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
      status?: string
      difficulty?: string
      page?: number
      limit?: number
    },
  ): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.difficulty) params.append("difficulty", filters.difficulty)
    if (filters?.page) params.append("page", filters.page.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())

    const queryString = params.toString()
    return apiClient.get<ApiResponse<Task[]>>(`/realms/${realmId}/tasks${queryString ? `?${queryString}` : ""}`)
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

// Daily Quest Services
export const dailyQuestService = {
  async getDailyQuests(includeExpired = false): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/daily-quests?includeExpired=${includeExpired}`)
  },

  async createCustomQuest(questData: {
    title: string
    description: string
    target: number
    xpReward: number
  }): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>("/daily-quests", questData)
  },

  async updateQuestProgress(questId: string, increment = 1): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>(`/daily-quests/${questId}/progress`, { increment })
  },

  async claimQuestReward(questId: string): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(`/daily-quests/${questId}/claim`)
  },

  async updateCustomQuest(questId: string, questData: {
    title: string
    description: string
    target: number
    xpReward: number
  }): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>(`/daily-quests/${questId}`, questData)
  },

  async deleteCustomQuest(questId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/daily-quests/${questId}`)
  },
}

// Avatar Services  
export const avatarService = {
  async getAvailableAvatars(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>("/users/avatar")
  },

  async updateAvatar(avatarId: string): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>("/users/avatar", { avatarId })
  },
}

// Analytics Services
export const analyticsService = {
  async getUserStats(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>("/users/stats")
  },

  async getXPHistory(days = 30): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`/users/xp-history?days=${days}`)
  },
}
