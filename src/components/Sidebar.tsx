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
  ChevronRight
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
    <aside className={cn(
      'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300',
      sidebarOpen ? 'w-64' : 'w-20'
    )}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-700">
        {sidebarOpen && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
              GP
            </div>
            <span className="font-semibold text-lg">GP Solutions</span>
          </Link>
        )}
        {!sidebarOpen && (
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold mx-auto">
            GP
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
