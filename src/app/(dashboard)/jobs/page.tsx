'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User,
  MoreVertical,
  CheckCircle,
  XCircle,
  Play,
  Calendar
} from 'lucide-react'
import { formatDate, formatTime, formatCurrency, getStatusColor, getPriorityColor } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface Job {
  id: string
  title: string
  customer_name: string
  customer_phone: string
  customer_address: string
  scheduled_date: string
  scheduled_time: string
  status: string
  priority: string
  price: number
  job_type: string
  assigned_to: string[]
}

const statusFilters = [
  { value: 'all', label: 'All Jobs' },
  { value: 'unscheduled', label: 'Unscheduled' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            id,
            title,
            scheduled_date,
            scheduled_time,
            status,
            priority,
            price,
            job_type_id,
            assigned_to,
            customers (
              name,
              phone,
              address,
              city,
              state
            ),
            job_types (
              name
            )
          `)
          .order('scheduled_date', { ascending: true })

        if (error) throw error

        const formattedJobs = (data || []).map(job => ({
          id: job.id,
          title: job.title,
          customer_name: job.customers?.name || 'Unknown',
          customer_phone: job.customers?.phone || '',
          customer_address: [job.customers?.address, job.customers?.city, job.customers?.state].filter(Boolean).join(', '),
          scheduled_date: job.scheduled_date,
          scheduled_time: job.scheduled_time,
          status: job.status,
          priority: job.priority,
          price: job.price || 0,
          job_type: job.job_types?.name || '',
          assigned_to: job.assigned_to || []
        }))

        setJobs(formattedJobs)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      job.customer_address.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ))
    // TODO: API call to update status
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-500">{filteredJobs.length} jobs found</p>
        </div>
        <Link
          href="/jobs/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs, customers, addresses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Job</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Schedule</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Assigned</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.job_type}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{job.customer_name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin size={12} />
                      {job.customer_address}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(job.scheduled_date)}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {formatTime(job.scheduled_time)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <User size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {job.assigned_to.join(', ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{formatCurrency(job.price)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                        {job.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {job.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'in_progress')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Start Job"
                        >
                          <Play size={16} />
                        </button>
                      )}
                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'completed')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Complete Job"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <Link
                        href={`/jobs/${job.id}/edit`}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No jobs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
