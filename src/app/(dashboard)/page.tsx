'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock,
  ArrowRight,
  AlertCircle,
  MapPin,
  Sparkles,
  Zap
} from 'lucide-react'
import { formatCurrency, formatTime, formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  todayJobs: number
  weekJobs: number
  totalCustomers: number
  monthRevenue: number
  outstandingInvoices: number
  activeLeads: number
}

interface TodayJob {
  id: string
  title: string
  customer_name: string
  customer_address: string
  scheduled_time: string
  status: string
  priority: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayJobs: 0,
    weekJobs: 0,
    totalCustomers: 0,
    monthRevenue: 0,
    outstandingInvoices: 0,
    activeLeads: 0
  })
  const [todayJobs, setTodayJobs] = useState<TodayJob[]>([])
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    async function fetchDashboardData() {
      try {
        const today = new Date().toISOString().split('T')[0]
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

        // Fetch counts in parallel
        const [
          { count: todayJobsCount },
          { count: weekJobsCount },
          { count: customersCount },
          { count: leadsCount },
          { data: invoicesData },
          { data: todayJobsData }
        ] = await Promise.all([
          supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('scheduled_date', today),
          supabase.from('jobs').select('*', { count: 'exact', head: true }).gte('scheduled_date', weekAgo),
          supabase.from('customers').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*', { count: 'exact', head: true }).not('status', 'in', '("won","lost")'),
          supabase.from('invoices').select('total, amount_paid, status').in('status', ['sent', 'partial', 'overdue']),
          supabase.from('jobs').select(`
            id, title, scheduled_time, status, priority,
            customers (name, address, city, state)
          `).eq('scheduled_date', today).order('scheduled_time')
        ])

        // Calculate outstanding invoices
        const outstanding = (invoicesData || []).reduce((sum, inv) => sum + (inv.total - (inv.amount_paid || 0)), 0)

        // Format today's jobs
        const formattedJobs = (todayJobsData || []).map((job: any) => ({
          id: job.id,
          title: job.title,
          customer_name: job.customers?.name || 'Unknown',
          customer_address: [job.customers?.address, job.customers?.city, job.customers?.state].filter(Boolean).join(', '),
          scheduled_time: job.scheduled_time || '',
          status: job.status,
          priority: job.priority
        }))

        setStats({
          todayJobs: todayJobsCount || 0,
          weekJobs: weekJobsCount || 0,
          totalCustomers: customersCount || 0,
          monthRevenue: 0, // Would need to calculate from paid invoices
          outstandingInvoices: outstanding,
          activeLeads: leadsCount || 0
        })

        setTodayJobs(formattedJobs)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'scheduled': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}! 👋</h1>
          <p className="text-gray-500">Here's what's happening today</p>
        </div>
        <Link
          href="/jobs/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Zap size={18} />
          Quick Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Link href="/schedule" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.todayJobs}</p>
              <p className="text-xs text-gray-500">Today's Jobs</p>
            </div>
          </div>
        </Link>

        <Link href="/jobs" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.weekJobs}</p>
              <p className="text-xs text-gray-500">This Week</p>
            </div>
          </div>
        </Link>

        <Link href="/customers" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className="text-xs text-gray-500">Customers</p>
            </div>
          </div>
        </Link>

        <Link href="/leads" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeLeads}</p>
              <p className="text-xs text-gray-500">Active Leads</p>
            </div>
          </div>
        </Link>

        <Link href="/invoices?status=sent" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.outstandingInvoices)}</p>
              <p className="text-xs text-gray-500">Outstanding</p>
            </div>
          </div>
        </Link>

        <Link href="/reports" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthRevenue)}</p>
              <p className="text-xs text-gray-500">This Month</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Today's Jobs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
          <Link href="/schedule" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : todayJobs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {todayJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-16 text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {job.scheduled_time ? formatTime(job.scheduled_time) : '--:--'}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">{job.title}</p>
                    {job.priority === 'urgent' || job.priority === 'high' ? (
                      <AlertCircle className={getPriorityColor(job.priority)} size={16} />
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{job.customer_name}</p>
                  {job.customer_address && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {job.customer_address}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Calendar className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-gray-500">No jobs scheduled for today</p>
            <Link href="/jobs/new" className="text-blue-600 hover:underline text-sm">
              Schedule a job
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/customers/new"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <Users className="mx-auto text-blue-600 mb-2" size={24} />
          <p className="text-sm font-medium text-gray-900">Add Customer</p>
        </Link>
        <Link
          href="/estimates/new"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <Sparkles className="mx-auto text-purple-600 mb-2" size={24} />
          <p className="text-sm font-medium text-gray-900">New Estimate</p>
        </Link>
        <Link
          href="/invoices/new"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <DollarSign className="mx-auto text-green-600 mb-2" size={24} />
          <p className="text-sm font-medium text-gray-900">New Invoice</p>
        </Link>
        <Link
          href="/leads/new"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <TrendingUp className="mx-auto text-orange-600 mb-2" size={24} />
          <p className="text-sm font-medium text-gray-900">Add Lead</p>
        </Link>
      </div>
    </div>
  )
}
