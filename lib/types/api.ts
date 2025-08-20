// Enhanced API types for better backend integration
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface FilterState {
  search?: string
  difficulty?: "easy" | "medium" | "hard"
  completed?: boolean
  dateRange?: {
    start: string
    end: string
  }
}

export interface SortState {
  field: string
  direction: "asc" | "desc"
}

// Optimistic update types
export interface OptimisticUpdate<T> {
  id: string
  type: "create" | "update" | "delete"
  data: T
  timestamp: number
}

// WebSocket event types
export interface WebSocketEvent {
  type: "task_completed" | "level_up" | "badge_earned" | "realm_updated"
  data: any
  userId: string
  timestamp: string
}

// Form validation types
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface FormField {
  name: string
  value: any
  error: string | null
  touched: boolean
  rules: ValidationRule[]
}

export interface FormState {
  fields: Record<string, FormField>
  isValid: boolean
  isSubmitting: boolean
  submitError: string | null
}
