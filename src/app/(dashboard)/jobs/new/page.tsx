'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload,
  Calendar,
  Clock,
  User,
  MapPin
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Customer {
  id: string
  name: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface JobType {
  id: string
  name: string
  default_duration_hours: number
  default_price: number
  checklist_template: ChecklistItem[]
}

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [jobTypes, setJobTypes] = useState<JobType[]>([])
  
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    job_type: '',
    scheduled_date: '',
    scheduled_time: '09:00',
    duration_hours: 2,
    price: 0,
    priority: 'normal',
    notes: '',
    internal_notes: '',
    assigned_to: [] as string[],
    is_recurring: false,
    recurrence_pattern: '',
    checklist: [] as ChecklistItem[]
  })

  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone, address, city, state')
        .eq('status', 'active')
        .order('name')
      
      if (!error && data) {
        setCustomers(data)
      }
    }
    fetchCustomers()

    setJobTypes([
      { 
        id: '1', 
        name: 'Maintenance', 
        default_duration_hours: 1, 
        default_price: 150,
        checklist_template: [
          { id: '1', text: 'Inspect equipment', completed: false },
          { id: '2', text: 'Clean/replace filters', completed: false },
          { id: '3', text: 'Check operation', completed: false },
        ]
      },
      { 
        id: '2', 
        name: 'Repair', 
        default_duration_hours: 2, 
        default_price: 250,
        checklist_template: [
          { id: '1', text: 'Diagnose issue', completed: false },
          { id: '2', text: 'Get customer approval', completed: false },
          { id: '3', text: 'Complete repairs', completed: false },
          { id: '4', text: 'Test operation', completed: false },
        ]
      },
      { 
        id: '3', 
        name: 'Installation', 
        default_duration_hours: 4, 
        default_price: 4500,
        checklist_template: [
          { id: '1', text: 'Verify equipment received', completed: false },
          { id: '2', text: 'Check power requirements', completed: false },
          { id: '3', text: 'Install equipment', completed: false },
          { id: '4', text: 'Test operation', completed: false },
          { id: '5', text: 'Clean up work area', completed: false },
        ]
      },
      { 
        id: '4', 
        name: 'Inspection', 
        default_duration_hours: 1.5, 
        default_price: 89,
        checklist_template: [
          { id: '1', text: 'Visual inspection', completed: false },
          { id: '2', text: 'Safety check', completed: false },
          { id: '3', text: 'Document findings', completed: false },
        ]
      },
    ])
  }, [])

  const handleJobTypeChange = (jobTypeId: string) => {
    const jobType = jobTypes.find(jt => jt.id === jobTypeId)
    if (jobType) {
      setFormData({
        ...formData,
        job_type: jobTypeId,
        duration_hours: jobType.default_duration_hours,
        price: jobType.default_price,
        checklist: jobType.checklist_template.map(item => ({
          ...item,
          id: crypto.randomUUID()
        }))
      })
    }
  }

  const addChecklistItem = () => {
    setFormData({
      ...formData,
      checklist: [
        ...formData.checklist,
        { id: crypto.randomUUID(), text: '', completed: false }
      ]
    })
  }

  const updateChecklistItem = (id: string, text: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.map(item =>
        item.id === id ? { ...item, text } : item
      )
    })
  }

  const removeChecklistItem = (id: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter(item => item.id !== id)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: API call to create job
      console.log('Creating job:', formData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      router.push('/jobs')
    } catch (error) {
      console.error('Error creating job:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCustomer = customers.find(c => c.id === formData.customer_id)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/jobs"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Job</h1>
          <p className="text-gray-500">Schedule a new job for a customer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Customer *
              </label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}{customer.phone ? ` - ${customer.phone}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedCustomer && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                    {selectedCustomer.phone && <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>}
                    {selectedCustomer.address && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {selectedCustomer.address}{selectedCustomer.city ? `, ${selectedCustomer.city}` : ''}{selectedCustomer.state ? `, ${selectedCustomer.state}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/customers/new"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <Plus size={16} />
              Add new customer
            </Link>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AC Repair, Furnace Maintenance"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                value={formData.job_type}
                onChange={(e) => handleJobTypeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type...</option>
                {jobTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe the job..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  required
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="time"
                  required
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recurring */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_recurring}
                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">This is a recurring job</span>
            </label>

            {formData.is_recurring && (
              <div className="mt-3">
                <select
                  value={formData.recurrence_pattern}
                  onChange={(e) => setFormData({ ...formData, recurrence_pattern: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select frequency...</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
          
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Job Checklist</h2>
            <button
              type="button"
              onClick={addChecklistItem}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.checklist.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                No checklist items. Select a job type or add items manually.
              </p>
            ) : (
              formData.checklist.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                    placeholder="Checklist item..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Notes (visible on invoice)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Notes for the customer..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal Notes (team only)
              </label>
              <textarea
                value={formData.internal_notes}
                onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                rows={2}
                placeholder="Internal notes for your team..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/jobs"
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
