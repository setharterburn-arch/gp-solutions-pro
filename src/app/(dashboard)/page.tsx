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
  CheckCircle,
  AlertCircle,
  MapPin
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
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Mock data for demo - replace with actual API calls
  useEffect(() => {
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
      {
        id: '4',
        title: 'Furnace Inspection',
        customer_name: 'Alice Brown',
        customer_address: '321 Elm St, Springfield',
        scheduled_time: '16:00',
        status: 'scheduled',
        priority: 'low'
      },
    ])

    setRecentActivity([
      { type: 'job_completed', message: 'AC Repair completed for Sarah Johnson', time: '2 hours ago' },
      { type: 'payment', message: 'Payment received: $450.00 from Mike Davis', time: '3 hours ago' },
      { type: 'new_lead', message: 'New lead: Commercial HVAC inquiry', time: '5 hours ago' },
      { type: 'estimate_approved', message: 'Estimate approved by Tech Corp', time: 'Yesterday' },
    ])
  }, [])

  const statCards = [
    {
      title: "Today's Jobs",
      value: stats.todayJobs,
      icon: Calendar,
      color: 'bg-blue-500',
      href: '/schedule'
    },
    {
      title: "This Week",
      value: stats.weekJobs,
      icon: Briefcase,
      color: 'bg-purple-500',
      href: '/jobs'
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-green-500',
      href: '/customers'
    },
    {
      title: "Month Revenue",
      value: formatCurrency(stats.monthRevenue),
      icon: DollarSign,
      color: 'bg-emerald-500',
      href: '/reports'
    },
    {
      title: "Outstanding",
      value: formatCurrency(stats.outstandingInvoices),
      icon: AlertCircle,
      color: 'bg-orange-500',
      href: '/invoices?status=sent'
    },
    {
      title: "Active Leads",
      value: stats.activeLeads,
      icon: TrendingUp,
      color: 'bg-pink-500',
      href: '/leads'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
            <Link href="/schedule" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {todayJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="mx-auto mb-2 text-gray-300" size={40} />
                <p>No jobs scheduled for today</p>
                <Link href="/jobs/new" className="text-blue-600 hover:underline text-sm">
                  Schedule a job
                </Link>
              </div>
            ) : (
              todayJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatTime(job.scheduled_time)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{job.title}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                        {job.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{job.customer_name}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {job.customer_address}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full ${
                    activity.type === 'job_completed' ? 'bg-green-100 text-green-600' :
                    activity.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                    activity.type === 'new_lead' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'job_completed' ? <CheckCircle size={14} /> :
                     activity.type === 'payment' ? <DollarSign size={14} /> :
                     activity.type === 'new_lead' ? <Users size={14} /> :
                     <TrendingUp size={14} />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/jobs/new"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <Briefcase className="mx-auto mb-2 text-blue-600" size={24} />
          <p className="font-medium text-gray-900">Schedule Job</p>
        </Link>
        <Link
          href="/estimates/new"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <TrendingUp className="mx-auto mb-2 text-purple-600" size={24} />
          <p className="font-medium text-gray-900">Create Estimate</p>
        </Link>
        <Link
          href="/invoices/new"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <DollarSign className="mx-auto mb-2 text-green-600" size={24} />
          <p className="font-medium text-gray-900">Send Invoice</p>
        </Link>
        <Link
          href="/time"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <Clock className="mx-auto mb-2 text-orange-600" size={24} />
          <p className="font-medium text-gray-900">Clock In</p>
        </Link>
      </div>
    </div>
  )
}
