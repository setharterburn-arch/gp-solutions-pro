'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit,
  Download,
  Printer,
  DollarSign,
  CheckCircle,
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
  amount_paid: number
  notes: string
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
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

        // Fetch invoice
        const { data, error } = await supabase
          .from('invoices')
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

        setInvoice({
          id: data.id,
          number: data.invoice_number,
          status: data.status,
          customer_name: customer?.name || 'Unknown',
          customer_email: customer?.email || '',
          customer_address: customerAddress,
          date: data.created_at,
          due_date: data.due_date,
          items: data.line_items || [],
          subtotal: data.subtotal,
          tax: data.tax_amount,
          total: data.total,
          amount_paid: data.amount_paid || 0,
          notes: data.notes || ''
        })
      } catch (error) {
        console.error('Error fetching invoice:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const markAsPaid = async () => {
    if (!invoice) return
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          amount_paid: invoice.total,
          paid_at: new Date().toISOString()
        })
        .eq('id', invoice.id)

      if (error) throw error
      setInvoice({
        ...invoice,
        status: 'paid',
        amount_paid: invoice.total
      })
    } catch (error) {
      console.error('Error updating invoice:', error)
    }
  }

  const downloadPDF = async () => {
    if (!printRef.current || !invoice) return
    
    setGenerating(true)
    
    try {
      // Dynamic imports
      const [html2canvasModule, jspdfModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])
      
      const html2canvas = html2canvasModule.default
      const jsPDF = jspdfModule.default

      // Wait a tick for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        foreignObjectRendering: false
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`Invoice-${invoice.number}.pdf`)
    } catch (error: any) {
      console.error('Error generating PDF:', error)
      // Fallback to print
      alert('PDF generation failed. Opening print dialog instead.')
      window.print()
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Invoice not found</p>
        <Link href="/invoices" className="text-blue-600 hover:underline">Back to invoices</Link>
      </div>
    )
  }

  const amountDue = invoice.total - invoice.amount_paid

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between print:hidden">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 print:hidden">
        <div className="flex flex-wrap gap-2">
          {invoice.status !== 'paid' && (
            <button
              onClick={markAsPaid}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle size={18} />
              Mark as Paid
            </button>
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

      {/* Invoice Preview */}
      <div ref={printRef} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h2>
            {companyInfo.address && <p className="text-gray-500">{companyInfo.address}</p>}
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
            {invoice.customer_email && <p className="text-gray-600">{invoice.customer_email}</p>}
            {invoice.customer_address && <p className="text-gray-600">{invoice.customer_address}</p>}
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-500">INVOICE DATE</p>
              <p className="text-gray-900">{formatDate(invoice.date)}</p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-sm font-medium text-gray-500">DUE DATE</p>
                <p className="text-gray-900">{formatDate(invoice.due_date)}</p>
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
            {invoice.items.map((item, index) => (
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
              <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(invoice.tax)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t border-gray-200 font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(invoice.total)}</span>
            </div>
            {invoice.amount_paid > 0 && (
              <div className="flex justify-between py-2 text-green-600">
                <span>Paid</span>
                <span>{formatCurrency(invoice.amount_paid)}</span>
              </div>
            )}
            {amountDue > 0 && (
              <div className="flex justify-between py-2 font-bold text-blue-600">
                <span>Amount Due</span>
                <span>{formatCurrency(amountDue)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">NOTES</p>
            <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
