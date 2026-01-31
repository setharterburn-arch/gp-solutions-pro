'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  User,
  Briefcase,
  DollarSign
} from 'lucide-react'
import { formatCurrency, getStatusColor } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  status: string
  tags: string[]
  total_jobs: number
  total_revenue: number
  created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Mock data - replace with API call
    setCustomers([
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        status: 'active',
        tags: ['residential', 'vip'],
        total_jobs: 12,
        total_revenue: 4580,
        created_at: '2025-06-15'
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '(555) 234-5678',
        address: '456 Oak Ave',
        city: 'Springfield',
        state: 'IL',
        status: 'active',
        tags: ['residential'],
        total_jobs: 5,
        total_revenue: 1250,
        created_at: '2025-08-20'
      },
      {
        id: '3',
        name: 'Tech Corp Inc.',
        email: 'service@techcorp.com',
        phone: '(555) 345-6789',
        address: '789 Business Blvd',
        city: 'Springfield',
        state: 'IL',
        status: 'active',
        tags: ['commercial', 'contract'],
        total_jobs: 24,
        total_revenue: 15800,
        created_at: '2025-03-10'
      },
      {
        id: '4',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '(555) 456-7890',
        address: '321 Elm St',
        city: 'Springfield',
        state: 'IL',
        status: 'inactive',
        tags: ['residential'],
        total_jobs: 2,
        total_revenue: 450,
        created_at: '2025-11-05'
      },
    ])
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search) ||
      customer.address?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500">{filteredCustomers.length} customers</p>
        </div>
        <Link
          href="/customers/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Customer
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Link
            key={customer.id}
            href={`/customers/${customer.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  {customer.phone}
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  {customer.email}
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  {customer.address}, {customer.city}, {customer.state}
                </div>
              )}
            </div>

            {/* Tags */}
            {customer.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Briefcase size={14} />
                <span>{customer.total_jobs} jobs</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                <DollarSign size={14} />
                <span>{formatCurrency(customer.total_revenue)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          <User className="mx-auto mb-2 text-gray-300" size={40} />
          <p>No customers found</p>
          <Link href="/customers/new" className="text-blue-600 hover:underline text-sm">
            Add your first customer
          </Link>
        </div>
      )}
    </div>
  )
}
