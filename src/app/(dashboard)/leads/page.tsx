'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  UserPlus,
  Phone,
  Mail,
  DollarSign,
  ArrowRight,
  MoreVertical
} from 'lucide-react'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'

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
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-yellow-500' },
  { value: 'proposal', label: 'Proposal', color: 'bg-orange-500' },
  { value: 'won', label: 'Won', color: 'bg-green-500' },
  { value: 'lost', label: 'Lost', color: 'bg-red-500' },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline')

  useEffect(() => {
    // Mock data - replace with API call
    setLeads([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '(555) 111-2222',
        source: 'Website',
        status: 'new',
        estimated_value: 5000,
        notes: 'Interested in full HVAC replacement',
        assigned_to: 'Mike Johnson',
        created_at: '2026-01-30'
      },
      {
        id: '2',
        name: 'Metro Office Building',
        email: 'facilities@metro.com',
        phone: '(555) 333-4444',
        source: 'Referral',
        status: 'contacted',
        estimated_value: 25000,
        notes: 'Commercial maintenance contract opportunity',
        assigned_to: 'Sarah Davis',
        created_at: '2026-01-28'
      },
      {
        id: '3',
        name: 'David Park',
        email: 'david@example.com',
        phone: '(555) 555-6666',
        source: 'Google Ads',
        status: 'qualified',
        estimated_value: 3500,
        notes: 'Needs AC replacement before summer',
        assigned_to: 'Mike Johnson',
        created_at: '2026-01-25'
      },
      {
        id: '4',
        name: 'Green Valley School',
        email: 'admin@gvschool.edu',
        phone: '(555) 777-8888',
        source: 'Cold Call',
        status: 'proposal',
        estimated_value: 45000,
        notes: 'Large school district - multi-building contract',
        assigned_to: 'Tom Wilson',
        created_at: '2026-01-20'
      },
      {
        id: '5',
        name: 'Jennifer Lee',
        email: 'jennifer@example.com',
        phone: '(555) 999-0000',
        source: 'Website',
        status: 'won',
        estimated_value: 8500,
        notes: 'Converted to customer',
        assigned_to: 'Mike Johnson',
        created_at: '2026-01-15'
      },
      {
        id: '6',
        name: 'Tom Roberts',
        email: 'tom@example.com',
        phone: '(555) 222-3333',
        source: 'Referral',
        status: 'lost',
        estimated_value: 2000,
        notes: 'Went with competitor - price sensitive',
        assigned_to: 'Sarah Davis',
        created_at: '2026-01-10'
      },
    ])
  }, [])

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.email?.toLowerCase().includes(search.toLowerCase()) ||
    lead.phone?.includes(search)
  )

  const getLeadsByStatus = (status: string) => 
    filteredLeads.filter(lead => lead.status === status)

  const stats = {
    total: leads.filter(l => !['won', 'lost'].includes(l.status)).length,
    totalValue: leads
      .filter(l => !['won', 'lost'].includes(l.status))
      .reduce((sum, l) => sum + (l.estimated_value || 0), 0),
    wonValue: leads
      .filter(l => l.status === 'won')
      .reduce((sum, l) => sum + (l.estimated_value || 0), 0),
    conversionRate: Math.round(
      (leads.filter(l => l.status === 'won').length / 
       leads.filter(l => ['won', 'lost'].includes(l.status)).length) * 100
    ) || 0
  }

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setLeads(leads.map(l => 
      l.id === leadId ? { ...l, status: newStatus } : l
    ))
  }

  const handleConvertToCustomer = async (leadId: string) => {
    // TODO: Convert lead to customer
    console.log('Converting lead to customer:', leadId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500">Track and convert potential customers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('pipeline')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'pipeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <Link
            href="/leads/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Leads</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pipeline Value</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalValue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Won This Month</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.wonValue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pipeline View */}
      {view === 'pipeline' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusStages.slice(0, -2).map((stage) => (
            <div key={stage.value} className="flex-shrink-0 w-72">
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                  <span className="ml-auto text-sm text-gray-500">
                    {getLeadsByStatus(stage.value).length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {getLeadsByStatus(stage.value).map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{lead.name}</h4>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                      
                      {lead.estimated_value && (
                        <p className="text-sm font-semibold text-green-600 mb-2">
                          {formatCurrency(lead.estimated_value)}
                        </p>
                      )}
                      
                      {lead.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone size={10} />
                          {lead.phone}
                        </p>
                      )}
                      
                      {lead.source && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {lead.source}
                        </span>
                      )}

                      {/* Status Change Buttons */}
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                        {stage.value !== 'proposal' && (
                          <button
                            onClick={() => handleStatusChange(lead.id, statusStages[statusStages.findIndex(s => s.value === stage.value) + 1].value)}
                            className="flex-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                          >
                            Move to {statusStages[statusStages.findIndex(s => s.value === stage.value) + 1].label}
                          </button>
                        )}
                        {stage.value === 'proposal' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(lead.id, 'won')}
                              className="flex-1 px-2 py-1 text-xs text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                            >
                              Won
                            </button>
                            <button
                              onClick={() => handleStatusChange(lead.id, 'lost')}
                              className="flex-1 px-2 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                            >
                              Lost
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {getLeadsByStatus(stage.value).length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Lead</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Source</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Assigned</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(lead.created_at)}</p>
                    </td>
                    <td className="px-4 py-4">
                      {lead.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone size={12} />
                          {lead.phone}
                        </p>
                      )}
                      {lead.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail size={12} />
                          {lead.email}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {lead.source && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {lead.source}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {lead.estimated_value ? (
                        <p className="font-semibold text-gray-900">{formatCurrency(lead.estimated_value)}</p>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">{lead.assigned_to || '-'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {lead.status === 'won' && (
                          <button
                            onClick={() => handleConvertToCustomer(lead.id)}
                            className="flex items-center gap-1 px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <ArrowRight size={14} />
                            Convert
                          </button>
                        )}
                        <Link
                          href={`/leads/${lead.id}`}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <UserPlus className="mx-auto mb-2 text-gray-300" size={40} />
              <p>No leads found</p>
              <Link href="/leads/new" className="text-blue-600 hover:underline text-sm">
                Add your first lead
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
