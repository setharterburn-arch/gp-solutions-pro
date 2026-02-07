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
  const [companyInfo, setCompanyInfo] = useState({
    name: 'GP Solutions',
    address: ''
  })
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch settings
        const { data: settingsData } = await supabase
          .from('settings')
          .select('company_name, company_address')
          .single()
        
        if (settingsData) {
          setCompanyInfo({
            name: settingsData.company_name || 'GP Solutions',
            address: settingsData.company_address || ''
          })
        }

        // Fetch estimate
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

    fetchData()
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
    if (!estimate) return
    
    setGenerating(true)
    
    try {
      const jspdfModule = await import('jspdf')
      const jsPDF = jspdfModule.default

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      let y = 20

      // Company Header
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(companyInfo.name, 20, y)
      y += 7
      
      if (companyInfo.address) {
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text(companyInfo.address, 20, y)
        y += 5
      }

      // ESTIMATE title on right
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('ESTIMATE', pageWidth - 20, 20, { align: 'right' })
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(estimate.number, pageWidth - 20, 27, { align: 'right' })

      y = Math.max(y, 40)

      // Divider line
      pdf.setDrawColor(200)
      pdf.line(20, y, pageWidth - 20, y)
      y += 10

      // Customer info
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.text('PREPARED FOR', 20, y)
      pdf.text('DATE', pageWidth - 60, y)
      y += 5
      
      pdf.setFont('helvetica', 'normal')
      pdf.text(estimate.customer_name, 20, y)
      pdf.text(formatDate(estimate.date), pageWidth - 60, y)
      y += 5
      
      if (estimate.customer_address) {
        pdf.text(estimate.customer_address, 20, y)
      }
      if (estimate.valid_until) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('VALID UNTIL', pageWidth - 60, y)
        y += 5
        pdf.setFont('helvetica', 'normal')
        pdf.text(formatDate(estimate.valid_until), pageWidth - 60, y)
      }
      y += 15

      // Table header
      pdf.setFillColor(245, 245, 245)
      pdf.rect(20, y - 3, pageWidth - 40, 8, 'F')
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      pdf.text('DESCRIPTION', 22, y + 2)
      pdf.text('QTY', pageWidth - 80, y + 2, { align: 'right' })
      pdf.text('RATE', pageWidth - 50, y + 2, { align: 'right' })
      pdf.text('AMOUNT', pageWidth - 22, y + 2, { align: 'right' })
      y += 10

      // Line items
      pdf.setFont('helvetica', 'normal')
      estimate.items.forEach((item) => {
        pdf.text(item.description || '', 22, y)
        pdf.text(String(item.quantity || 1), pageWidth - 80, y, { align: 'right' })
        pdf.text(formatCurrency(item.unit_price || item.rate || 0), pageWidth - 50, y, { align: 'right' })
        pdf.text(formatCurrency(item.total || item.amount || 0), pageWidth - 22, y, { align: 'right' })
        y += 7
      })

      y += 5
      pdf.line(20, y, pageWidth - 20, y)
      y += 10

      // Totals
      pdf.text('Subtotal', pageWidth - 60, y)
      pdf.text(formatCurrency(estimate.subtotal), pageWidth - 22, y, { align: 'right' })
      y += 7

      if (estimate.tax > 0) {
        pdf.text('Tax', pageWidth - 60, y)
        pdf.text(formatCurrency(estimate.tax), pageWidth - 22, y, { align: 'right' })
        y += 7
      }

      pdf.setFont('helvetica', 'bold')
      pdf.text('Total', pageWidth - 60, y)
      pdf.text(formatCurrency(estimate.total), pageWidth - 22, y, { align: 'right' })

      // Notes
      if (estimate.notes) {
        y += 20
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(9)
        pdf.text('NOTES & TERMS', 20, y)
        y += 5
        pdf.setFont('helvetica', 'normal')
        const noteLines = pdf.splitTextToSize(estimate.notes, pageWidth - 40)
        pdf.text(noteLines, 20, y)
      }

      pdf.save(`Estimate-${estimate.number}.pdf`)
    } catch (error: any) {
      console.error('Error generating PDF:', error)
      alert('PDF generation failed. Please use Print instead.')
      window.print()
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
            <h2 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h2>
            {companyInfo.address && <p className="text-gray-500">{companyInfo.address}</p>}
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
                <td className="py-4 text-right text-gray-600">{formatCurrency(item.unit_price || item.rate || 0)}</td>
                <td className="py-4 text-right text-gray-900">{formatCurrency(item.total || item.amount || 0)}</td>
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
