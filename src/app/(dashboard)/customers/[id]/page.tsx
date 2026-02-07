'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  Plus,
  Clock,
  User,
  Building
} from 'lucide-react'
import { formatCurrency, getStatusColor } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  company_name: string | null
  email: string | null
  phone: string | null
  alt_phone: string | null
  address: string | null
  address2: string | null
  city: string | null
  state: string | null
  zip: string | null
  type: 'residential' | 'commercial'
  status: string
  tags: string[]
  notes: string | null
  payment_terms: string
  tax_exempt: boolean
  total_jobs: number
  total_revenue: number
  created_at: string
}

interface Job {
  id: string
  title: string
  status: string
  scheduled_date: string
  price: number
}

interface Invoice {
  id: string
  number: string
  status: string
  date: string
  total: number
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'invoices'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API call
    setCustomer({
      id: params.id as string,
      name: 'John Smith',
      company_name: null,
      email: 'john@example.com',
      phone: '(555) 123-4567',
      alt_phone: '(555) 987-6543',
      address: '123 Main St',
      address2: null,
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      type: 'residential',
      status: 'active',
      tags: ['residential', 'vip'],
      notes: 'Great customer, always pays on time. Has a large backyard with pool equipment.',
      payment_terms: 'due_on_receipt',
      tax_exempt: false,
      total_jobs: 12,
      total_revenue: 4580,
      created_at: '2025-06-15'
    })

    setJobs([
      { id: '1', title: 'AC Maintenance', status: 'completed', scheduled_date: '2026-01-15', price: 150 },
      { id: '2', title: 'Furnace Repair', status: 'completed', scheduled_date: '2025-12-20', price: 320 },
      { id: '3', title: 'Duct Cleaning', status: 'scheduled', scheduled_date: '2026-02-10', price: 280 },
    ])

    setInvoices([
      { id: '1', number: 'INV-001', status: 'paid', date: '2026-01-15', total: 150 },
      { id: '2', number: 'INV-002', status: 'paid', date: '2025-12-20', total: 320 },
      { id: '3', number: 'INV-003', status: 'draft', date: '2026-02-10', total: 280 },
    ])

    setLoading(false)
  }, [params.id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      // TODO: API call to delete customer
      router.push('/customers')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
        <Link href="/customers" className="text-blue-600 hover:underline">
          Back to customers
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/customers"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {customer.type === 'commercial' ? (
                <Building className="text-blue-600" size={24} />
              ) : (
                <User className="text-blue-600" size={24} />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {customer.company_name || customer.name}
              </h1>
              <div className="flex items-center gap-2">
                {customer.company_name && (
                  <span className="text-gray-500">{customer.name}</span>
                )}
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/customers/${customer.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit size={18} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link
          href={`/jobs/new?customer=${customer.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          New Job
        </Link>
        <Link
          href={`/estimates/new?customer=${customer.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FileText size={18} />
          New Estimate
        </Link>
        <Link
          href={`/invoices/new?customer=${customer.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <DollarSign size={18} />
          New Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="space-y-3">
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                  <Phone size={18} className="text-gray-400" />
                  <span>{customer.phone}</span>
                </a>
              )}
              {customer.alt_phone && (
                <a href={`tel:${customer.alt_phone}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                  <Phone size={18} className="text-gray-400" />
                  <span>{customer.alt_phone} (alt)</span>
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                  <Mail size={18} className="text-gray-400" />
                  <span>{customer.email}</span>
                </a>
              )}
              {customer.address && (
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p>{customer.address}</p>
                    {customer.address2 && <p>{customer.address2}</p>}
                    <p>{customer.city}, {customer.state} {customer.zip}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Customer Stats</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase size={18} className="text-gray-400" />
                  <span>Total Jobs</span>
                </div>
                <span className="font-semibold text-gray-900">{customer.total_jobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={18} className="text-gray-400" />
                  <span>Total Revenue</span>
                </div>
                <span className="font-semibold text-gray-900">{formatCurrency(customer.total_revenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} className="text-gray-400" />
                  <span>Customer Since</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {new Date(customer.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {customer.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Tags</h2>
              
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Activity */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-100">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'jobs'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Jobs ({jobs.length})
                </button>
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'invoices'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Invoices ({invoices.length})
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Recent Jobs */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Recent Jobs</h3>
                      <button
                        onClick={() => setActiveTab('jobs')}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {jobs.slice(0, 3).map((job) => (
                        <Link
                          key={job.id}
                          href={`/jobs/${job.id}`}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-500">{job.scheduled_date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(job.price)}</p>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Recent Invoices */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Recent Invoices</h3>
                      <button
                        onClick={() => setActiveTab('invoices')}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {invoices.slice(0, 3).map((invoice) => (
                        <Link
                          key={invoice.id}
                          href={`/invoices/${invoice.id}`}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{invoice.number}</p>
                            <p className="text-sm text-gray-500">{invoice.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(invoice.total)}</p>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="space-y-2">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock size={14} />
                          {job.scheduled_date}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(job.price)}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-2">
                  {invoices.map((invoice) => (
                    <Link
                      key={invoice.id}
                      href={`/invoices/${invoice.id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{invoice.number}</p>
                        <p className="text-sm text-gray-500 mt-1">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(invoice.total)}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
