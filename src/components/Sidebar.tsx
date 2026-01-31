'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Sparkles
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Route', href: '/route', icon: Map },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Leads', href: '/leads', icon: UserPlus },
  { name: 'Estimates', href: '/estimates', icon: FileText },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Time', href: '/time', icon: Clock },
  { name: 'Expenses', href: '/expenses', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-out',
        // Gradient background
        'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800',
        // Mobile: hidden by default, full width when open
        'w-72 -translate-x-full lg:translate-x-0',
        sidebarOpen && 'translate-x-0',
        // Desktop: always w-72 (we'll remove the collapse for cleaner UX)
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
          <Link 
            href="/" 
            className="flex items-center gap-3"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20">
              GP
            </div>
            <div>
              <span className="font-semibold text-white text-lg">GP Solutions</span>
              <div className="flex items-center gap-1 text-xs text-teal-400">
                <Sparkles size={10} />
                <span>Pro</span>
              </div>
            </div>
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
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group',
                  isActive 
                    ? 'bg-gradient-to-r from-teal-500/20 to-transparent text-white' 
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-teal-500/20 text-teal-400' 
                    : 'text-stone-500 group-hover:text-stone-300'
                )}>
                  <item.icon size={18} />
                </div>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <Link
            href="/settings"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
              pathname.startsWith('/settings')
                ? 'bg-gradient-to-r from-teal-500/20 to-transparent text-white' 
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            )}
          >
            <div className={cn(
              'p-1.5 rounded-lg',
              pathname.startsWith('/settings') 
                ? 'bg-teal-500/20 text-teal-400' 
                : 'text-stone-500'
            )}>
              <Settings size={18} />
            </div>
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
