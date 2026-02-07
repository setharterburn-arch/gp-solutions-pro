'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit,
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  DollarSign,
  CheckSquare,
  FileText,
  Play,
  Pause,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatDate } from '@/lib/utils'

interface Job {
  id: string
  title: string
  description: string
  customer_name: string
  customer_phone: string
  customer_address: string
  status: string
  priority: string
  scheduled_date: string
  scheduled_time: string
  duration_hours: number
  price: number
  notes: string
  checklist: { id: string; text: string; completed: boolean }[]
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setJob({
      id: params.id as string,
      title: 'AC Maintenance',
      description: 'Annual maintenance and filter replacement for central AC unit.',
      customer_name: 'John Smith',
      customer_phone: '(555) 123-4567',
      customer_address: '123 Main St, Springfield, IL 62701',
      status: 'scheduled',
      priority: 'normal',
      scheduled_date: '2026-02-10',
      scheduled_time: '09:00',
      duration_hours: 2,
      price: 150,
      notes: 'Customer prefers morning appointments. Has a dog - call before arriving.',
      checklist: [
        { id: '1', text: 'Inspect equipment', completed: false },
        { id: '2', text: 'Clean/replace filters', completed: false },
        { id: '3', text: 'Check refrigerant levels', completed: false },
        { id: '4', text: 'Test operation', completed: false },
      ]
    })
    setLoading(false)
  }, [params.id])

  const toggleChecklist = (itemId: string) => {
    if (!job) return
    setJob({
      ...job,
      checklist: job.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    })
  }

  const updateStatus = (newStatus: string) => {
    if (!job) return
    setJob({ ...job, status: newStatus })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!job) return null

  const completedItems = job.checklist.filter(item => item.completed).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                job.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                job.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {job.priority} priority
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/jobs/${job.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Edit size={18} />
          Edit
        </Link>
      </div>

      {/* Status Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {job.status === 'scheduled' && (
            <button
              onClick={() => updateStatus('in_progress')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Play size={18} />
              Start Job
            </button>
          )}
          {job.status === 'in_progress' && (
            <>
              <button
                onClick={() => updateStatus('completed')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle size={18} />
                Complete
              </button>
              <button
                onClick={() => updateStatus('on_hold')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                <Pause size={18} />
                Put on Hold
              </button>
            </>
          )}
          {job.status === 'on_hold' && (
            <button
              onClick={() => updateStatus('in_progress')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Play size={18} />
              Resume
            </button>
          )}
          {job.status === 'completed' && (
            <Link
              href={`/invoices/new?job=${job.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FileText size={18} />
              Create Invoice
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {job.description && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600">{job.description}</p>
            </div>
          )}

          {/* Checklist */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Checklist</h2>
              <span className="text-sm text-gray-500">
                {completedItems}/{job.checklist.length} completed
              </span>
            </div>
            <div className="space-y-2">
              {job.checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklist(item.id)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Notes</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Schedule</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={18} className="text-gray-400" />
                <span>{formatDate(job.scheduled_date)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={18} className="text-gray-400" />
                <span>{job.scheduled_time} ({job.duration_hours}h)</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <Link href="/customers/1" className="text-blue-600 hover:underline">
                  {job.customer_name}
                </Link>
              </div>
              <a href={`tel:${job.customer_phone}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                <Phone size={18} className="text-gray-400" />
                <span>{job.customer_phone}</span>
              </a>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <span>{job.customer_address}</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="flex items-center gap-3">
              <DollarSign size={18} className="text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(job.price)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
