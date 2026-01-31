'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Edit2,
  Copy,
  ToggleLeft,
  ToggleRight,
  Type,
  Hash,
  CheckSquare,
  List,
  AlignLeft,
  Calendar,
  Image,
  Signature
} from 'lucide-react'

interface FormField {
  id: string
  type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'date' | 'photo' | 'signature'
  label: string
  required: boolean
  options?: string[] // For select type
  placeholder?: string
}

interface JobForm {
  id: string
  name: string
  description: string
  job_types: string[]
  fields: FormField[]
  enabled: boolean
}

const fieldTypes = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'select', label: 'Dropdown', icon: List },
  { type: 'textarea', label: 'Long Text', icon: AlignLeft },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'photo', label: 'Photo', icon: Image },
  { type: 'signature', label: 'Signature', icon: Signature },
]

const defaultForms: JobForm[] = [
  {
    id: '1',
    name: 'HVAC Inspection Checklist',
    description: 'Standard checklist for HVAC inspections',
    job_types: ['Inspection', 'Maintenance'],
    enabled: true,
    fields: [
      { id: 'f1', type: 'checkbox', label: 'Checked thermostat operation', required: true },
      { id: 'f2', type: 'checkbox', label: 'Inspected electrical connections', required: true },
      { id: 'f3', type: 'checkbox', label: 'Checked refrigerant levels', required: true },
      { id: 'f4', type: 'checkbox', label: 'Cleaned/replaced air filter', required: true },
      { id: 'f5', type: 'checkbox', label: 'Inspected ductwork', required: false },
      { id: 'f6', type: 'select', label: 'Overall system condition', required: true, options: ['Excellent', 'Good', 'Fair', 'Poor', 'Needs Repair'] },
      { id: 'f7', type: 'textarea', label: 'Technician notes', required: false, placeholder: 'Any additional observations...' },
      { id: 'f8', type: 'photo', label: 'Equipment photo', required: false },
      { id: 'f9', type: 'signature', label: 'Customer signature', required: true },
    ]
  },
  {
    id: '2',
    name: 'Installation Completion Form',
    description: 'Sign-off form for new installations',
    job_types: ['Installation'],
    enabled: true,
    fields: [
      { id: 'f1', type: 'text', label: 'Equipment model number', required: true },
      { id: 'f2', type: 'text', label: 'Serial number', required: true },
      { id: 'f3', type: 'checkbox', label: 'Equipment tested and operational', required: true },
      { id: 'f4', type: 'checkbox', label: 'Customer trained on operation', required: true },
      { id: 'f5', type: 'checkbox', label: 'Warranty paperwork provided', required: true },
      { id: 'f6', type: 'photo', label: 'Before photo', required: true },
      { id: 'f7', type: 'photo', label: 'After photo', required: true },
      { id: 'f8', type: 'textarea', label: 'Installation notes', required: false },
      { id: 'f9', type: 'signature', label: 'Customer signature', required: true },
    ]
  },
  {
    id: '3',
    name: 'Service Call Report',
    description: 'General service call documentation',
    job_types: ['Repair', 'General Service'],
    enabled: true,
    fields: [
      { id: 'f1', type: 'textarea', label: 'Problem description', required: true },
      { id: 'f2', type: 'textarea', label: 'Work performed', required: true },
      { id: 'f3', type: 'select', label: 'Parts used', required: false, options: ['None', 'Minor parts', 'Major parts', 'Equipment replaced'] },
      { id: 'f4', type: 'number', label: 'Labor hours', required: true },
      { id: 'f5', type: 'checkbox', label: 'Issue resolved', required: true },
      { id: 'f6', type: 'checkbox', label: 'Follow-up needed', required: false },
      { id: 'f7', type: 'textarea', label: 'Recommendations', required: false },
      { id: 'f8', type: 'signature', label: 'Customer signature', required: true },
    ]
  }
]

export default function JobFormsPage() {
  const [forms, setForms] = useState<JobForm[]>(defaultForms)
  const [editingForm, setEditingForm] = useState<JobForm | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)

  const toggleEnabled = (id: string) => {
    setForms(forms.map(f => 
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ))
  }

  const duplicateForm = (form: JobForm) => {
    const newForm = {
      ...form,
      id: crypto.randomUUID(),
      name: `${form.name} (Copy)`,
      fields: form.fields.map(f => ({ ...f, id: crypto.randomUUID() }))
    }
    setForms([...forms, newForm])
  }

  const deleteForm = (id: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      setForms(forms.filter(f => f.id !== id))
    }
  }

  const editForm = (form: JobForm) => {
    setEditingForm({ ...form, fields: form.fields.map(f => ({ ...f })) })
    setShowBuilder(true)
  }

  const createNewForm = () => {
    setEditingForm({
      id: crypto.randomUUID(),
      name: 'New Form',
      description: '',
      job_types: [],
      fields: [],
      enabled: true
    })
    setShowBuilder(true)
  }

  const saveForm = () => {
    if (editingForm) {
      const exists = forms.find(f => f.id === editingForm.id)
      if (exists) {
        setForms(forms.map(f => f.id === editingForm.id ? editingForm : f))
      } else {
        setForms([...forms, editingForm])
      }
    }
    setShowBuilder(false)
    setEditingForm(null)
  }

  const addField = (type: FormField['type']) => {
    if (editingForm) {
      const newField: FormField = {
        id: crypto.randomUUID(),
        type,
        label: `New ${type} field`,
        required: false,
        options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
      }
      setEditingForm({
        ...editingForm,
        fields: [...editingForm.fields, newField]
      })
    }
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (editingForm) {
      setEditingForm({
        ...editingForm,
        fields: editingForm.fields.map(f => 
          f.id === fieldId ? { ...f, ...updates } : f
        )
      })
    }
  }

  const removeField = (fieldId: string) => {
    if (editingForm) {
      setEditingForm({
        ...editingForm,
        fields: editingForm.fields.filter(f => f.id !== fieldId)
      })
    }
  }

  const getFieldIcon = (type: FormField['type']) => {
    const ft = fieldTypes.find(f => f.type === type)
    return ft ? ft.icon : Type
  }

  if (showBuilder && editingForm) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setShowBuilder(false); setEditingForm(null) }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
              <p className="text-gray-500">Design your custom job form</p>
            </div>
          </div>
          <button
            onClick={saveForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Form
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Settings */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Form Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
                  <input
                    type="text"
                    value={editingForm.name}
                    onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingForm.description}
                    onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Add Field</h3>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes.map((ft) => (
                  <button
                    key={ft.type}
                    onClick={() => addField(ft.type as FormField['type'])}
                    className="flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ft.icon size={16} />
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Form Fields</h3>
              
              {editingForm.fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No fields yet. Add fields from the left panel.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {editingForm.fields.map((field, idx) => {
                    const FieldIcon = getFieldIcon(field.type)
                    return (
                      <div key={field.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <GripVertical className="text-gray-400 mt-2 cursor-move" size={16} />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <FieldIcon size={16} className="text-gray-500" />
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded"
                            />
                            <label className="flex items-center gap-1 text-xs text-gray-500">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                className="w-3 h-3"
                              />
                              Required
                            </label>
                          </div>
                          {field.type === 'select' && (
                            <input
                              type="text"
                              value={field.options?.join(', ')}
                              onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(o => o.trim()) })}
                              placeholder="Options (comma separated)"
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                            />
                          )}
                        </div>
                        <button
                          onClick={() => removeField(field.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/settings"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custom Job Forms</h1>
            <p className="text-gray-500">Create forms for technicians to fill out on jobs</p>
          </div>
        </div>
        <button
          onClick={createNewForm}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Form
        </button>
      </div>

      {/* Forms List */}
      <div className="space-y-4">
        {forms.map((form) => (
          <div key={form.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{form.name}</h3>
                  <button
                    onClick={() => toggleEnabled(form.id)}
                    className={`${form.enabled ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {form.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{form.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">{form.fields.length} fields</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{form.job_types.join(', ')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => editForm(form)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => duplicateForm(form)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Duplicate"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={() => deleteForm(form.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
