'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  FileText,
  Loader2
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price?: number
  rate?: number
  total?: number
  amount?: number
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
  const [generating, setGenerating] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchEstimate() {
      try {
        const { data, error } = await supabase
          .from('estimates')
          .select(`
            *,
            customers (
              name,
              email,
              address,
              city,
              state,
              zip
            )
          `)
          .eq('id', params.id)
          .single()

        if (error) throw error

        const customer = data.customers
        const customerAddress = [customer?.address, customer?.city, customer?.state, customer?.zip].filter(Boolean).join(', ')

        setEstimate({
          id: data.id,
          number: `EST-${data.id.slice(0, 8).toUpperCase()}`,
          status: data.status,
          customer_name: customer?.name || 'Unknown',
          customer_email: customer?.email || '',
          customer_address: customerAddress,
          date: data.created_at,
          valid_until: data.valid_until,
          items: data.line_items || [],
          subtotal: data.subtotal,
          tax: data.tax_amount,
          total: data.total,
          notes: data.notes || ''
        })
      } catch (error) {
        console.error('Error fetching estimate:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEstimate()
  }, [params.id])

  const updateStatus = async (newStatus: string) => {
    if (!estimate) return
    
    try {
      const { error } = await supabase
        .from('estimates')
        .update({ status: newStatus })
        .eq('id', estimate.id)

      if (error) throw error
      setEstimate({ ...estimate, status: newStatus })
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const downloadPDF = async () => {
    if (!printRef.current || !estimate) return
    
    setGenerating(true)
    
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`Estimate-${estimate.number}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
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

  if (!estimate) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Estimate not found</p>
        <Link href="/estimates" className="text-blue-600 hover:underline">Back to estimates</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between print:hidden">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 print:hidden">
        <div className="flex flex-wrap gap-2">
          {estimate.status === 'draft' && (
            <button
              onClick={() => updateStatus('sent')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <CheckCircle size={18} />
              Mark as Sent
            </button>
          )}
          {estimate.status === 'sent' && (
            <>
              <button
                onClick={() => updateStatus('approved')}
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
          {estimate.status === 'approved' && (
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
          <button 
            onClick={downloadPDF}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {generating ? 'Generating...' : 'Download PDF'}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Estimate Preview */}
      <div ref={printRef} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none">
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
            {estimate.customer_email && <p className="text-gray-600">{estimate.customer_email}</p>}
            {estimate.customer_address && <p className="text-gray-600">{estimate.customer_address}</p>}
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-500">DATE</p>
              <p className="text-gray-900">{formatDate(estimate.date)}</p>
            </div>
            {estimate.valid_until && (
              <div>
                <p className="text-sm font-medium text-gray-500">VALID UNTIL</p>
                <p className="text-gray-900">{formatDate(estimate.valid_until)}</p>
              </div>
            )}
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
            {estimate.items.map((item, index) => (
              <tr key={item.id || index} className="border-b border-gray-100">
                <td className="py-4 text-gray-900">{item.description}</td>
                <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                <td className="py-4 text-right text-gray-600">{formatCurrency(item.unit_price || item.rate)}</td>
                <td className="py-4 text-right text-gray-900">{formatCurrency(item.total || item.amount)}</td>
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
            {estimate.tax > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(estimate.tax)}</span>
              </div>
            )}
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
            <p className="text-gray-600 whitespace-pre-wrap">{estimate.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
