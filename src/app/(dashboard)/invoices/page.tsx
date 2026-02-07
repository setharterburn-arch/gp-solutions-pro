'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Receipt,
  Send,
  DollarSign,
  Eye,
  MoreVertical,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface Invoice {
  id: string
  invoice_number: string
  customer_name: string
  customer_email: string
  job_title: string | null
  total: number
  amount_paid: number
  status: string
  due_date: string
  sent_at: string | null
  created_at: string
}

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            id,
            invoice_number,
            total,
            amount_paid,
            status,
            due_date,
            sent_at,
            created_at,
            customers (
              name,
              email
            ),
            jobs (
              title
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        const formattedInvoices = (data || []).map((inv: any) => ({
          id: inv.id,
          invoice_number: inv.invoice_number,
          customer_name: inv.customers?.name || 'Unknown',
          customer_email: inv.customers?.email || '',
          job_title: inv.jobs?.title || null,
          total: inv.total,
          amount_paid: inv.amount_paid,
          status: inv.status,
          due_date: inv.due_date,
          sent_at: inv.sent_at,
          created_at: inv.created_at
        }))

        setInvoices(formattedInvoices)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      invoice.job_title?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalOutstanding: invoices
      .filter(i => ['sent', 'viewed', 'partial', 'overdue'].includes(i.status))
      .reduce((sum, i) => sum + (i.total - i.amount_paid), 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + (i.total - i.amount_paid), 0),
    paidThisMonth: invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0),
    pendingCount: invoices.filter(i => ['sent', 'viewed'].includes(i.status)).length
  }

  const handleSendInvoice = async (id: string) => {
    setInvoices(invoices.map(i => 
      i.id === id ? { ...i, status: 'sent', sent_at: new Date().toISOString() } : i
    ))
  }

  const handleRecordPayment = async (id: string) => {
    // TODO: Open payment modal
    console.log('Recording payment for:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500">Manage invoices and track payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/invoices/batch"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Receipt size={20} />
            Batch Invoice
          </Link>
          <Link
            href="/invoices/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign size={16} />
            <p className="text-sm">Outstanding</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalOutstanding)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <AlertCircle size={16} />
            <p className="text-sm">Overdue</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-green-500 mb-1">
            <CheckCircle size={16} />
            <p className="text-sm">Paid This Month</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidThisMonth)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Receipt size={16} />
            <p className="text-sm">Pending</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.pendingCount} invoices</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search invoices..."
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

      {/* Invoices List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Invoice</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Link href={`/invoices/${invoice.id}`} className="hover:text-blue-600">
                      <p className="font-medium text-gray-900">{invoice.invoice_number}</p>
                      <p className="text-sm text-gray-500">{invoice.job_title || 'No job linked'}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{invoice.customer_name}</p>
                    <p className="text-sm text-gray-500">{invoice.customer_email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{formatCurrency(invoice.total)}</p>
                    {invoice.amount_paid > 0 && invoice.amount_paid < invoice.total && (
                      <p className="text-sm text-green-600">
                        {formatCurrency(invoice.amount_paid)} paid
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className={`${invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {formatDate(invoice.due_date)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => handleSendInvoice(invoice.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Send Invoice"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {['sent', 'viewed', 'partial', 'overdue'].includes(invoice.status) && (
                        <button
                          onClick={() => handleRecordPayment(invoice.id)}
                          className="flex items-center gap-1 px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                          title="Record Payment"
                        >
                          <DollarSign size={14} />
                          Pay
                        </button>
                      )}
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="View Invoice"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Receipt className="mx-auto mb-2 text-gray-300" size={40} />
            <p>No invoices found</p>
            <Link href="/invoices/new" className="text-blue-600 hover:underline text-sm">
              Create your first invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
