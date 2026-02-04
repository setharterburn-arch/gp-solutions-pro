import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Customer, Employee, Job, Estimate, Invoice, Lead, Settings } from './supabase'

interface AppState {
  // Auth
  user: Employee | null
  setUser: (user: Employee | null) => void
  
  // UI
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Settings
  settings: Settings | null
  setSettings: (settings: Settings | null) => void
  
  // Filters
  jobFilters: {
    status: string[]
    dateRange: { start: string | null; end: string | null }
    assignedTo: string[]
  }
  setJobFilters: (filters: Partial<AppState['jobFilters']>) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      sidebarOpen: false, // Default closed for mobile
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      sidebarCollapsed: false, // Desktop sidebar collapse state
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      
      settings: null,
      setSettings: (settings) => set({ settings }),
      
      jobFilters: {
        status: [],
        dateRange: { start: null, end: null },
        assignedTo: []
      },
      setJobFilters: (filters) => 
        set((state) => ({ jobFilters: { ...state.jobFilters, ...filters } })),
    }),
    {
      name: 'gp-solutions-storage',
      partialize: (state) => ({ 
        sidebarOpen: state.sidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed 
      })
    }
  )
)
