'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 px-3 text-sm rounded-[10px] border bg-white',
              'transition-all duration-200',
              'placeholder:text-stone-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              hasError && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
              hasSuccess && 'border-green-300 focus:border-green-500 focus:ring-green-500/20',
              !hasError && !hasSuccess && 'border-stone-200 focus:border-teal-500 focus:ring-teal-500/20',
              props.disabled && 'bg-stone-50 cursor-not-allowed opacity-60',
              className
            )}
            {...props}
          />
          {(rightIcon || hasError || hasSuccess) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : hasSuccess ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <span className="text-stone-400">{rightIcon}</span>
              )}
            </div>
          )}
        </div>
        {(error || success || hint) && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              hasError && 'text-red-600',
              hasSuccess && 'text-green-600',
              !hasError && !hasSuccess && 'text-stone-500'
            )}
          >
            {error || success || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-[10px] border bg-white',
            'transition-all duration-200 resize-none',
            'placeholder:text-stone-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            hasError && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
            !hasError && 'border-stone-200 focus:border-teal-500 focus:ring-teal-500/20',
            props.disabled && 'bg-stone-50 cursor-not-allowed opacity-60',
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <p className={cn('mt-1.5 text-xs', hasError ? 'text-red-600' : 'text-stone-500')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
