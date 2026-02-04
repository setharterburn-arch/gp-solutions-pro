'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Receipt, 
  Clock,
  TrendingUp,
  UserPlus,
  Settings,
  DollarSign,
  Map,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ size?: number }>
  badge?: number
  badgeVariant?: 'default' | 'warning' | 'error'
}

// Badge counts would come from your data layer in production
const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Schedule', href: '/schedule', icon: Calendar, badge: 3 },
  { name: 'Jobs', href: '/jobs', icon: Briefcase, badge: 12 },
  { name: 'Route', href: '/route', icon: Map },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Leads', href: '/leads', icon: UserPlus, badge: 5, badgeVariant: 'warning' },
  { name: 'Estimates', href: '/estimates', icon: FileText, badge: 2 },
  { name: 'Invoices', href: '/invoices', icon: Receipt, badge: 4, badgeVariant: 'error' },
  { name: 'Time', href: '/time', icon: Clock },
  { name: 'Expenses', href: '/expenses', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
]

const badgeStyles = {
  default: 'bg-teal-500/20 text-teal-300',
  warning: 'bg-amber-500/20 text-amber-300',
  error: 'bg-red-500/20 text-red-300',
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useStore()

  const isCollapsed = sidebarCollapsed && !sidebarOpen

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <aside className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-out',
        'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800',
        // Width based on collapse state
        isCollapsed ? 'w-[72px]' : 'w-72',
        // Mobile: hidden by default
        '-translate-x-full lg:translate-x-0',
        sidebarOpen && 'translate-x-0 w-72', // Always full width when mobile menu open
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <Link 
            href="/" 
            className="flex items-center gap-3 overflow-hidden"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
          >
            <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20">
              GP
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="font-semibold text-white text-lg">GP Solutions</span>
                  <div className="flex items-center gap-1 text-xs text-teal-400">
                    <Sparkles size={10} />
                    <span>Pro</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl transition-all duration-200 group relative',
                  isCollapsed ? 'px-0 py-2.5 justify-center' : 'px-4 py-2.5',
                  isActive 
                    ? 'bg-gradient-to-r from-teal-500/20 to-transparent text-white' 
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-lg transition-colors flex-shrink-0',
                  isActive 
                    ? 'bg-teal-500/20 text-teal-400' 
                    : 'text-stone-500 group-hover:text-stone-300'
                )}>
                  <item.icon size={18} />
                </div>
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    'text-xs font-semibold rounded-full',
                    isCollapsed 
                      ? 'absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px]' 
                      : 'ml-auto px-2 py-0.5',
                    badgeStyles[item.badgeVariant || 'default']
                  )}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
                
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-white/10 space-y-1">
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              'hidden lg:flex items-center gap-3 w-full rounded-xl transition-all duration-200',
              'text-stone-400 hover:text-white hover:bg-white/5',
              isCollapsed ? 'px-0 py-2.5 justify-center' : 'px-4 py-2.5'
            )}
          >
            <div className="p-1.5 rounded-lg text-stone-500">
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium overflow-hidden whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <Link
            href="/settings"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            title={isCollapsed ? 'Settings' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl transition-all duration-200',
              isCollapsed ? 'px-0 py-2.5 justify-center' : 'px-4 py-2.5',
              pathname.startsWith('/settings')
                ? 'bg-gradient-to-r from-teal-500/20 to-transparent text-white' 
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            )}
          >
            <div className={cn(
              'p-1.5 rounded-lg flex-shrink-0',
              pathname.startsWith('/settings') 
                ? 'bg-teal-500/20 text-teal-400' 
                : 'text-stone-500'
            )}>
              <Settings size={18} />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium overflow-hidden whitespace-nowrap"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </aside>
    </>
  )
}
