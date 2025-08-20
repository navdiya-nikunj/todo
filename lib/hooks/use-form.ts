"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { validateForm, isFormValid, type ValidationRule } from "@/lib/validation/rules"
import { useDebouncedCallback } from "./use-debounce"

interface FormField {
  value: any
  error: string | null
  touched: boolean
}

interface FormState<T> {
  fields: Record<keyof T, FormField>
  isValid: boolean
  isSubmitting: boolean
  submitError: string | null
  isDirty: boolean
}

interface UseFormOptions<T> {
  initialValues: T
  validationSchema: Record<keyof T, ValidationRule>
  onSubmit: (values: T) => Promise<void> | void
  validateOnChange?: boolean
  validateOnBlur?: boolean
  debounceMs?: number
}

interface UseFormReturn<T> {
  values: T
  errors: Record<keyof T, string | null>
  touched: Record<keyof T, boolean>
  isValid: boolean
  isSubmitting: boolean
  submitError: string | null
  isDirty: boolean
  setValue: (field: keyof T, value: any) => void
  setError: (field: keyof T, error: string | null) => void
  setTouched: (field: keyof T, touched: boolean) => void
  handleChange: (
    field: keyof T,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (field: keyof T) => () => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  reset: () => void
  clearErrors: () => void
  validateField: (field: keyof T) => void
  validateForm: () => boolean
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  debounceMs = 300,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [state, setState] = useState<FormState<T>>(() => {
    const fields = {} as Record<keyof T, FormField>
    for (const key in initialValues) {
      fields[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      }
    }
    return {
      fields,
      isValid: false,
      isSubmitting: false,
      submitError: null,
      isDirty: false,
    }
  })

  // Debounced validation
  const debouncedValidate = useDebouncedCallback((field: keyof T, value: any) => {
    if (validateOnChange) {
      validateSingleField(field, value)
    }
  }, debounceMs)

  const validateSingleField = useCallback(
    (field: keyof T, value?: any) => {
      const fieldValue = value !== undefined ? value : state.fields[field].value
      const rules = validationSchema[field]

      if (!rules) return

      const result = validateForm({ [field]: fieldValue } as T, { [field]: rules } as Record<keyof T, ValidationRule>)
      const fieldResult = result[field]

      setState((prev) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [field]: {
            ...prev.fields[field],
            error: fieldResult.errors[0] || null,
          },
        },
      }))
    },
    [state.fields, validationSchema],
  )

  const validateAllFields = useCallback(() => {
    const values = {} as T
    for (const key in state.fields) {
      values[key] = state.fields[key].value
    }

    const results = validateForm(values, validationSchema)
    const formIsValid = isFormValid(results)

    setState((prev) => {
      const newFields = { ...prev.fields }
      for (const key in results) {
        newFields[key] = {
          ...newFields[key],
          error: results[key].errors[0] || null,
        }
      }

      return {
        ...prev,
        fields: newFields,
        isValid: formIsValid,
      }
    })

    return formIsValid
  }, [state.fields, validationSchema])

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setState((prev) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [field]: {
            ...prev.fields[field],
            value,
          },
        },
        isDirty: true,
      }))

      if (validateOnChange) {
        debouncedValidate(field, value)
      }
    },
    [validateOnChange, debouncedValidate],
  )

  const setError = useCallback((field: keyof T, error: string | null) => {
    setState((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          error,
        },
      },
    }))
  }, [])

  const setTouched = useCallback((field: keyof T, touched: boolean) => {
    setState((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          touched,
        },
      },
    }))
  }, [])

  const handleChange = useCallback(
    (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
      setValue(field, value)
    },
    [setValue],
  )

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched(field, true)
      if (validateOnBlur) {
        validateSingleField(field)
      }
    },
    [setTouched, validateOnBlur, validateSingleField],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Mark all fields as touched
      setState((prev) => {
        const newFields = { ...prev.fields }
        for (const key in newFields) {
          newFields[key] = { ...newFields[key], touched: true }
        }
        return { ...prev, fields: newFields }
      })

      // Validate form
      const isValid = validateAllFields()
      if (!isValid) return

      // Submit form
      setState((prev) => ({ ...prev, isSubmitting: true, submitError: null }))

      try {
        const values = {} as T
        for (const key in state.fields) {
          values[key] = state.fields[key].value
        }

        await onSubmit(values)
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          submitError: error.message || "An error occurred during submission",
        }))
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }))
      }
    },
    [validateAllFields, onSubmit, state.fields],
  )

  const reset = useCallback(() => {
    const fields = {} as Record<keyof T, FormField>
    for (const key in initialValues) {
      fields[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      }
    }
    setState({
      fields,
      isValid: false,
      isSubmitting: false,
      submitError: null,
      isDirty: false,
    })
  }, [initialValues])

  const clearErrors = useCallback(() => {
    setState((prev) => {
      const newFields = { ...prev.fields }
      for (const key in newFields) {
        newFields[key] = { ...newFields[key], error: null }
      }
      return { ...prev, fields: newFields, submitError: null }
    })
  }, [])

  // Update form validity when fields change
  useEffect(() => {
    const values = {} as T
    for (const key in state.fields) {
      values[key] = state.fields[key].value
    }

    const results = validateForm(values, validationSchema)
    const formIsValid = isFormValid(results)

    setState((prev) => ({ ...prev, isValid: formIsValid }))
  }, [state.fields, validationSchema])

  // Extract values, errors, and touched for easier access
  const values = {} as T
  const errors = {} as Record<keyof T, string | null>
  const touched = {} as Record<keyof T, boolean>

  for (const key in state.fields) {
    values[key] = state.fields[key].value
    errors[key] = state.fields[key].error
    touched[key] = state.fields[key].touched
  }

  return {
    values,
    errors,
    touched,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    submitError: state.submitError,
    isDirty: state.isDirty,
    setValue,
    setError,
    setTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    clearErrors,
    validateField: validateSingleField,
    validateForm: validateAllFields,
  }
}
