'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Send,
  User,
  Calendar,
  FileText,
  DollarSign
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  total: number
}

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  
  const [invoice, setInvoice] = useState({
    customer_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    job_id: '',
    job_title: '',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    notes: '',
    terms: 'Payment due within 30 days of invoice date.',
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, total: 0 }
  ])

  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email, phone, address, city, state')
        .eq('status', 'active')
        .order('name')
      
      if (!error && data) {
        setCustomers(data)
      }
    }
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase()))
  )

  const selectCustomer = (customer: Customer) => {
    const fullAddress = [customer.address, customer.city, customer.state].filter(Boolean).join(', ')
    setInvoice({
      ...invoice,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_email: customer.email || '',
      customer_phone: customer.phone || '',
      customer_address: fullAddress,
    })
    setShowCustomerSearch(false)
    setCustomerSearch('')
  }

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: '', quantity: 1, rate: 0, total: 0 }
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updated.total = updated.quantity * updated.rate
        }
        return updated
      }
      return item
    }))
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const tax = 0 // Can add tax calculation
  const total = subtotal + tax

  const handleSave = async (send: boolean = false) => {
    setSaving(true)
    
    // Validate
    if (!invoice.customer_name) {
      alert('Please select a customer')
      setSaving(false)
      return
    }

    if (lineItems.every(item => !item.description || item.total === 0)) {
      alert('Please add at least one line item')
      setSaving(false)
      return
    }

    const invoiceData = {
      ...invoice,
      line_items: lineItems.filter(item => item.description && item.total > 0),
      subtotal,
      tax,
      total,
      status: send ? 'sent' : 'draft',
      sent_at: send ? new Date().toISOString() : null,
    }

    try {
      // Generate invoice number
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
      
      const invoiceNumber = `INV-${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${((count || 0) + 1).toString().padStart(4, '0')}`

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          customer_id: invoice.customer_id,
          job_id: invoice.job_id || null,
          invoice_number: invoiceNumber,
          line_items: lineItems.filter(item => item.description && item.total > 0),
          subtotal,
          tax_rate: 0,
          tax_amount: tax,
          total,
          amount_paid: 0,
          status: send ? 'sent' : 'draft',
          due_date: invoice.due_date || null,
          notes: invoice.notes || null,
          sent_at: send ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (error) throw error
      
      router.push('/invoices')
    } catch (error) {
      console.error('Error saving invoice:', error)
      alert('Failed to save invoice. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/invoices" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
            <p className="text-gray-500">Create and send an invoice</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
            {saving ? 'Saving...' : 'Save & Send'}
          </button>
        </div>
      </div>

      {/* Customer Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-gray-400" />
          Customer
        </h2>
        
        {invoice.customer_name ? (
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{invoice.customer_name}</p>
              <p className="text-sm text-gray-500">{invoice.customer_email}</p>
              <p className="text-sm text-gray-500">{invoice.customer_phone}</p>
              <p className="text-sm text-gray-500">{invoice.customer_address}</p>
            </div>
            <button
              onClick={() => setInvoice({ ...invoice, customer_id: '', customer_name: '', customer_email: '', customer_phone: '', customer_address: '' })}
              className="text-sm text-blue-600 hover:underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value)
                setShowCustomerSearch(true)
              }}
              onFocus={() => setShowCustomerSearch(true)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {showCustomerSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredCustomers.map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => selectCustomer(customer)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </button>
                ))}
                {filteredCustomers.length === 0 && (
                  <p className="px-4 py-2 text-gray-500">No customers found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-gray-400" />
          Invoice Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={invoice.due_date}
              onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Reference (Optional)</label>
            <input
              type="text"
              value={invoice.job_title}
              onChange={(e) => setInvoice({ ...invoice, job_title: e.target.value })}
              placeholder="e.g., HVAC Installation"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={20} className="text-gray-400" />
          Line Items
        </h2>

        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 px-2">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-center">Rate</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>

          {/* Items */}
          {lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  placeholder="Service or product description"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="col-span-2 text-right font-medium text-gray-900">
                {formatCurrency(item.total)}
              </div>
              <div className="col-span-1 text-center">
                <button
                  onClick={() => removeLineItem(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  disabled={lineItems.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          <button
            onClick={addLineItem}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Line Item
          </button>
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (visible to customer)</label>
            <textarea
              value={invoice.notes}
              onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
              rows={3}
              placeholder="Thank you for your business!"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms</label>
            <textarea
              value={invoice.terms}
              onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
