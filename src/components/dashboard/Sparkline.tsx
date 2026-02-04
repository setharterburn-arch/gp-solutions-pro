'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { LucideIcon } from 'lucide-react'

interface SparklineData {
  value: number
  label?: string
}

interface SparklineProps {
  data: SparklineData[]
  color?: string
  height?: number
  width?: number
  showArea?: boolean
  strokeWidth?: number
  className?: string
}

export function Sparkline({
  data,
  color = '#14b8a6',
  height = 40,
  width = 120,
  showArea = true,
  strokeWidth = 2,
  className,
}: SparklineProps) {
  const gradientId = `sparkline-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={cn('inline-block', className)} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        {showArea ? (
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={strokeWidth}
              fill={`url(#${gradientId})`}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={strokeWidth}
              dot={false}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

interface StatCardWithSparklineProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  color: 'teal' | 'violet' | 'emerald' | 'amber' | 'rose' | 'blue'
  sparklineData: number[]
  href?: string
  delay?: number
  loading?: boolean
}

const colorStyles = {
  teal: {
    bg: 'bg-teal-50',
    icon: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600',
    stroke: '#14b8a6',
    trendUp: 'text-teal-700 bg-teal-50',
    trendDown: 'text-rose-700 bg-rose-50',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600',
    stroke: '#8b5cf6',
    trendUp: 'text-violet-700 bg-violet-50',
    trendDown: 'text-rose-700 bg-rose-50',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
    stroke: '#22c55e',
    trendUp: 'text-emerald-700 bg-emerald-50',
    trendDown: 'text-rose-700 bg-rose-50',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600',
    stroke: '#f59e0b',
    trendUp: 'text-amber-700 bg-amber-50',
    trendDown: 'text-rose-700 bg-rose-50',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'text-rose-600',
    gradient: 'from-rose-500 to-rose-600',
    stroke: '#f43f5e',
    trendUp: 'text-emerald-700 bg-emerald-50',
    trendDown: 'text-rose-700 bg-rose-50',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    stroke: '#3b82f6',
    trendUp: 'text-blue-700 bg-blue-50',
    trendDown: 'text-rose-700 bg-rose-50',
  },
}

export function StatCardWithSparkline({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  sparklineData,
  href,
  delay = 0,
  loading = false,
}: StatCardWithSparklineProps) {
  const styles = colorStyles[color]
  const trend = change && change > 0 ? 'up' : change && change < 0 ? 'down' : 'neutral'

  const data: SparklineData[] = sparklineData.map((v, i) => ({
    value: v,
    label: `Day ${i + 1}`,
  }))

  const CardWrapper = href ? motion.a : motion.div
  const wrapperProps = href ? { href, className: 'block' } : {}

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-neutral-200/50 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-neutral-200" />
          <div className="w-20 h-8 bg-neutral-200 rounded" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-6 bg-neutral-200 rounded w-24" />
          <div className="h-4 bg-neutral-200 rounded w-32" />
        </div>
      </div>
    )
  }

  return (
    <CardWrapper
      {...wrapperProps}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl p-5 border border-neutral-200/50 hover:border-neutral-300 transition-all hover:shadow-xl overflow-hidden"
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
          
          {/* Sparkline Chart */}
          <Sparkline
            data={data}
            color={styles.stroke}
            height={40}
            width={100}
            showArea={true}
          />
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-neutral-500">{title}</p>
            {change !== undefined && (
              <span
                className={cn(
                  'flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full',
                  trend === 'up' && styles.trendUp,
                  trend === 'down' && styles.trendDown,
                  trend === 'neutral' && 'text-neutral-600 bg-neutral-100'
                )}
              >
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {change > 0 ? '+' : ''}
                {change}%
              </span>
            )}
          </div>
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

export default Sparkline
