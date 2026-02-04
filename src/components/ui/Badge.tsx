'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-stone-100 text-stone-700',
  success: 'bg-gradient-to-r from-emerald-50 to-green-100 text-green-700 border border-green-200/50',
  warning: 'bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-700 border border-amber-200/50',
  error: 'bg-gradient-to-r from-red-50 to-rose-100 text-red-700 border border-red-200/50',
  info: 'bg-gradient-to-r from-blue-50 to-sky-100 text-blue-700 border border-blue-200/50',
  outline: 'bg-transparent border border-stone-300 text-stone-600',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-stone-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  outline: 'bg-stone-400',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, pulse = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-2 w-2">
            {pulse && (
              <span
                className={cn(
                  'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                  dotColors[variant]
                )}
              />
            )}
            <span className={cn('relative inline-flex rounded-full h-2 w-2', dotColors[variant])} />
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status-specific badges for common use cases
export const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { variant: BadgeVariant; label: string; dot?: boolean; pulse?: boolean }> = {
    // Job statuses
    lead: { variant: 'info', label: 'Lead', dot: true },
    quoted: { variant: 'warning', label: 'Quoted', dot: true },
    scheduled: { variant: 'info', label: 'Scheduled', dot: true },
    'in-progress': { variant: 'warning', label: 'In Progress', dot: true, pulse: true },
    completed: { variant: 'success', label: 'Completed', dot: true },
    cancelled: { variant: 'error', label: 'Cancelled', dot: true },
    
    // Invoice statuses
    draft: { variant: 'default', label: 'Draft' },
    sent: { variant: 'info', label: 'Sent', dot: true },
    viewed: { variant: 'info', label: 'Viewed', dot: true },
    paid: { variant: 'success', label: 'Paid', dot: true },
    overdue: { variant: 'error', label: 'Overdue', dot: true, pulse: true },
    
    // General
    active: { variant: 'success', label: 'Active', dot: true, pulse: true },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending', dot: true },
    approved: { variant: 'success', label: 'Approved', dot: true },
    rejected: { variant: 'error', label: 'Rejected', dot: true },
  };

  const config = statusMap[status.toLowerCase()] || { variant: 'default' as BadgeVariant, label: status };

  return (
    <Badge variant={config.variant} dot={config.dot} pulse={config.pulse}>
      {config.label}
    </Badge>
  );
};
