'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
} from 'lucide-react'

// Types
interface Column<T> {
  key: keyof T | string
  header: string
  width?: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  rowActions?: (item: T) => React.ReactNode
  sortable?: boolean
  loading?: boolean
  emptyState?: React.ReactNode
  className?: string
  mobileCardTransform?: boolean
}

// Skeleton loading component
function TableSkeleton({ columns, rowCount = 5 }: { columns: Column<any>[]; rowCount?: number }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b border-neutral-100">
          {columns.map((col, colIdx) => (
            <td key={colIdx} className="px-4 py-4">
              <div className="animate-pulse bg-neutral-200 rounded h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

// Sort icon component
function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) {
    return <ArrowUpDown size={14} className="text-neutral-400" />
  }
  return direction === 'asc' ? (
    <ChevronUp size={16} className="text-teal-600" />
  ) : (
    <ChevronDown size={16} className="text-teal-600" />
  )
}

// Main Table Component
export function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  rowActions,
  sortable = true,
  loading = false,
  emptyState,
  className,
  mobileCardTransform = true,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  const handleSort = (key: string) => {
    if (!sortable) return

    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedData = sortConfig.key
    ? [...data].sort((a, b) => {
        const aValue = (a as any)[sortConfig.key!]
        const bValue = (b as any)[sortConfig.key!]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return sortConfig.direction === 'asc'
          ? aValue > bValue
            ? 1
            : -1
          : aValue < bValue
            ? 1
            : -1
      })
    : data

  // Mobile Card View
  if (mobileCardTransform && typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <div className={cn('space-y-3', className)}>
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 border border-neutral-200 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
          ))
        ) : sortedData.length === 0 ? (
          emptyState || (
            <div className="text-center py-8 text-neutral-500">No data available</div>
          )
        ) : (
          sortedData.map((item, idx) => (
            <motion.div
              key={keyExtractor(item)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'bg-white rounded-xl p-4 border border-neutral-200 shadow-sm',
                onRowClick && 'cursor-pointer active:scale-[0.98] transition-transform'
              )}
            >
              {columns.map((col) => (
                <div key={String(col.key)} className="flex justify-between py-1">
                  <span className="text-sm text-neutral-500">{col.header}</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {col.render
                      ? col.render(item)
                      : String((item as any)[col.key] ?? '-')}
                  </span>
                </div>
              ))}
              {rowActions && (
                <div className="mt-3 pt-3 border-t border-neutral-100 flex justify-end">
                  {rowActions(item)}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    )
  }

  // Desktop Table View
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50/50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider',
                  col.sortable && sortable && 'cursor-pointer select-none',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.width
                )}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                <div
                  className={cn(
                    'flex items-center gap-1',
                    col.align === 'center' && 'justify-center',
                    col.align === 'right' && 'justify-end'
                  )}
                >
                  {col.header}
                  {col.sortable && sortable && (
                    <SortIcon
                      direction={
                        sortConfig.key === col.key ? sortConfig.direction : null
                      }
                    />
                  )}
                </div>
              </th>
            ))}
            {rowActions && <th className="w-px px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {loading ? (
            <TableSkeleton columns={columns} />
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (rowActions ? 1 : 0)}
                className="px-4 py-12 text-center"
              >
                {emptyState || (
                  <div className="text-neutral-500">
                    <p className="text-sm font-medium">No data available</p>
                    <p className="text-xs mt-1">Get started by adding some items</p>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            sortedData.map((item, idx) => (
              <motion.tr
                key={keyExtractor(item)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'group transition-colors hover:bg-neutral-50',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      'px-4 py-3.5 text-sm text-neutral-900',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right'
                    )}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as any)[col.key] ?? '-')}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-4 py-3.5">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
                      {rowActions(item)}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// Avatar component for table cells
interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ src, name, size = 'sm' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizes[size])}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white font-semibold flex items-center justify-center',
        sizes[size]
      )}
    >
      {initials}
    </div>
  )
}

// Action Button for table rows
interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
  variant?: 'default' | 'danger'
}

export function ActionButton({
  onClick,
  children,
  variant = 'default',
}: ActionButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      className={cn(
        'p-1.5 rounded-lg transition-colors',
        variant === 'default' &&
          'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
        variant === 'danger' &&
          'text-red-600 hover:text-red-700 hover:bg-red-50'
      )}
    >
      {children}
    </button>
  )
}

export default Table
