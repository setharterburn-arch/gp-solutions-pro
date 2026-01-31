'use client'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen } = useStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className={cn(
        'pt-16 transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-20'
      )}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
