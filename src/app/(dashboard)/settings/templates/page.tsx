'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Mail,
  MessageSquare,
  Edit2,
  Save,
  RotateCcw,
  Eye
} from 'lucide-react'

interface Template {
  id: string
  name: string
  type: 'email' | 'sms'
  trigger: string
  subject?: string
  body: string
  enabled: boolean
}

const defaultTemplates: Template[] = [
  {
    id: '1',
    name: 'Appointment Reminder',
    type: 'sms',
    trigger: '24 hours before job',
    body: 'Hi {{customer_name}}! This is a reminder about your appointment tomorrow at {{scheduled_time}}. {{company_name}} - {{company_phone}}',
    enabled: true
  },
  {
    id: '2',
    name: 'Appointment Confirmation',
    type: 'email',
    trigger: 'When job is scheduled',
    subject: 'Your appointment is confirmed - {{company_name}}',
    body: `Hi {{customer_name}},

Your appointment has been scheduled!

Service: {{job_title}}
Date: {{scheduled_date}}
Time: {{scheduled_time}}
Address: {{customer_address}}

If you need to reschedule, please call us at {{company_phone}}.

Thanks,
{{company_name}}`,
    enabled: true
  },
  {
    id: '3',
    name: 'Job Completed',
    type: 'email',
    trigger: 'When job is marked complete',
    subject: 'Your service is complete - {{company_name}}',
    body: `Hi {{customer_name}},

We've completed your {{job_title}} service.

Your technician: {{technician_name}}

An invoice will be sent shortly. If you have any questions, please don't hesitate to reach out.

Thanks for choosing {{company_name}}!`,
    enabled: true
  },
  {
    id: '4',
    name: 'Invoice Sent',
    type: 'email',
    trigger: 'When invoice is sent',
    subject: 'Invoice {{invoice_number}} from {{company_name}}',
    body: `Hi {{customer_name}},

Please find your invoice attached.

Invoice #: {{invoice_number}}
Amount Due: {{invoice_total}}
Due Date: {{due_date}}

Pay online: {{payment_link}}

Thanks,
{{company_name}}`,
    enabled: true
  },
  {
    id: '5',
    name: 'Invoice Reminder',
    type: 'email',
    trigger: '3 days before due date',
    subject: 'Friendly reminder: Invoice {{invoice_number}} due soon',
    body: `Hi {{customer_name}},

Just a friendly reminder that invoice {{invoice_number}} for {{invoice_total}} is due on {{due_date}}.

Pay online: {{payment_link}}

If you've already paid, please disregard this message.

Thanks,
{{company_name}}`,
    enabled: true
  },
  {
    id: '6',
    name: 'Payment Received',
    type: 'email',
    trigger: 'When payment is recorded',
    subject: 'Payment received - Thank you!',
    body: `Hi {{customer_name}},

We've received your payment of {{payment_amount}} for invoice {{invoice_number}}.

Thank you for your business!

{{company_name}}`,
    enabled: true
  },
  {
    id: '7',
    name: 'Quote Follow-up',
    type: 'email',
    trigger: '3 days after estimate sent',
    subject: 'Following up on your estimate - {{company_name}}',
    body: `Hi {{customer_name}},

Just following up on the estimate we sent for {{estimate_title}}.

Do you have any questions? We're happy to discuss the details.

View your estimate: {{estimate_link}}

Thanks,
{{company_name}}`,
    enabled: true
  },
  {
    id: '8',
    name: 'Review Request',
    type: 'sms',
    trigger: '1 day after job completed',
    body: 'Hi {{customer_name}}! Thanks for choosing {{company_name}}. We\'d love your feedback! Leave a review: {{review_link}}',
    enabled: true
  }
]

const variables = [
  '{{customer_name}}', '{{customer_email}}', '{{customer_phone}}', '{{customer_address}}',
  '{{company_name}}', '{{company_phone}}', '{{company_email}}',
  '{{job_title}}', '{{scheduled_date}}', '{{scheduled_time}}', '{{technician_name}}',
  '{{invoice_number}}', '{{invoice_total}}', '{{due_date}}', '{{payment_link}}', '{{payment_amount}}',
  '{{estimate_title}}', '{{estimate_total}}', '{{estimate_link}}',
  '{{review_link}}'
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedTemplate, setEditedTemplate] = useState<Template | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)

  const handleEdit = (template: Template) => {
    setEditingId(template.id)
    setEditedTemplate({ ...template })
  }

  const handleSave = () => {
    if (editedTemplate) {
      setTemplates(templates.map(t => 
        t.id === editedTemplate.id ? editedTemplate : t
      ))
    }
    setEditingId(null)
    setEditedTemplate(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedTemplate(null)
  }

  const toggleEnabled = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ))
  }

  const getPreviewContent = (body: string) => {
    return body
      .replace(/\{\{customer_name\}\}/g, 'John Smith')
      .replace(/\{\{customer_email\}\}/g, 'john@example.com')
      .replace(/\{\{customer_phone\}\}/g, '(555) 123-4567')
      .replace(/\{\{customer_address\}\}/g, '123 Main St, Springfield')
      .replace(/\{\{company_name\}\}/g, 'GP Solutions')
      .replace(/\{\{company_phone\}\}/g, '(555) 987-6543')
      .replace(/\{\{company_email\}\}/g, 'info@gpsolutions.com')
      .replace(/\{\{job_title\}\}/g, 'AC Maintenance')
      .replace(/\{\{scheduled_date\}\}/g, 'February 5, 2026')
      .replace(/\{\{scheduled_time\}\}/g, '9:00 AM')
      .replace(/\{\{technician_name\}\}/g, 'Mike Johnson')
      .replace(/\{\{invoice_number\}\}/g, 'INV-2601-0001')
      .replace(/\{\{invoice_total\}\}/g, '$150.00')
      .replace(/\{\{due_date\}\}/g, 'February 15, 2026')
      .replace(/\{\{payment_link\}\}/g, 'https://pay.gpsolutions.com/inv123')
      .replace(/\{\{payment_amount\}\}/g, '$150.00')
      .replace(/\{\{estimate_title\}\}/g, 'HVAC System Replacement')
      .replace(/\{\{estimate_total\}\}/g, '$8,500.00')
      .replace(/\{\{estimate_link\}\}/g, 'https://gpsolutions.com/quote/abc123')
      .replace(/\{\{review_link\}\}/g, 'https://g.page/gpsolutions/review')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email & SMS Templates</h1>
          <p className="text-gray-500">Customize automated messages sent to customers</p>
        </div>
      </div>

      {/* Variables Reference */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">Available Variables</p>
        <div className="flex flex-wrap gap-2">
          {variables.map((v) => (
            <code key={v} className="px-2 py-1 bg-white text-blue-700 text-xs rounded border border-blue-200">
              {v}
            </code>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {template.type === 'email' ? (
                    <Mail className="text-blue-600" size={20} />
                  ) : (
                    <MessageSquare className="text-green-600" size={20} />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.trigger}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.enabled}
                      onChange={() => toggleEnabled(template.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Enabled</span>
                  </label>
                  <button
                    onClick={() => setPreviewId(previewId === template.id ? null : template.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {editingId === template.id && editedTemplate && (
              <div className="p-4 bg-gray-50 space-y-4">
                {template.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={editedTemplate.subject || ''}
                      onChange={(e) => setEditedTemplate({ ...editedTemplate, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={editedTemplate.body}
                    onChange={(e) => setEditedTemplate({ ...editedTemplate, body: e.target.value })}
                    rows={template.type === 'sms' ? 3 : 8}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  {template.type === 'sms' && (
                    <p className="text-xs text-gray-500 mt-1">
                      {editedTemplate.body.length}/160 characters
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <RotateCcw size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {previewId === template.id && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                {template.type === 'email' && template.subject && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> {getPreviewContent(template.subject)}
                  </p>
                )}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {getPreviewContent(template.body)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
