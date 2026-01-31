'use client'

import { Bell, Search, Plus, User, Menu, LogOut } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useAuth } from '@/components/AuthProvider'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const { sidebarOpen, setSidebarOpen, user } = useStore()
  const { signOut } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  return (
    <header className={cn(
      'fixed top-0 right-0 z-20 h-16 bg-white border-b border-gray-200 transition-all duration-300',
      'left-0 lg:left-64',
      !sidebarOpen && 'lg:left-20'
    )}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block md:w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Add */}
          <div className="relative">
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>New</span>
            </button>
            
            {showQuickAdd && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  href="/jobs/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowQuickAdd(false)}
                >
                  New Job
                </Link>
                <Link
                  href="/customers/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowQuickAdd(false)}
                >
                  New Customer
                </Link>
                <Link
                  href="/estimates/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowQuickAdd(false)}
                >
                  New Estimate
                </Link>
                <Link
                  href="/invoices/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowQuickAdd(false)}
                >
                  New Invoice
                </Link>
                <Link
                  href="/leads/new"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowQuickAdd(false)}
                >
                  New Lead
                </Link>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium">Job completed</p>
                    <p className="text-sm text-gray-500">HVAC Repair for John Smith</p>
                    <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium">Invoice paid</p>
                    <p className="text-sm text-gray-500">$450.00 from Jane Doe</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <Link href="/notifications" className="text-sm text-blue-600 hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.[0] || 'A'}
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="font-medium">{user?.name || 'Admin'}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'admin@gpsolutions.com'}</p>
                </div>
                <Link
                  href="/settings/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  Settings
                </Link>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  onClick={signOut}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
