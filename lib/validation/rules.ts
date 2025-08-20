// Validation rule types and utilities
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  email?: boolean
  custom?: (value: any) => string | null
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Core validation functions
export const validators = {
  required: (value: any, message = "This field is required"): string | null => {
    if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
      return message
    }
    return null
  },

  minLength: (value: string, min: number, message?: string): string | null => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`
    }
    return null
  },

  maxLength: (value: string, max: number, message?: string): string | null => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`
    }
    return null
  },

  min: (value: number, min: number, message?: string): string | null => {
    if (value !== null && value !== undefined && value < min) {
      return message || `Must be at least ${min}`
    }
    return null
  },

  max: (value: number, max: number, message?: string): string | null => {
    if (value !== null && value !== undefined && value > max) {
      return message || `Must be no more than ${max}`
    }
    return null
  },

  pattern: (value: string, pattern: RegExp, message = "Invalid format"): string | null => {
    if (value && !pattern.test(value)) {
      return message
    }
    return null
  },

  email: (value: string, message = "Invalid email address"): string | null => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return validators.pattern(value, emailPattern, message)
  },
}

// Validate a single field
export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = []

  if (rules.required) {
    const error = validators.required(value, rules.message)
    if (error) errors.push(error)
  }

  // Skip other validations if field is empty and not required
  if (!rules.required && (value === null || value === undefined || value === "")) {
    return { isValid: true, errors: [] }
  }

  if (rules.minLength && typeof value === "string") {
    const error = validators.minLength(value, rules.minLength, rules.message)
    if (error) errors.push(error)
  }

  if (rules.maxLength && typeof value === "string") {
    const error = validators.maxLength(value, rules.maxLength, rules.message)
    if (error) errors.push(error)
  }

  if (rules.min && typeof value === "number") {
    const error = validators.min(value, rules.min, rules.message)
    if (error) errors.push(error)
  }

  if (rules.max && typeof value === "number") {
    const error = validators.max(value, rules.max, rules.message)
    if (error) errors.push(error)
  }

  if (rules.pattern && typeof value === "string") {
    const error = validators.pattern(value, rules.pattern, rules.message)
    if (error) errors.push(error)
  }

  if (rules.email && typeof value === "string") {
    const error = validators.email(value, rules.message)
    if (error) errors.push(error)
  }

  if (rules.custom) {
    const error = rules.custom(value)
    if (error) errors.push(error)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validate multiple fields
export function validateForm<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, ValidationRule>,
): Record<keyof T, ValidationResult> {
  const results = {} as Record<keyof T, ValidationResult>

  for (const field in schema) {
    results[field] = validateField(data[field], schema[field])
  }

  return results
}

// Check if form is valid
export function isFormValid<T extends Record<string, any>>(results: Record<keyof T, ValidationResult>): boolean {
  return Object.values(results).every((result) => result.isValid)
}
