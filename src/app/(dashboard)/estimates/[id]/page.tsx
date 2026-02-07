'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit,
  Send,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatDate } from '@/lib/utils'

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Estimate {
  id: string
  number: string
  status: string
  customer_name: string
  customer_email: string
  customer_address: string
  date: string
  valid_until: string
  items: LineItem[]
  subtotal: number
  tax: number
  total: number
  notes: string
}

export default function EstimateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setEstimate({
      id: params.id as string,
      number: 'EST-001',
      status: 'sent',
      customer_name: 'John Smith',
      customer_email: 'john@example.com',
      customer_address: '123 Main St, Springfield, IL 62701',
      date: '2026-02-01',
      valid_until: '2026-03-01',
      items: [
        { id: '1', description: 'HVAC System Installation', quantity: 1, rate: 4500, amount: 4500 },
        { id: '2', description: 'Ductwork Modification', quantity: 1, rate: 800, amount: 800 },
        { id: '3', description: 'Permit & Inspection Fees', quantity: 1, rate: 200, amount: 200 },
      ],
      subtotal: 5500,
      tax: 440,
      total: 5940,
      notes: 'Installation includes 2-year warranty on labor. Equipment warranty handled by manufacturer.'
    })
    setLoading(false)
  }, [params.id])

  const updateStatus = (newStatus: string) => {
    if (!estimate) return
    setEstimate({ ...estimate, status: newStatus })
  }

  const convertToJob = () => {
    if (!estimate) return
    router.push(`/jobs/new?estimate=${estimate.id}`)
  }

  const convertToInvoice = () => {
    if (!estimate) return
    router.push(`/invoices/new?estimate=${estimate.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!estimate) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/estimates" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estimate {estimate.number}</h1>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(estimate.status)}`}>
              {estimate.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/estimates/${estimate.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Edit size={18} />
            Edit
          </Link>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {estimate.status === 'draft' && (
            <button
              onClick={() => updateStatus('sent')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send size={18} />
              Send Estimate
            </button>
          )}
          {estimate.status === 'sent' && (
            <>
              <button
                onClick={() => updateStatus('accepted')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle size={18} />
                Mark Accepted
              </button>
              <button
                onClick={() => updateStatus('declined')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <XCircle size={18} />
                Mark Declined
              </button>
            </>
          )}
          {estimate.status === 'accepted' && (
            <>
              <button
                onClick={convertToJob}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FileText size={18} />
                Convert to Job
              </button>
              <button
                onClick={convertToInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FileText size={18} />
                Convert to Invoice
              </button>
            </>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download size={18} />
            Download PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Estimate Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">GP Solutions</h2>
            <p className="text-gray-500">Your Business Address</p>
            <p className="text-gray-500">City, State ZIP</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">ESTIMATE</p>
            <p className="text-gray-500">{estimate.number}</p>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">PREPARED FOR</p>
            <p className="font-medium text-gray-900">{estimate.customer_name}</p>
            <p className="text-gray-600">{estimate.customer_email}</p>
            <p className="text-gray-600">{estimate.customer_address}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-500">DATE</p>
              <p className="text-gray-900">{formatDate(estimate.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">VALID UNTIL</p>
              <p className="text-gray-900">{formatDate(estimate.valid_until)}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">DESCRIPTION</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">QTY</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">RATE</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {estimate.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4 text-gray-900">{item.description}</td>
                <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                <td className="py-4 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                <td className="py-4 text-right text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatCurrency(estimate.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="text-gray-900">{formatCurrency(estimate.tax)}</span>
            </div>
            <div className="flex justify-between py-3 border-t border-gray-200 font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(estimate.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {estimate.notes && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">NOTES & TERMS</p>
            <p className="text-gray-600">{estimate.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
