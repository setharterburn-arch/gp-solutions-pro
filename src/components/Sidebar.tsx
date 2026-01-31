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
  ChevronLeft,
  ChevronRight,
  X
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
  { name: 'Time Tracking', href: '/time', icon: Clock },
  { name: 'Expenses', href: '/expenses', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300',
        // Mobile: hidden by default, full width when open
        'w-64 -translate-x-full lg:translate-x-0',
        sidebarOpen && 'translate-x-0',
        // Desktop: toggle between wide and narrow
        !sidebarOpen && 'lg:w-20'
      )}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}>
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            GP
          </div>
          <span className={cn("font-semibold text-lg", !sidebarOpen && "lg:hidden")}>GP Solutions</span>
        </Link>
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors lg:hidden"
        >
          <X size={20} />
        </button>
        {/* Collapse button for desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors hidden lg:block"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon size={20} />
              <span className={cn(!sidebarOpen && "lg:hidden")}>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
    </>
  )
}
