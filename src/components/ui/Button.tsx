'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-br from-teal-600 to-teal-700 text-white
    shadow-[0_2px_4px_rgba(13,148,136,0.2)]
    hover:shadow-[0_4px_12px_rgba(13,148,136,0.3)]
  `,
  secondary: `
    bg-gradient-to-br from-orange-500 to-orange-600 text-white
    shadow-[0_2px_4px_rgba(249,115,22,0.2)]
    hover:shadow-[0_4px_12px_rgba(249,115,22,0.3)]
  `,
  ghost: `
    bg-transparent text-stone-700 
    hover:bg-stone-100
    border border-transparent hover:border-stone-200
  `,
  destructive: `
    bg-gradient-to-br from-red-500 to-red-600 text-white
    shadow-[0_2px_4px_rgba(239,68,68,0.2)]
    hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]
  `,
  icon: `
    bg-stone-100 text-stone-600
    hover:bg-stone-200 hover:text-stone-800
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-5 text-sm rounded-[10px]',
  lg: 'h-12 px-6 text-base rounded-xl',
  icon: 'h-10 w-10 rounded-[10px] p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isDisabled}
        whileHover={isDisabled ? {} : { y: -1 }}
        whileTap={isDisabled ? {} : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// Icon button helper
export const IconButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant' | 'size'>>(
  (props, ref) => <Button ref={ref} variant="icon" size="icon" {...props} />
);

IconButton.displayName = 'IconButton';
