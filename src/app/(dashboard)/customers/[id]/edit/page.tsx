'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'

export default function EditCustomerPage() {
  const params = useParams()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/customers/${params.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Construction className="mx-auto text-gray-300 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-500 mb-4">Customer editing is being built. For now, create a new customer.</p>
        <Link href="/customers/new" className="text-blue-600 hover:underline">
          Create New Customer
        </Link>
      </div>
    </div>
  )
}
