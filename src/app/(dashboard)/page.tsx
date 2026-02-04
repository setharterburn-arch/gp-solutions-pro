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
import { formatCurrency, formatTime } from '@/lib/utils'
import { StatCardWithSparkline } from '@/components/dashboard/Sparkline'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'

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

  // Mock activity data
  const activities = [
    { id: '1', type: 'job_completed' as const, title: 'AC Repair completed', description: 'Sarah Johnson - 123 Main St', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), amount: '$450', user: { name: 'Mike T' } },
    { id: '2', type: 'invoice_paid' as const, title: 'Invoice #1042 paid', description: 'John Smith', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), amount: '$1,250' },
    { id: '3', type: 'customer_added' as const, title: 'New customer added', description: 'Commercial inquiry', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), user: { name: 'Admin' } },
    { id: '4', type: 'estimate_approved' as const, title: 'Estimate approved', description: 'HVAC Installation - Bob Wilson', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), amount: '$3,800' },
  ]

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Simulate loading
    setTimeout(() => {
      setStats({
        todayJobs: 5,
        weekJobs: 23,
        totalCustomers: 156,
        monthRevenue: 24750,
        outstandingInvoices: 8450,
        activeLeads: 12
      })

      setTodayJobs([
        { id: '1', title: 'HVAC Maintenance', customer_name: 'John Smith', customer_address: '123 Main St, Springfield', scheduled_time: '09:00', status: 'scheduled', priority: 'normal' },
        { id: '2', title: 'AC Repair', customer_name: 'Jane Doe', customer_address: '456 Oak Ave, Springfield', scheduled_time: '11:30', status: 'in_progress', priority: 'high' },
        { id: '3', title: 'New Installation', customer_name: 'Bob Wilson', customer_address: '789 Pine Rd, Springfield', scheduled_time: '14:00', status: 'scheduled', priority: 'normal' },
      ])
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="space-y-6 page-transition">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stone-900">
            {greeting} 👋
          </h1>
          <p className="text-stone-500 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
        >
          <Zap size={18} />
          Quick Job
        </Link>
      </div>

      {/* Stats Grid with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCardWithSparkline
          title="Today's Jobs"
          value={stats.todayJobs}
          icon={Calendar}
          color="teal"
          sparklineData={[3, 5, 4, 6, 5, 7, 5]}
          href="/schedule"
          delay={0}
          loading={loading}
        />
        <StatCardWithSparkline
          title="This Week"
          value={stats.weekJobs}
          change={8}
          icon={Briefcase}
          color="violet"
          sparklineData={[18, 22, 19, 25, 21, 23, 23]}
          href="/jobs"
          delay={0.05}
          loading={loading}
        />
        <StatCardWithSparkline
          title="Customers"
          value={stats.totalCustomers}
          change={3}
          icon={Users}
          color="blue"
          sparklineData={[140, 145, 148, 150, 152, 155, 156]}
          href="/customers"
          delay={0.1}
          loading={loading}
        />
        <StatCardWithSparkline
          title="Revenue"
          value={formatCurrency(stats.monthRevenue)}
          change={12}
          icon={TrendingUp}
          color="emerald"
          sparklineData={[18000, 19500, 21000, 22500, 23000, 24000, 24750]}
          href="/reports"
          delay={0.15}
          loading={loading}
        />
        <StatCardWithSparkline
          title="Outstanding"
          value={formatCurrency(stats.outstandingInvoices)}
          change={-5}
          icon={AlertCircle}
          color="amber"
          sparklineData={[12000, 11000, 10500, 9800, 9200, 8800, 8450]}
          href="/invoices?status=sent"
          delay={0.2}
          loading={loading}
        />
        <StatCardWithSparkline
          title="Active Leads"
          value={stats.activeLeads}
          change={15}
          icon={Sparkles}
          color="rose"
          sparklineData={[8, 9, 10, 9, 11, 10, 12]}
          href="/leads"
          delay={0.25}
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/50 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-stone-100">
            <div>
              <h2 className="font-semibold text-stone-900">Today's Schedule</h2>
              <p className="text-sm text-stone-500 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Link 
              href="/schedule" 
              className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="divide-y divide-stone-100">
            {todayJobs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-stone-400" size={28} />
                </div>
                <p className="font-medium text-stone-900">No jobs today</p>
                <p className="text-sm text-stone-500 mt-1">Enjoy your day off! 🎉</p>
              </div>
            ) : (
              todayJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-stone-50/50 transition-colors group"
                >
                  <div className="w-16 text-center flex-shrink-0">
                    <p className="text-lg font-semibold text-stone-900">
                      {formatTime(job.scheduled_time)}
                    </p>
                  </div>
                  
                  <div className={`w-1 h-12 rounded-full ${
                    job.status === 'in_progress' ? 'bg-amber-400' :
                    job.status === 'completed' ? 'bg-emerald-400' : 'bg-teal-400'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-900 truncate">{job.title}</p>
                      {job.priority === 'high' && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-500">{job.customer_name}</p>
                    <p className="text-sm text-stone-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {job.customer_address}
                    </p>
                  </div>
                  
                  <ArrowRight size={18} className="text-stone-300 group-hover:text-teal-500 transition-colors" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-5 text-white">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Job', href: '/jobs/new', icon: Briefcase },
                { label: 'Estimate', href: '/estimates/new', icon: TrendingUp },
                { label: 'Invoice', href: '/invoices/new', icon: DollarSign },
                { label: 'Clock In', href: '/time', icon: Clock },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <action.icon size={22} />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity - Using new component */}
          <div className="bg-white rounded-2xl border border-stone-200/50 overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-semibold text-stone-900">Recent Activity</h3>
            </div>
            <ActivityFeed 
              activities={activities} 
              maxItems={4}
              showViewAll={false}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
