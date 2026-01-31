'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  DollarSign,
  Receipt,
  Upload,
  Filter,
  Calendar
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
  job_title: string | null
  employee_name: string
  receipt_url: string | null
  reimbursable: boolean
  reimbursed: boolean
}

const categories = [
  'Materials',
  'Tools & Equipment',
  'Fuel',
  'Vehicle Maintenance',
  'Supplies',
  'Subcontractor',
  'Other'
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    job_id: '',
    reimbursable: false
  })

  useEffect(() => {
    // Mock data - replace with API call
    setExpenses([
      {
        id: '1',
        category: 'Materials',
        description: 'Replacement compressor unit',
        amount: 450,
        date: '2026-01-30',
        job_title: 'AC Repair - Jane Doe',
        employee_name: 'Mike Johnson',
        receipt_url: '/receipt1.jpg',
        reimbursable: false,
        reimbursed: false
      },
      {
        id: '2',
        category: 'Fuel',
        description: 'Gas for service van',
        amount: 65.50,
        date: '2026-01-30',
        job_title: null,
        employee_name: 'Mike Johnson',
        receipt_url: null,
        reimbursable: true,
        reimbursed: false
      },
      {
        id: '3',
        category: 'Tools & Equipment',
        description: 'New multimeter',
        amount: 89.99,
        date: '2026-01-28',
        job_title: null,
        employee_name: 'Sarah Davis',
        receipt_url: '/receipt2.jpg',
        reimbursable: true,
        reimbursed: true
      },
      {
        id: '4',
        category: 'Supplies',
        description: 'Air filters (10 pack)',
        amount: 125,
        date: '2026-01-27',
        job_title: 'HVAC Maintenance',
        employee_name: 'Mike Johnson',
        receipt_url: '/receipt3.jpg',
        reimbursable: false,
        reimbursed: false
      },
      {
        id: '5',
        category: 'Subcontractor',
        description: 'Electrical work - Tech Corp',
        amount: 350,
        date: '2026-01-25',
        job_title: 'New Installation - Bob Wilson',
        employee_name: 'Tom Wilson',
        receipt_url: '/receipt4.jpg',
        reimbursable: false,
        reimbursed: false
      },
    ])
  }, [])

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(search.toLowerCase()) ||
      expense.category.toLowerCase().includes(search.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    thisMonth: expenses
      .filter(e => e.date >= '2026-01-01')
      .reduce((sum, e) => sum + e.amount, 0),
    pendingReimbursement: expenses
      .filter(e => e.reimbursable && !e.reimbursed)
      .reduce((sum, e) => sum + e.amount, 0),
    byCategory: categories.map(cat => ({
      category: cat,
      amount: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    })).filter(c => c.amount > 0)
  }

  const handleAddExpense = () => {
    // TODO: API call to add expense
    console.log('Adding expense:', newExpense)
    setShowAddModal(false)
    setNewExpense({
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      job_id: '',
      reimbursable: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500">Track job costs and expenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.thisMonth)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pending Reimbursement</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.pendingReimbursement)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total (All Time)</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
        </div>
      </div>

      {/* By Category */}
      {stats.byCategory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-medium text-gray-900 mb-3">By Category</h3>
          <div className="flex flex-wrap gap-3">
            {stats.byCategory.map((cat) => (
              <div key={cat.category} className="px-3 py-2 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-500">{cat.category}</p>
                <p className="font-semibold text-gray-900">{formatCurrency(cat.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Job</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="text-gray-900">{formatDate(expense.date)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    {expense.receipt_url && (
                      <span className="text-xs text-blue-600">📎 Receipt attached</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {expense.job_title ? (
                      <p className="text-sm text-gray-600">{expense.job_title}</p>
                    ) : (
                      <p className="text-sm text-gray-400">-</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600">{expense.employee_name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                  </td>
                  <td className="px-4 py-4">
                    {expense.reimbursable && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        expense.reimbursed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {expense.reimbursed ? 'Reimbursed' : 'Pending'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Receipt className="mx-auto mb-2 text-gray-300" size={40} />
            <p>No expenses found</p>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Expense</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newExpense.reimbursable}
                  onChange={(e) => setNewExpense({ ...newExpense, reimbursable: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Reimbursable expense</span>
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-sm text-gray-500">Upload receipt (optional)</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
