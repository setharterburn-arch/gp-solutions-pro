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
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Zap
} from 'lucide-react'
import { formatCurrency, formatTime, getStatusColor, getPriorityColor } from '@/lib/utils'

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

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Mock data
    setStats({
      todayJobs: 5,
      weekJobs: 23,
      totalCustomers: 156,
      monthRevenue: 24750,
      outstandingInvoices: 8450,
      activeLeads: 12
    })

    setTodayJobs([
      {
        id: '1',
        title: 'HVAC Maintenance',
        customer_name: 'John Smith',
        customer_address: '123 Main St, Springfield',
        scheduled_time: '09:00',
        status: 'scheduled',
        priority: 'normal'
      },
      {
        id: '2',
        title: 'AC Repair',
        customer_name: 'Jane Doe',
        customer_address: '456 Oak Ave, Springfield',
        scheduled_time: '11:30',
        status: 'in_progress',
        priority: 'high'
      },
      {
        id: '3',
        title: 'New Installation',
        customer_name: 'Bob Wilson',
        customer_address: '789 Pine Rd, Springfield',
        scheduled_time: '14:00',
        status: 'scheduled',
        priority: 'normal'
      },
    ])
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { 
            title: "Today's Jobs", 
            value: stats.todayJobs, 
            icon: Calendar, 
            color: 'from-teal-500 to-teal-600',
            bgColor: 'bg-teal-50',
            iconColor: 'text-teal-600',
            href: '/schedule' 
          },
          { 
            title: "This Week", 
            value: stats.weekJobs, 
            icon: Briefcase, 
            color: 'from-violet-500 to-violet-600',
            bgColor: 'bg-violet-50',
            iconColor: 'text-violet-600',
            href: '/jobs' 
          },
          { 
            title: "Customers", 
            value: stats.totalCustomers, 
            icon: Users, 
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            href: '/customers' 
          },
          { 
            title: "Revenue", 
            value: formatCurrency(stats.monthRevenue), 
            icon: TrendingUp, 
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            trend: '+12%',
            href: '/reports' 
          },
          { 
            title: "Outstanding", 
            value: formatCurrency(stats.outstandingInvoices), 
            icon: AlertCircle, 
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            href: '/invoices?status=sent' 
          },
          { 
            title: "Active Leads", 
            value: stats.activeLeads, 
            icon: Sparkles, 
            color: 'from-pink-500 to-pink-600',
            bgColor: 'bg-pink-50',
            iconColor: 'text-pink-600',
            href: '/leads' 
          },
        ].map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className="group relative bg-white rounded-2xl p-4 border border-stone-200/50 hover:border-stone-300 transition-all hover:shadow-lg hover:shadow-stone-200/50"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={stat.iconColor} size={20} />
              </div>
              {stat.trend && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={12} />
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
              <p className="text-sm text-stone-500 mt-0.5">{stat.title}</p>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Link>
        ))}
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
                <Link 
                  href="/jobs/new" 
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Schedule a job
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              todayJobs.map((job, idx) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-stone-50/50 transition-colors group"
                >
                  {/* Time */}
                  <div className="w-16 text-center flex-shrink-0">
                    <p className="text-lg font-semibold text-stone-900">
                      {formatTime(job.scheduled_time)}
                    </p>
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`w-1 h-12 rounded-full ${
                    job.status === 'in_progress' ? 'bg-amber-400' :
                    job.status === 'completed' ? 'bg-emerald-400' :
                    'bg-teal-400'
                  }`} />
                  
                  {/* Job details */}
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
                  
                  {/* Arrow */}
                  <ArrowRight size={18} className="text-stone-300 group-hover:text-teal-500 transition-colors" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions + Activity */}
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

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-stone-200/50 overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-semibold text-stone-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-stone-100">
              {[
                { type: 'completed', text: 'AC Repair completed', sub: 'Sarah Johnson', time: '2h ago', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
                { type: 'payment', text: 'Payment received', sub: '$450.00', time: '3h ago', icon: DollarSign, color: 'text-teal-500 bg-teal-50' },
                { type: 'lead', text: 'New lead', sub: 'Commercial inquiry', time: '5h ago', icon: Sparkles, color: 'text-violet-500 bg-violet-50' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4">
                  <div className={`p-2 rounded-xl ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900">{item.text}</p>
                    <p className="text-sm text-stone-500">{item.sub}</p>
                  </div>
                  <span className="text-xs text-stone-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
