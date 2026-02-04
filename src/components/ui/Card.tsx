'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  status?: 'default' | 'success' | 'warning' | 'error' | 'info'
  gradientBorder?: boolean
  onClick?: () => void
  action?: React.ReactNode
}

const statusStyles = {
  default: '',
  success: 'border-l-4 border-l-emerald-500',
  warning: 'border-l-4 border-l-amber-500',
  error: 'border-l-4 border-l-red-500',
  info: 'border-l-4 border-l-blue-500',
}

const statusGlow = {
  default: '',
  success: 'shadow-emerald-500/20',
  warning: 'shadow-amber-500/20',
  error: 'shadow-red-500/20',
  info: 'shadow-blue-500/20',
}

export function Card({
  children,
  className,
  hover = true,
  status = 'default',
  gradientBorder = false,
  onClick,
  action,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      onClick={onClick}
      className={cn(
        'relative bg-white rounded-2xl border border-neutral-200/50 overflow-hidden',
        'transition-all duration-200',
        hover && 'cursor-pointer',
        hover && 'hover:shadow-xl hover:border-neutral-300',
        hover && status !== 'default' && statusGlow[status],
        statusStyles[status],
        className
      )}
    >
      {/* Gradient border overlay */}
      {gradientBorder && (
        <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500 via-violet-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Action menu (top-right) */}
      {action && (
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          {action}
        </div>
      )}

      {/* Bottom gradient accent on hover */}
      {hover && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className={cn(
            'absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl',
            status === 'default' && 'bg-gradient-to-r from-teal-500 to-teal-600',
            status === 'success' && 'bg-gradient-to-r from-emerald-500 to-emerald-600',
            status === 'warning' && 'bg-gradient-to-r from-amber-500 to-amber-600',
            status === 'error' && 'bg-gradient-to-r from-red-500 to-red-600',
            status === 'info' && 'bg-gradient-to-r from-blue-500 to-blue-600'
          )}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Card Header Component
interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  action?: React.ReactNode
  className?: string
}

export function CardHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-teal-600',
  action,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between p-6 pb-0', className)}>
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={cn('p-2.5 rounded-xl bg-neutral-100', iconColor)}>
            <Icon size={22} />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg text-neutral-900">{title}</h3>
          {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

// Card Content Component
interface CardContentProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function CardContent({
  children,
  className,
  padding = 'md',
}: CardContentProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return <div className={cn(paddingStyles[padding], className)}>{children}</div>
}

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode
  className?: string
  divider?: boolean
}

export function CardFooter({
  children,
  className,
  divider = true,
}: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-6 pt-0',
        divider && 'border-t border-neutral-100 mt-6 pt-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// Stat Card Component (specialized for dashboard)
interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  color: 'teal' | 'violet' | 'emerald' | 'amber' | 'rose' | 'blue'
  href?: string
  delay?: number
}

const colorStyles = {
  teal: {
    bg: 'bg-teal-50',
    icon: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600',
    glow: 'shadow-teal-500/20',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/20',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600',
    glow: 'shadow-amber-500/20',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'text-rose-600',
    gradient: 'from-rose-500 to-rose-600',
    glow: 'shadow-rose-500/20',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/20',
  },
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = 'neutral',
  color,
  href,
  delay = 0,
}: StatCardProps) {
  const styles = colorStyles[color]

  const CardWrapper = href ? motion.a : motion.div
  const wrapperProps = href
    ? { href, className: 'block' }
    : {}

  return (
    <CardWrapper
      {...wrapperProps}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl p-5 border border-neutral-200/50 hover:border-neutral-300 transition-all hover:shadow-xl"
    >
      {/* Corner gradient decoration */}
      <div
        className={cn(
          'absolute top-0 right-0 w-32 h-32 opacity-10 rounded-tr-2xl',
          'bg-gradient-to-br',
          styles.gradient
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className={cn('p-2.5 rounded-xl', styles.bg)}>
            <Icon className={styles.icon} size={20} />
          </div>
          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full',
                trend === 'up' && 'text-emerald-700 bg-emerald-50',
                trend === 'down' && 'text-rose-700 bg-rose-50',
                trend === 'neutral' && 'text-neutral-600 bg-neutral-100'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {change > 0 ? '+' : ''}
              {change}%
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-500 mt-0.5">{title}</p>
          {changeLabel && (
            <p className="text-xs text-neutral-400 mt-1">{changeLabel}</p>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity',
          styles.gradient
        )}
      />
    </CardWrapper>
  )
}

export default Card
