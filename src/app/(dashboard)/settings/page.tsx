'use client'

import { useState } from 'react'
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
  Check
} from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    company_name: 'GP Solutions',
    company_email: 'info@gpsolutions.com',
    company_phone: '(555) 123-4567',
    company_address: '123 Business St, Springfield, IL 62701',
    default_tax_rate: 8.25,
    send_reminder_hours: 24,
    google_review_url: '',
    stripe_enabled: false,
    twilio_enabled: false,
  })

  const handleSave = async () => {
    // TODO: Save to Supabase
    console.log('Saving settings:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {saved ? <Check size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Changes'}
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline mr-1" size={14} />
              Address
            </label>
            <input
              type="text"
              value={settings.company_address}
              onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Invoicing */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <CreditCard className="text-green-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Invoicing & Payments</h2>
        </div>

        <div className="space-y-4">
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.default_tax_rate}
              onChange={(e) => setSettings({ ...settings, default_tax_rate: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Stripe Payments</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stripe_enabled}
                onChange={(e) => setSettings({ ...settings, stripe_enabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable online payments via Stripe</span>
            </label>
            {settings.stripe_enabled && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Configure Stripe keys in environment variables:
                </p>
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">STRIPE_SECRET_KEY</code>
                <code className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SMS Reminders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageSquare className="text-purple-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">SMS Reminders (Twilio)</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twilio_enabled}
              onChange={(e) => setSettings({ ...settings, twilio_enabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable SMS appointment reminders</span>
          </label>

          {settings.twilio_enabled && (
            <>
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send reminder (hours before)
                </label>
                <input
                  type="number"
                  value={settings.send_reminder_hours}
                  onChange={(e) => setSettings({ ...settings, send_reminder_hours: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Configure Twilio keys in environment variables:
                </p>
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">TWILIO_ACCOUNT_SID</code>
                <code className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">TWILIO_AUTH_TOKEN</code>
                <code className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">TWILIO_PHONE_NUMBER</code>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="text-yellow-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Review Requests</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Review URL
          </label>
          <input
            type="url"
            placeholder="https://g.page/r/..."
            value={settings.google_review_url}
            onChange={(e) => setSettings({ ...settings, google_review_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            After completing a job, customers will be sent a link to leave a review.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Bell className="text-orange-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Email notifications for new jobs</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Email notifications for payments received</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Daily digest email</span>
          </label>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/settings/templates"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email & SMS Templates</h3>
              <p className="text-sm text-gray-500">Customize automated messages</p>
            </div>
          </div>
        </Link>
        <Link
          href="/settings/forms"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Settings className="text-teal-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Custom Job Forms</h3>
              <p className="text-sm text-gray-500">Create checklists and forms</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
