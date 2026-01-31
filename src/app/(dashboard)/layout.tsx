'use client'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar />
      <Header />
      <main className="pt-16 ml-0 lg:ml-72 transition-all duration-300">
        <div className="p-4 lg:p-6 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  )
}
