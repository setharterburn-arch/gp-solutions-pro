'use client'

import { useState } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Briefcase,
  Calendar,
  Clock,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month')

  // Mock data - replace with API calls
  const stats = {
    revenue: {
      current: 24750,
      previous: 21200,
      change: 16.7
    },
    jobs: {
      completed: 45,
      previous: 38,
      change: 18.4
    },
    customers: {
      new: 12,
      previous: 8,
      change: 50
    },
    avgJobValue: {
      current: 550,
      previous: 558,
      change: -1.4
    }
  }

  const revenueByMonth = [
    { month: 'Aug', revenue: 18500 },
    { month: 'Sep', revenue: 21200 },
    { month: 'Oct', revenue: 19800 },
    { month: 'Nov', revenue: 22100 },
    { month: 'Dec', revenue: 21200 },
    { month: 'Jan', revenue: 24750 },
  ]

  const topCustomers = [
    { name: 'Tech Corp Inc.', revenue: 15800, jobs: 24 },
    { name: 'Green Valley School', revenue: 12500, jobs: 18 },
    { name: 'Metro Office Building', revenue: 8900, jobs: 15 },
    { name: 'John Smith', revenue: 4580, jobs: 12 },
    { name: 'Jane Doe', revenue: 3250, jobs: 8 },
  ]

  const jobsByType = [
    { type: 'Maintenance', count: 28, revenue: 4200 },
    { type: 'Repair', count: 35, revenue: 8750 },
    { type: 'Installation', count: 8, revenue: 9600 },
    { type: 'Inspection', count: 22, revenue: 1958 },
  ]

  const employeePerformance = [
    { name: 'Mike Johnson', jobs: 32, revenue: 14500, rating: 4.8 },
    { name: 'Sarah Davis', jobs: 28, revenue: 11200, rating: 4.9 },
    { name: 'Tom Wilson', jobs: 24, revenue: 9800, rating: 4.6 },
  ]

  const maxRevenue = Math.max(...revenueByMonth.map(r => r.revenue))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Business analytics and insights</p>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setDateRange('week')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              dateRange === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              dateRange === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setDateRange('quarter')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              dateRange === 'quarter' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setDateRange('year')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              dateRange === 'year' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <span className={`flex items-center text-sm font-medium ${stats.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenue.change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(stats.revenue.change)}%
            </span>
          </div>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue.current)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="text-blue-600" size={20} />
            </div>
            <span className={`flex items-center text-sm font-medium ${stats.jobs.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.jobs.change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(stats.jobs.change)}%
            </span>
          </div>
          <p className="text-sm text-gray-500">Jobs Completed</p>
          <p className="text-2xl font-bold text-gray-900">{stats.jobs.completed}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={20} />
            </div>
            <span className={`flex items-center text-sm font-medium ${stats.customers.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.customers.change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(stats.customers.change)}%
            </span>
          </div>
          <p className="text-sm text-gray-500">New Customers</p>
          <p className="text-2xl font-bold text-gray-900">{stats.customers.new}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <span className={`flex items-center text-sm font-medium ${stats.avgJobValue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.avgJobValue.change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(stats.avgJobValue.change)}%
            </span>
          </div>
          <p className="text-sm text-gray-500">Avg Job Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgJobValue.current)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-64 flex items-end gap-4">
            {revenueByMonth.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                  style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                />
                <p className="text-xs text-gray-500">{item.month}</p>
                <p className="text-xs font-medium text-gray-700">{formatCurrency(item.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.jobs} jobs</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(customer.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Jobs by Type</h2>
          <div className="space-y-4">
            {jobsByType.map((item, index) => {
              const maxCount = Math.max(...jobsByType.map(j => j.count))
              const percentage = (item.count / maxCount) * 100
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{item.type}</p>
                    <p className="text-sm text-gray-500">{item.count} jobs • {formatCurrency(item.revenue)}</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Employee Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">Jobs</th>
                  <th className="pb-3">Revenue</th>
                  <th className="pb-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employeePerformance.map((employee, index) => (
                  <tr key={index}>
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{employee.name}</p>
                    </td>
                    <td className="py-3 text-gray-600">{employee.jobs}</td>
                    <td className="py-3 font-semibold text-gray-900">{formatCurrency(employee.revenue)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={14} />
                        <span className="font-medium text-gray-900">{employee.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
