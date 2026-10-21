import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className = '',
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-rose-500 ml-1">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-stone-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`w-full rounded-xl border bg-white text-stone-900 text-sm transition-all duration-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 disabled:bg-stone-100 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} py-2.5 min-h-[44px] ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-stone-300 focus:border-[#1B4332] focus:ring-[#1B4332]/20'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-stone-400">{rightIcon}</div>
          )}
        </div>

        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-rose-600 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-stone-500">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
