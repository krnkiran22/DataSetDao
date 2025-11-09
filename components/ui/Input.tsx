'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  helpText?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, id, required, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helpId = helpText ? `${inputId}-help` : undefined;

    const baseClasses = 'w-full bg-[rgba(28,28,30,0.5)] backdrop-blur-xl border border-white/10 focus:border-[var(--color-accent-green)] focus:ring-2 focus:ring-[var(--color-accent-green)]/20 rounded-xl px-4 py-3 text-white placeholder:text-[var(--color-fg-secondary)] transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    const errorClasses = error ? 'border-[var(--color-accent-red)] focus:border-[var(--color-accent-red)] focus:ring-[var(--color-accent-red)]/20' : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-fg-primary)] mb-2"
          >
            {label}
            {required && <span className="text-[var(--color-accent-red)] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(baseClasses, errorClasses, className)}
          aria-invalid={!!error}
          aria-describedby={cn(errorId, helpId)}
          required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-2 text-sm text-[var(--color-accent-red)]" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={helpId} className="mt-2 text-sm text-[var(--color-fg-tertiary)]">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
