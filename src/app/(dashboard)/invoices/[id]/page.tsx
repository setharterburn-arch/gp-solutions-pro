'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit,
  Send,
  Download,
  Printer,
  DollarSign,
  Calendar,
  User,
  Mail,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatDate } from '@/lib/utils'

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Invoice {
  id: string
  number: string
  status: string
  customer_name: string
  customer_email: string
  customer_address: string
  date: string
  due_date: string
  items: LineItem[]
  subtotal: number
  tax: number
  total: number
  notes: string
  paid_amount: number
  paid_date: string | null
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setInvoice({
      id: params.id as string,
      number: 'INV-001',
      status: 'sent',
      customer_name: 'John Smith',
      customer_email: 'john@example.com',
      customer_address: '123 Main St, Springfield, IL 62701',
      date: '2026-02-01',
      due_date: '2026-02-15',
      items: [
        { id: '1', description: 'AC Maintenance Service', quantity: 1, rate: 150, amount: 150 },
        { id: '2', description: 'Air Filter Replacement', quantity: 2, rate: 25, amount: 50 },
      ],
      subtotal: 200,
      tax: 16,
      total: 216,
      notes: 'Thank you for your business!',
      paid_amount: 0,
      paid_date: null
    })
    setLoading(false)
  }, [params.id])

  const markAsPaid = () => {
    if (!invoice) return
    setInvoice({
      ...invoice,
      status: 'paid',
      paid_amount: invoice.total,
      paid_date: new Date().toISOString().split('T')[0]
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!invoice) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/invoices" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice {invoice.number}</h1>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/invoices/${invoice.id}/edit`}
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
          {invoice.status === 'draft' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Send size={18} />
              Send Invoice
            </button>
          )}
          {invoice.status === 'sent' && (
            <button
              onClick={markAsPaid}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle size={18} />
              Mark as Paid
            </button>
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

      {/* Invoice Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">GP Solutions</h2>
            <p className="text-gray-500">Your Business Address</p>
            <p className="text-gray-500">City, State ZIP</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">INVOICE</p>
            <p className="text-gray-500">{invoice.number}</p>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">BILL TO</p>
            <p className="font-medium text-gray-900">{invoice.customer_name}</p>
            <p className="text-gray-600">{invoice.customer_email}</p>
            <p className="text-gray-600">{invoice.customer_address}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-500">INVOICE DATE</p>
              <p className="text-gray-900">{formatDate(invoice.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">DUE DATE</p>
              <p className="text-gray-900">{formatDate(invoice.due_date)}</p>
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
            {invoice.items.map((item) => (
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
              <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="text-gray-900">{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between py-3 border-t border-gray-200 font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(invoice.total)}</span>
            </div>
            {invoice.status === 'paid' && (
              <div className="flex justify-between py-2 text-green-600">
                <span>Paid</span>
                <span>{formatCurrency(invoice.paid_amount)}</span>
              </div>
            )}
            {invoice.status !== 'paid' && (
              <div className="flex justify-between py-2 font-bold text-blue-600">
                <span>Amount Due</span>
                <span>{formatCurrency(invoice.total - invoice.paid_amount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">NOTES</p>
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
