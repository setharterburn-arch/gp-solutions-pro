'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Activity,
  FileText,
  DollarSign,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  ArrowRight,
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'job_completed' | 'invoice_paid' | 'job_scheduled' | 'customer_added' | 'estimate_approved'
  title: string
  description: string
  timestamp: string
  amount?: string
  user?: {
    name: string
    avatar?: string
  }
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
  maxItems?: number
  showViewAll?: boolean
  onViewAll?: () => void
  loading?: boolean
}

const activityConfig = {
  job_completed: {
    icon: CheckCircle,
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    label: 'Job Completed',
  },
  invoice_paid: {
    icon: DollarSign,
    color: 'blue',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    label: 'Invoice Paid',
  },
  job_scheduled: {
    icon: Clock,
    color: 'amber',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    label: 'Job Scheduled',
  },
  customer_added: {
    icon: User,
    color: 'violet',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderColor: 'border-violet-200',
    label: 'New Customer',
  },
  estimate_approved: {
    icon: FileText,
    color: 'teal',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    label: 'Estimate Approved',
  },
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ActivityFeed({
  activities,
  className,
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  loading = false,
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems)

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl bg-neutral-50 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <Activity className="text-neutral-400" size={24} />
        </div>
        <h4 className="text-sm font-medium text-neutral-900">No recent activity</h4>
        <p className="text-xs text-neutral-500 mt-1">
          Activity will appear here as jobs and invoices are processed
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      {displayActivities.map((activity, index) => {
        const config = activityConfig[activity.type]
        const Icon = config.icon

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              'group flex items-start gap-4 p-4 rounded-xl',
              'hover:bg-neutral-50 transition-colors cursor-pointer',
              'border border-transparent hover:border-neutral-200'
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                config.bgColor,
                config.iconColor
              )}
            >
              <Icon size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-neutral-900 group-hover:text-teal-700 transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                    {activity.description}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-neutral-400">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>

              {/* Footer with amount/user */}
              <div className="flex items-center gap-3 mt-2">
                {activity.amount && (
                  <span className="text-sm font-semibold text-emerald-600">
                    {activity.amount}
                  </span>
                )}
                {activity.user && (
                  <div className="flex items-center gap-1.5">
                    {activity.user.avatar ? (
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-neutral-400 to-neutral-500 flex items-center justify-center">
                        <span className="text-[10px] font-medium text-white">
                          {activity.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-neutral-500">{activity.user.name}</span>
                  </div>
                )}
                <span
                  className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full border',
                    config.bgColor,
                    config.iconColor,
                    config.borderColor
                  )}
                >
                  {config.label}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}

      {showViewAll && activities.length > maxItems && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onViewAll}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 mt-2',
            'text-sm font-medium text-neutral-600 hover:text-teal-600',
            'transition-colors rounded-lg hover:bg-neutral-50'
          )}
        >
          View all activity
          <ArrowRight size={16} />
        </motion.button>
      )}
    </div>
  )
}

export function ActivityFeedCompact({
  activities,
  className,
  maxItems = 3,
}: Omit<ActivityFeedProps, 'showViewAll' | 'onViewAll'>) {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <div className={cn('space-y-3', className)}>
      {displayActivities.map((activity, index) => {
        const config = activityConfig[activity.type]
        const Icon = config.icon

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                config.bgColor,
                config.iconColor
              )}
            >
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {activity.title}
              </p>
              <p className="text-xs text-neutral-500">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
            {activity.amount && (
              <span className="text-sm font-medium text-emerald-600">
                {activity.amount}
              </span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default ActivityFeed
