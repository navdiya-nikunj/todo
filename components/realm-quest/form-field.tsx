import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  error?: string | null
  touched?: boolean
  required?: boolean
  className?: string
  children?: React.ReactNode
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, touched, required, className, children, ...props }, ref) => {
    const showError = touched && error

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label className="text-realm-silver font-medium">
          {label}
          {required && <span className="text-realm-crimson ml-1">*</span>}
        </Label>
        {children}
        {showError && (
          <div className="flex items-center gap-2 text-realm-crimson text-sm">
            <div className="w-1 h-1 bg-realm-crimson rounded-full animate-pulse" />
            {error}
          </div>
        )}
      </div>
    )
  },
)

FormField.displayName = "FormField"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
  touched?: boolean
  isRequired?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, touched, isRequired, className, ...props }, ref) => {
    const showError = touched && error

    return (
      <FormField label={label} error={error} touched={touched} required={isRequired}>
        <Input
          ref={ref}
          className={cn(
            "bg-realm-gunmetal/50 border-realm-silver/20 text-realm-silver",
            "focus:border-realm-neon focus:ring-realm-neon/20",
            "placeholder:text-realm-silver/50",
            showError && "border-realm-crimson focus:border-realm-crimson focus:ring-realm-crimson/20",
            className,
          )}
          {...props}
        />
      </FormField>
    )
  },
)

FormInput.displayName = "FormInput"

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string | null
  touched?: boolean
  isRequired?: boolean
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, touched, isRequired, className, ...props }, ref) => {
    const showError = touched && error

    return (
      <FormField label={label} error={error} touched={touched} required={isRequired}>
        <Textarea
          ref={ref}
          className={cn(
            "bg-realm-gunmetal/50 border-realm-silver/20 text-realm-silver",
            "focus:border-realm-neon focus:ring-realm-neon/20",
            "placeholder:text-realm-silver/50 resize-none",
            showError && "border-realm-crimson focus:border-realm-crimson focus:ring-realm-crimson/20",
            className,
          )}
          {...props}
        />
      </FormField>
    )
  },
)

FormTextarea.displayName = "FormTextarea"

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string | null
  touched?: boolean
  isRequired?: boolean
  options: { value: string; label: string }[]
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, touched, isRequired, options, className, ...props }, ref) => {
    const showError = touched && error

    return (
      <FormField label={label} error={error} touched={touched} required={isRequired}>
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border bg-realm-gunmetal/50 border-realm-silver/20",
            "px-3 py-2 text-sm text-realm-silver",
            "focus:border-realm-neon focus:ring-2 focus:ring-realm-neon/20 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showError && "border-realm-crimson focus:border-realm-crimson focus:ring-realm-crimson/20",
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            Select an option...
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-realm-gunmetal text-realm-silver">
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    )
  },
)

FormSelect.displayName = "FormSelect"
