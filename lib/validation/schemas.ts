import type { ValidationRule } from "./rules"

// Login form schema
export const loginSchema = {
  email: {
    required: true,
    email: true,
    message: "Please enter a valid email address",
  } as ValidationRule,
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters",
  } as ValidationRule,
}

// Registration form schema
export const registerSchema = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: "Username must be 3-20 characters and contain only letters, numbers, and underscores",
  } as ValidationRule,
  email: {
    required: true,
    email: true,
    message: "Please enter a valid email address",
  } as ValidationRule,
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: "Password must be at least 8 characters with uppercase, lowercase, and number",
  } as ValidationRule,
  confirmPassword: {
    required: true,
    custom: (value: string, formData?: any) => {
      if (formData && value !== formData.password) {
        return "Passwords do not match"
      }
      return null
    },
  } as ValidationRule,
}

// Realm creation schema
export const createRealmSchema = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 50,
    message: "Realm name must be 3-50 characters",
  } as ValidationRule,
  description: {
    required: true,
    minLength: 10,
    maxLength: 200,
    message: "Description must be 10-200 characters",
  } as ValidationRule,
  theme: {
    required: true,
    message: "Please select a realm theme",
  } as ValidationRule,
  difficulty: {
    required: true,
    message: "Please select a difficulty level",
  } as ValidationRule,
}

// Task creation schema
export const createTaskSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: "Task title must be 3-100 characters",
  } as ValidationRule,
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: "Description must be 10-500 characters",
  } as ValidationRule,
  difficulty: {
    required: true,
    message: "Please select a difficulty level",
  } as ValidationRule,
  dueDate: {
    custom: (value: string) => {
      if (value && new Date(value) < new Date()) {
        return "Due date cannot be in the past"
      }
      return null
    },
  } as ValidationRule,
}

// Profile update schema
export const updateProfileSchema = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: "Username must be 3-20 characters and contain only letters, numbers, and underscores",
  } as ValidationRule,
  email: {
    email: true,
    message: "Please enter a valid email address",
  } as ValidationRule,
}
