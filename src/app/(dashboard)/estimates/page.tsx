'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  FileText,
  Send,
  CheckCircle,
  XCircle,
  MoreVertical,
  ArrowRight
} from 'lucide-react'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface Estimate {
  id: string
  title: string
  customer_name: string
  customer_email: string
  total: number
  status: string
  valid_until: string
  created_at: string
}

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
]

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEstimates() {
      try {
        const { data, error } = await supabase
          .from('estimates')
          .select(`
            id,
            title,
            total,
            status,
            valid_until,
            created_at,
            customers (
              name,
              email
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        const formattedEstimates = (data || []).map((est: any) => ({
          id: est.id,
          title: est.title,
          customer_name: est.customers?.name || 'Unknown',
          customer_email: est.customers?.email || '',
          total: est.total,
          status: est.status,
          valid_until: est.valid_until,
          created_at: est.created_at
        }))

        setEstimates(formattedEstimates)
      } catch (error) {
        console.error('Error fetching estimates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEstimates()
  }, [])

  const filteredEstimates = estimates.filter(estimate => {
    const matchesSearch = 
      estimate.title.toLowerCase().includes(search.toLowerCase()) ||
      estimate.customer_name.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    draft: estimates.filter(e => e.status === 'draft').length,
    sent: estimates.filter(e => e.status === 'sent').length,
    approved: estimates.filter(e => e.status === 'approved').length,
    totalValue: estimates.filter(e => e.status === 'sent').reduce((sum, e) => sum + e.total, 0)
  }

  const handleSendEstimate = async (id: string) => {
    setEstimates(estimates.map(e => 
      e.id === id ? { ...e, status: 'sent' } : e
    ))
  }

  const handleConvertToJob = async (id: string) => {
    // TODO: Navigate to new job with estimate data prefilled
    console.log('Converting estimate to job:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
          <p className="text-gray-500">Create and manage quotes for customers</p>
        </div>
        <Link
          href="/estimates/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Estimate
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Draft</p>
          <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Sent (Pending)</p>
          <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pending Value</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search estimates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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

      {/* Estimates List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Estimate</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Valid Until</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEstimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Link href={`/estimates/${estimate.id}`} className="hover:text-blue-600">
                      <div className="flex items-center gap-3">
                        <FileText className="text-gray-400" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">{estimate.title}</p>
                          <p className="text-sm text-gray-500">Created {formatDate(estimate.created_at)}</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{estimate.customer_name}</p>
                    <p className="text-sm text-gray-500">{estimate.customer_email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{formatCurrency(estimate.total)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-900">{formatDate(estimate.valid_until)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(estimate.status)}`}>
                      {estimate.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {estimate.status === 'draft' && (
                        <button
                          onClick={() => handleSendEstimate(estimate.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Send Estimate"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {estimate.status === 'approved' && (
                        <button
                          onClick={() => handleConvertToJob(estimate.id)}
                          className="flex items-center gap-1 px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                          title="Convert to Job"
                        >
                          <ArrowRight size={14} />
                          Create Job
                        </button>
                      )}
                      <Link
                        href={`/estimates/${estimate.id}/edit`}
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

        {filteredEstimates.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="mx-auto mb-2 text-gray-300" size={40} />
            <p>No estimates found</p>
            <Link href="/estimates/new" className="text-blue-600 hover:underline text-sm">
              Create your first estimate
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
