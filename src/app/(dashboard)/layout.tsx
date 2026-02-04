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
  const { sidebarCollapsed } = useStore()

  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar />
      <Header />
      <main className={cn(
        'pt-16 ml-0 transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-72'
      )}>
        <div className="p-4 lg:p-6 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  )
}
