import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  notes: string | null
  tags: string[]
  source: string | null
  status: 'active' | 'inactive' | 'lead'
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string | null
  role: 'admin' | 'manager' | 'technician'
  color: string
  hourly_rate: number | null
  is_active: boolean
  created_at: string
}

export interface Estimate {
  id: string
  customer_id: string
  customer?: Customer
  title: string
  description: string | null
  line_items: LineItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  status: 'draft' | 'sent' | 'approved' | 'declined' | 'expired'
  valid_until: string | null
  notes: string | null
  sent_at: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface Job {
  id: string
  customer_id: string
  customer?: Customer
  estimate_id: string | null
  assigned_to: string[] // employee ids
  employees?: Employee[]
  title: string
  description: string | null
  job_type: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  end_time: string | null
  duration_hours: number
  status: 'unscheduled' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  price: number | null
  notes: string | null
  internal_notes: string | null
  photos: string[]
  checklist: ChecklistItem[]
  is_recurring: boolean
  recurrence_pattern: string | null
  parent_job_id: string | null
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  completed_at: string | null
  completed_by: string | null
}

export interface TimeEntry {
  id: string
  job_id: string
  employee_id: string
  employee?: Employee
  clock_in: string
  clock_out: string | null
  break_minutes: number
  notes: string | null
  created_at: string
}

export interface Expense {
  id: string
  job_id: string | null
  employee_id: string | null
  category: string
  description: string
  amount: number
  receipt_url: string | null
  date: string
  reimbursable: boolean
  reimbursed: boolean
  created_at: string
}

export interface Invoice {
  id: string
  job_id: string | null
  customer_id: string
  customer?: Customer
  job?: Job
  invoice_number: string
  line_items: LineItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  amount_paid: number
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue'
  due_date: string | null
  sent_at: string | null
  paid_at: string | null
  stripe_payment_intent_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  source: string | null
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  estimated_value: number | null
  notes: string | null
  assigned_to: string | null
  converted_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  type: 'reminder' | 'job_update' | 'payment' | 'system'
  title: string
  message: string
  read: boolean
  data: Record<string, unknown>
  created_at: string
}

export interface Settings {
  id: string
  company_name: string
  company_email: string | null
  company_phone: string | null
  company_address: string | null
  logo_url: string | null
  default_tax_rate: number
  stripe_account_id: string | null
  twilio_phone_number: string | null
  send_reminder_hours: number
  google_review_url: string | null
  created_at: string
  updated_at: string
}
