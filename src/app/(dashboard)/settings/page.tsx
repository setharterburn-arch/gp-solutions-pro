'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  MessageSquare,
  Bell,
  Star,
  Save,
  Check,
  Settings,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    id: '',
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    default_tax_rate: 0,
    send_reminder_hours: 24,
    google_review_url: '',
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single()

        if (error && error.code !== 'PGRST116') throw error

        if (data) {
          setSettings({
            id: data.id,
            company_name: data.company_name || '',
            company_email: data.company_email || '',
            company_phone: data.company_phone || '',
            company_address: data.company_address || '',
            default_tax_rate: data.default_tax_rate || 0,
            send_reminder_hours: data.send_reminder_hours || 24,
            google_review_url: data.google_review_url || '',
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    
    try {
      if (settings.id) {
        // Update existing
        const { error } = await supabase
          .from('settings')
          .update({
            company_name: settings.company_name,
            company_email: settings.company_email,
            company_phone: settings.company_phone,
            company_address: settings.company_address,
            default_tax_rate: settings.default_tax_rate,
            send_reminder_hours: settings.send_reminder_hours,
            google_review_url: settings.google_review_url,
          })
          .eq('id', settings.id)

        if (error) throw error
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('settings')
          .insert({
            company_name: settings.company_name,
            company_email: settings.company_email,
            company_phone: settings.company_phone,
            company_address: settings.company_address,
            default_tax_rate: settings.default_tax_rate,
            send_reminder_hours: settings.send_reminder_hours,
            google_review_url: settings.google_review_url,
          })
          .select()
          .single()

        if (error) throw error
        if (data) setSettings({ ...settings, id: data.id })
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Configure your business settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saved ? <Check size={20} /> : saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building className="text-blue-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              placeholder="Your Company Name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="inline mr-1" size={14} />
              Email
            </label>
            <input
              type="email"
              value={settings.company_email}
              onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
              placeholder="info@yourcompany.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="inline mr-1" size={14} />
              Phone
            </label>
            <input
              type="tel"
              value={settings.company_phone}
              onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline mr-1" size={14} />
              Business Address
            </label>
            <input
              type="text"
              value={settings.company_address}
              onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
              placeholder="123 Main St, City, State ZIP"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Invoice Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <CreditCard className="text-green-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Invoice Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={settings.default_tax_rate}
              onChange={(e) => setSettings({ ...settings, default_tax_rate: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Bell className="inline mr-1" size={14} />
              Reminder Before (hours)
            </label>
            <input
              type="number"
              min="1"
              value={settings.send_reminder_hours}
              onChange={(e) => setSettings({ ...settings, send_reminder_hours: parseInt(e.target.value) || 24 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Review Link */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="text-yellow-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Google Reviews</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Review URL
          </label>
          <input
            type="url"
            value={settings.google_review_url}
            onChange={(e) => setSettings({ ...settings, google_review_url: e.target.value })}
            placeholder="https://g.page/r/..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Add your Google review link to include on invoices
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Settings className="text-purple-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">More Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/settings/forms"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Custom Forms</h3>
            <p className="text-sm text-gray-500">Manage booking forms and fields</p>
          </Link>

          <Link
            href="/settings/templates"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Email Templates</h3>
            <p className="text-sm text-gray-500">Customize email templates</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
