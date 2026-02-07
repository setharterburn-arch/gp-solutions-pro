'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  User,
  Calendar,
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

export default function EditEstimatePage() {
  const params = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  
  const [estimate, setEstimate] = useState({
    customer_id: '',
    customer_name: '',
    title: '',
    valid_until: '',
    notes: '',
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, total: 0 }
  ])

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch customers
        const { data: customersData } = await supabase
          .from('customers')
          .select('id, name, email, phone, address, city, state')
          .eq('status', 'active')
          .order('name')
        
        if (customersData) setCustomers(customersData)

        // Fetch estimate
        const { data: estimateData, error } = await supabase
          .from('estimates')
          .select(`
            *,
            customers (
              id,
              name
            )
          `)
          .eq('id', params.id)
          .single()

        if (error) throw error

        setEstimate({
          customer_id: estimateData.customer_id,
          customer_name: estimateData.customers?.name || '',
          title: estimateData.title || '',
          valid_until: estimateData.valid_until || '',
          notes: estimateData.notes || '',
        })

        if (estimateData.line_items && estimateData.line_items.length > 0) {
          setLineItems(estimateData.line_items)
        }
      } catch (error) {
        console.error('Error fetching estimate:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

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
  const tax = 0
  const total = subtotal + tax

  const handleSave = async () => {
    setSaving(true)
    
    if (!estimate.customer_id) {
      alert('Please select a customer')
      setSaving(false)
      return
    }

    if (!estimate.title) {
      alert('Please enter a title')
      setSaving(false)
      return
    }

    try {
      const { error } = await supabase
        .from('estimates')
        .update({
          customer_id: estimate.customer_id,
          title: estimate.title,
          line_items: lineItems.filter(item => item.description && item.total > 0),
          subtotal,
          tax_rate: 0,
          tax_amount: tax,
          total,
          valid_until: estimate.valid_until || null,
          notes: estimate.notes || null,
        })
        .eq('id', params.id)

      if (error) throw error
      
      router.push(`/estimates/${params.id}`)
    } catch (error) {
      console.error('Error saving estimate:', error)
      alert('Failed to save estimate. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/estimates/${params.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Estimate</h1>
            <p className="text-gray-500">Update estimate details</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Customer Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-gray-400" />
          Customer
        </h2>
        
        <select
          value={estimate.customer_id}
          onChange={(e) => {
            const customer = customers.find(c => c.id === e.target.value)
            setEstimate({
              ...estimate,
              customer_id: e.target.value,
              customer_name: customer?.name || ''
            })
          }}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a customer...</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}{customer.phone ? ` - ${customer.phone}` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Estimate Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Estimate Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title / Project Name
            </label>
            <input
              type="text"
              value={estimate.title}
              onChange={(e) => setEstimate({ ...estimate, title: e.target.value })}
              placeholder="e.g., HVAC Installation - Main Building"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="inline mr-1" />
              Valid Until
            </label>
            <input
              type="date"
              value={estimate.valid_until}
              onChange={(e) => setEstimate({ ...estimate, valid_until: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign size={20} className="text-gray-400" />
            Line Items
          </h2>
          <button
            onClick={addLineItem}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

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
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2 text-right font-medium text-gray-900 pr-2">
                {formatCurrency(item.total)}
              </div>
              <div className="col-span-1 text-center">
                <button
                  onClick={() => removeLineItem(item.id)}
                  disabled={lineItems.length === 1}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes & Terms</h2>
        <textarea
          value={estimate.notes}
          onChange={(e) => setEstimate({ ...estimate, notes: e.target.value })}
          rows={4}
          placeholder="Add any notes or terms..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-4">
        <Link
          href={`/estimates/${params.id}`}
          className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
