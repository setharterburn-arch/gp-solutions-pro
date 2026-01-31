'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  CheckSquare,
  Square,
  Receipt,
  Send,
  FileText
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

interface CompletedJob {
  id: string
  title: string
  customer_id: string
  customer_name: string
  customer_email: string
  completed_date: string
  price: number
  invoice_sent: boolean
}

export default function BatchInvoicingPage() {
  const [jobs, setJobs] = useState<CompletedJob[]>([])
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Mock data - completed jobs without invoices
    setJobs([
      {
        id: '1',
        title: 'AC Maintenance',
        customer_id: 'c1',
        customer_name: 'John Smith',
        customer_email: 'john@example.com',
        completed_date: '2026-01-28',
        price: 150,
        invoice_sent: false
      },
      {
        id: '2',
        title: 'Furnace Repair',
        customer_id: 'c2',
        customer_name: 'Jane Doe',
        customer_email: 'jane@example.com',
        completed_date: '2026-01-27',
        price: 350,
        invoice_sent: false
      },
      {
        id: '3',
        title: 'Duct Cleaning',
        customer_id: 'c3',
        customer_name: 'Bob Wilson',
        customer_email: 'bob@example.com',
        completed_date: '2026-01-26',
        price: 275,
        invoice_sent: false
      },
      {
        id: '4',
        title: 'HVAC Inspection',
        customer_id: 'c1',
        customer_name: 'John Smith',
        customer_email: 'john@example.com',
        completed_date: '2026-01-25',
        price: 89,
        invoice_sent: false
      },
      {
        id: '5',
        title: 'Filter Replacement',
        customer_id: 'c4',
        customer_name: 'Alice Brown',
        customer_email: 'alice@example.com',
        completed_date: '2026-01-24',
        price: 65,
        invoice_sent: false
      },
    ])
  }, [])

  const toggleJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs)
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId)
    } else {
      newSelected.add(jobId)
    }
    setSelectedJobs(newSelected)
  }

  const toggleAll = () => {
    if (selectedJobs.size === jobs.length) {
      setSelectedJobs(new Set())
    } else {
      setSelectedJobs(new Set(jobs.map(j => j.id)))
    }
  }

  const selectedTotal = jobs
    .filter(j => selectedJobs.has(j.id))
    .reduce((sum, j) => sum + j.price, 0)

  // Group by customer
  const groupByCustomer = jobs
    .filter(j => selectedJobs.has(j.id))
    .reduce((groups, job) => {
      const key = job.customer_id
      if (!groups[key]) {
        groups[key] = {
          customer_name: job.customer_name,
          customer_email: job.customer_email,
          jobs: []
        }
      }
      groups[key].jobs.push(job)
      return groups
    }, {} as Record<string, { customer_name: string; customer_email: string; jobs: CompletedJob[] }>)

  const invoiceCount = Object.keys(groupByCustomer).length

  const handleCreateInvoices = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mark jobs as invoiced
    setJobs(jobs.map(j => 
      selectedJobs.has(j.id) ? { ...j, invoice_sent: true } : j
    ))
    setSelectedJobs(new Set())
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const uninvoicedJobs = jobs.filter(j => !j.invoice_sent)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/invoices"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Invoicing</h1>
          <p className="text-gray-500">Create invoices for multiple completed jobs at once</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✓ {invoiceCount} invoice(s) created and sent successfully!
        </div>
      )}

      {uninvoicedJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Receipt className="mx-auto mb-4 text-gray-300" size={48} />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h2>
          <p className="text-gray-500">No completed jobs waiting for invoices.</p>
        </div>
      ) : (
        <>
          {/* Selection Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {selectedJobs.size === uninvoicedJobs.length ? (
                    <CheckSquare className="text-blue-600" size={20} />
                  ) : (
                    <Square className="text-gray-400" size={20} />
                  )}
                  Select All
                </button>
                <span className="text-sm text-gray-500">
                  {selectedJobs.size} of {uninvoicedJobs.length} jobs selected
                </span>
              </div>
              
              {selectedJobs.size > 0 && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {invoiceCount} invoice{invoiceCount !== 1 ? 's' : ''} will be created
                    </p>
                    <p className="font-bold text-gray-900">Total: {formatCurrency(selectedTotal)}</p>
                  </div>
                  <button
                    onClick={handleCreateInvoices}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                    {loading ? 'Creating...' : 'Create & Send Invoices'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Jobs List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left w-12"></th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Job</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Completed</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {uninvoicedJobs.map((job) => (
                    <tr 
                      key={job.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedJobs.has(job.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => toggleJob(job.id)}
                    >
                      <td className="px-4 py-4">
                        {selectedJobs.has(job.id) ? (
                          <CheckSquare className="text-blue-600" size={20} />
                        ) : (
                          <Square className="text-gray-300" size={20} />
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{job.title}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-gray-900">{job.customer_name}</p>
                        <p className="text-sm text-gray-500">{job.customer_email}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(job.completed_date)}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        {formatCurrency(job.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preview */}
          {selectedJobs.size > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Invoice Preview ({invoiceCount} invoice{invoiceCount !== 1 ? 's' : ''})
              </h3>
              
              <div className="space-y-4">
                {Object.entries(groupByCustomer).map(([customerId, data]) => {
                  const customerTotal = data.jobs.reduce((sum, j) => sum + j.price, 0)
                  return (
                    <div key={customerId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{data.customer_name}</p>
                          <p className="text-sm text-gray-500">{data.customer_email}</p>
                        </div>
                        <p className="font-bold text-gray-900">{formatCurrency(customerTotal)}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {data.jobs.map(j => (
                          <div key={j.id} className="flex justify-between py-1">
                            <span>{j.title}</span>
                            <span>{formatCurrency(j.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
