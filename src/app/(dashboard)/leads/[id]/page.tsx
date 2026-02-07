'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  User,
  UserPlus,
  FileText,
  ArrowRight,
  Trash2
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatDate } from '@/lib/utils'

interface Lead {
  id: string
  name: string
  email: string | null
  phone: string | null
  source: string | null
  status: string
  estimated_value: number | null
  notes: string | null
  assigned_to: string | null
  created_at: string
}

const statusStages = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setLead({
      id: params.id as string,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 111-2222',
      source: 'Website',
      status: 'new',
      estimated_value: 5000,
      notes: 'Interested in full HVAC replacement. Current system is 15 years old and having efficiency issues. Wants quote for both standard and high-efficiency options.',
      assigned_to: 'Mike Johnson',
      created_at: '2026-01-30'
    })
    setLoading(false)
  }, [params.id])

  const updateStatus = (newStatus: string) => {
    if (!lead) return
    setLead({ ...lead, status: newStatus })
  }

  const convertToCustomer = () => {
    if (!lead) return
    router.push(`/customers/new?lead=${lead.id}`)
  }

  const createEstimate = () => {
    if (!lead) return
    router.push(`/estimates/new?lead=${lead.id}`)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this lead?')) {
      router.push('/leads')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lead) return null

  const currentStageIndex = statusStages.findIndex(s => s.value === lead.status)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/leads" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
              {lead.source && (
                <span className="text-sm text-gray-500">via {lead.source}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/leads/${lead.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Edit size={18} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Pipeline Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Pipeline Stage</h2>
        <div className="flex items-center gap-2">
          {statusStages.map((stage, index) => (
            <button
              key={stage.value}
              onClick={() => updateStatus(stage.value)}
              disabled={stage.value === 'won' || stage.value === 'lost'}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                index === currentStageIndex
                  ? stage.value === 'won' ? 'bg-green-600 text-white' :
                    stage.value === 'lost' ? 'bg-red-600 text-white' :
                    'bg-blue-600 text-white'
                  : index < currentStageIndex
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {lead.status !== 'won' && lead.status !== 'lost' && (
            <>
              <button
                onClick={createEstimate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FileText size={18} />
                Create Estimate
              </button>
              <button
                onClick={convertToCustomer}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <UserPlus size={18} />
                Convert to Customer
              </button>
            </>
          )}
          {lead.status === 'won' && (
            <button
              onClick={convertToCustomer}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <UserPlus size={18} />
              Create Customer Record
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                <Phone size={18} className="text-gray-400" />
                <span>{lead.phone}</span>
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                <Mail size={18} className="text-gray-400" />
                <span>{lead.email}</span>
              </a>
            )}
          </div>
        </div>

        {/* Lead Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Lead Details</h2>
          <div className="space-y-3">
            {lead.estimated_value && (
              <div className="flex items-center gap-3">
                <DollarSign size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Value</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(lead.estimated_value)}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-900">{formatDate(lead.created_at)}</p>
              </div>
            </div>
            {lead.assigned_to && (
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="text-gray-900">{lead.assigned_to}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Source */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Source</h2>
          <p className="text-gray-600">{lead.source || 'Unknown'}</p>
        </div>
      </div>

      {/* Notes */}
      {lead.notes && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{lead.notes}</p>
        </div>
      )}
    </div>
  )
}
