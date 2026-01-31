'use client'

import { Bell, Search, Plus, Menu, LogOut, User, ChevronDown, Settings } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useAuth } from '@/components/AuthProvider'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { sidebarOpen, setSidebarOpen, user } = useStore()
  const { signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const quickAddRef = useRef<HTMLDivElement>(null)

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setShowQuickAdd(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 right-0 z-20 h-16 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 transition-all duration-300',
      'left-0 lg:left-72'
    )}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors lg:hidden"
          >
            <Menu size={22} />
          </button>
          
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-72 lg:w-80 pl-10 pr-4 py-2.5 bg-stone-100/80 border-0 rounded-xl text-sm placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-stone-400 bg-white rounded-md border border-stone-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Quick Add */}
          <div className="relative" ref={quickAddRef}>
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium text-sm hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Create</span>
            </button>
            
            {showQuickAdd && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 text-xs font-medium text-stone-400 uppercase tracking-wider">
                  Quick Actions
                </div>
                {[
                  { href: '/jobs/new', label: 'New Job', emoji: '📋' },
                  { href: '/customers/new', label: 'New Customer', emoji: '👤' },
                  { href: '/estimates/new', label: 'New Estimate', emoji: '📝' },
                  { href: '/invoices/new', label: 'New Invoice', emoji: '💰' },
                  { href: '/leads/new', label: 'New Lead', emoji: '🎯' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors"
                    onClick={() => setShowQuickAdd(false)}
                  >
                    <span>{item.emoji}</span>
                    <span className="text-sm text-stone-700">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pl-1.5 pr-3 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-medium shadow-sm">
                {user?.name?.[0] || 'U'}
              </div>
              <ChevronDown size={16} className="text-stone-400" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="font-medium text-stone-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-stone-500">{user?.email || 'user@company.com'}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="text-stone-400" />
                    <span className="text-sm text-stone-700">Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} className="text-stone-400" />
                    <span className="text-sm text-stone-700">Settings</span>
                  </Link>
                </div>
                <div className="border-t border-stone-100 pt-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600"
                    onClick={signOut}
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
