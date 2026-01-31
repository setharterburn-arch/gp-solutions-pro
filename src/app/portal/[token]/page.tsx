'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { 
  FileText, 
  Receipt, 
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  CreditCard,
  Download,
  Phone,
  Mail,
  Building
} from 'lucide-react'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'

interface CustomerPortalData {
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  company: {
    name: string
    phone: string
    email: string
  }
  estimates: Array<{
    id: string
    title: string
    total: number
    status: string
    created_at: string
    valid_until: string
  }>
  jobs: Array<{
    id: string
    title: string
    scheduled_date: string
    scheduled_time: string
    status: string
    price: number
  }>
  invoices: Array<{
    id: string
    invoice_number: string
    total: number
    amount_paid: number
    status: string
    due_date: string
  }>
}

export default function CustomerPortal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [data, setData] = useState<CustomerPortalData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'estimates' | 'jobs' | 'invoices'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API call using token
    setTimeout(() => {
      setData({
        customer: {
          name: 'John Smith',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          address: '123 Main St, Springfield, IL 62701'
        },
        company: {
          name: 'GP Solutions',
          phone: '(555) 987-6543',
          email: 'info@gpsolutions.com'
        },
        estimates: [
          {
            id: '1',
            title: 'HVAC System Replacement',
            total: 8500,
            status: 'sent',
            created_at: '2026-01-25',
            valid_until: '2026-02-15'
          }
        ],
        jobs: [
          {
            id: '1',
            title: 'AC Maintenance',
            scheduled_date: '2026-02-05',
            scheduled_time: '09:00',
            status: 'scheduled',
            price: 150
          },
          {
            id: '2',
            title: 'Furnace Repair',
            scheduled_date: '2026-01-20',
            scheduled_time: '14:00',
            status: 'completed',
            price: 350
          }
        ],
        invoices: [
          {
            id: '1',
            invoice_number: 'INV-2601-0001',
            total: 350,
            amount_paid: 0,
            status: 'sent',
            due_date: '2026-02-15'
          }
        ]
      })
      setLoading(false)
    }, 500)
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-500">This portal link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  const pendingEstimates = data.estimates.filter(e => e.status === 'sent')
  const upcomingJobs = data.jobs.filter(j => j.status === 'scheduled')
  const outstandingInvoices = data.invoices.filter(i => ['sent', 'viewed', 'overdue'].includes(i.status))
  const totalOutstanding = outstandingInvoices.reduce((sum, i) => sum + (i.total - i.amount_paid), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                GP
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{data.company.name}</h1>
                <p className="text-sm text-gray-500">Customer Portal</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium text-gray-900">{data.customer.name}</p>
              <p className="text-gray-500">{data.customer.email}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Estimates</p>
                <p className="text-xl font-bold text-gray-900">{pendingEstimates.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Jobs</p>
                <p className="text-xl font-bold text-gray-900">{upcomingJobs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Receipt className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Outstanding Balance</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {(['overview', 'estimates', 'jobs', 'invoices'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 lg:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Pending Estimates */}
                {pendingEstimates.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Estimates Awaiting Approval</h3>
                    <div className="space-y-3">
                      {pendingEstimates.map((estimate) => (
                        <div key={estimate.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{estimate.title}</p>
                            <p className="text-sm text-gray-500">Valid until {formatDate(estimate.valid_until)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-gray-900">{formatCurrency(estimate.total)}</p>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outstanding Invoices */}
                {outstandingInvoices.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Invoices Due</h3>
                    <div className="space-y-3">
                      {outstandingInvoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{invoice.invoice_number}</p>
                            <p className="text-sm text-gray-500">Due {formatDate(invoice.due_date)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-gray-900">{formatCurrency(invoice.total - invoice.amount_paid)}</p>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              <CreditCard size={16} />
                              Pay Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Jobs */}
                {upcomingJobs.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Upcoming Appointments</h3>
                    <div className="space-y-3">
                      {upcomingJobs.map((job) => (
                        <div key={job.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="text-blue-600" size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(job.scheduled_date)} at {job.scheduled_time}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingEstimates.length === 0 && outstandingInvoices.length === 0 && upcomingJobs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="mx-auto mb-2 text-green-500" size={40} />
                    <p className="font-medium text-gray-900">You're all caught up!</p>
                    <p className="text-sm">No pending items at this time.</p>
                  </div>
                )}
              </div>
            )}

            {/* Estimates Tab */}
            {activeTab === 'estimates' && (
              <div className="space-y-3">
                {data.estimates.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No estimates yet</p>
                ) : (
                  data.estimates.map((estimate) => (
                    <div key={estimate.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{estimate.title}</p>
                        <p className="text-sm text-gray-500">Created {formatDate(estimate.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(estimate.status)}`}>
                          {estimate.status}
                        </span>
                        <p className="font-bold text-gray-900">{formatCurrency(estimate.total)}</p>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-3">
                {data.jobs.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No jobs yet</p>
                ) : (
                  data.jobs.map((job) => (
                    <div key={job.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-lg ${job.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'}`}>
                        {job.status === 'completed' ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <Clock className="text-blue-600" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(job.scheduled_date)} at {job.scheduled_time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      <p className="font-bold text-gray-900">{formatCurrency(job.price)}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="space-y-3">
                {data.invoices.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No invoices yet</p>
                ) : (
                  data.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoice_number}</p>
                        <p className="text-sm text-gray-500">Due {formatDate(invoice.due_date)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                        <p className="font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Download size={18} />
                        </button>
                        {invoice.status !== 'paid' && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <CreditCard size={16} />
                            Pay
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href={`tel:${data.company.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone className="text-gray-600" size={20} />
              <span className="text-gray-900">{data.company.phone}</span>
            </a>
            <a href={`mailto:${data.company.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Mail className="text-gray-600" size={20} />
              <span className="text-gray-900">{data.company.email}</span>
            </a>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building className="text-gray-600" size={20} />
              <span className="text-gray-900">{data.company.name}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
