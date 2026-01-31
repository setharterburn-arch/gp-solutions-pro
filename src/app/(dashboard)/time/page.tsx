'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  Play, 
  Pause, 
  StopCircle,
  Calendar,
  User,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { formatCurrency } from '@/lib/utils'

interface TimeEntry {
  id: string
  job_id: string
  job_title: string
  customer_name: string
  employee_name: string
  clock_in: string
  clock_out: string | null
  break_minutes: number
  total_hours: number
  notes: string | null
}

interface ActiveTimer {
  job_id: string
  job_title: string
  customer_name: string
  clock_in: string
}

export default function TimeTrackingPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedJob, setSelectedJob] = useState('')

  // Mock jobs for dropdown
  const availableJobs = [
    { id: '1', title: 'HVAC Maintenance', customer: 'John Smith' },
    { id: '2', title: 'AC Repair', customer: 'Jane Doe' },
    { id: '3', title: 'New Installation', customer: 'Bob Wilson' },
  ]

  // Mock time entries
  useEffect(() => {
    setTimeEntries([
      {
        id: '1',
        job_id: '1',
        job_title: 'HVAC Maintenance',
        customer_name: 'John Smith',
        employee_name: 'Mike Johnson',
        clock_in: '2026-01-30T09:00:00',
        clock_out: '2026-01-30T11:30:00',
        break_minutes: 0,
        total_hours: 2.5,
        notes: 'Regular maintenance completed'
      },
      {
        id: '2',
        job_id: '2',
        job_title: 'AC Repair',
        customer_name: 'Jane Doe',
        employee_name: 'Mike Johnson',
        clock_in: '2026-01-30T13:00:00',
        clock_out: '2026-01-30T16:00:00',
        break_minutes: 30,
        total_hours: 2.5,
        notes: 'Replaced compressor'
      },
      {
        id: '3',
        job_id: '3',
        job_title: 'New Installation',
        customer_name: 'Bob Wilson',
        employee_name: 'Sarah Davis',
        clock_in: '2026-01-29T08:00:00',
        clock_out: '2026-01-29T17:00:00',
        break_minutes: 60,
        total_hours: 8,
        notes: 'Full system installation'
      },
    ])
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (activeTimer) {
      interval = setInterval(() => {
        const start = new Date(activeTimer.clock_in).getTime()
        const now = Date.now()
        setElapsedTime(Math.floor((now - start) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTimer])

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleClockIn = () => {
    if (!selectedJob) return
    const job = availableJobs.find(j => j.id === selectedJob)
    if (!job) return

    setActiveTimer({
      job_id: job.id,
      job_title: job.title,
      customer_name: job.customer,
      clock_in: new Date().toISOString()
    })
    setElapsedTime(0)
  }

  const handleClockOut = () => {
    if (!activeTimer) return

    const clockOut = new Date()
    const clockIn = new Date(activeTimer.clock_in)
    const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)

    const newEntry: TimeEntry = {
      id: crypto.randomUUID(),
      job_id: activeTimer.job_id,
      job_title: activeTimer.job_title,
      customer_name: activeTimer.customer_name,
      employee_name: 'Current User',
      clock_in: activeTimer.clock_in,
      clock_out: clockOut.toISOString(),
      break_minutes: 0,
      total_hours: Math.round(totalHours * 100) / 100,
      notes: null
    }

    setTimeEntries([newEntry, ...timeEntries])
    setActiveTimer(null)
    setElapsedTime(0)
    setSelectedJob('')
  }

  // Week navigation
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getEntriesForDay = (day: Date) => {
    return timeEntries.filter(entry => 
      isSameDay(new Date(entry.clock_in), day)
    )
  }

  const getTotalHoursForDay = (day: Date) => {
    return getEntriesForDay(day).reduce((sum, entry) => sum + entry.total_hours, 0)
  }

  const totalWeekHours = weekDays.reduce((sum, day) => sum + getTotalHoursForDay(day), 0)

  // Calculate stats
  const stats = {
    todayHours: getTotalHoursForDay(new Date()),
    weekHours: totalWeekHours,
    activeJobs: new Set(timeEntries.map(e => e.job_id)).size
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-500">Track time spent on jobs</p>
        </div>
      </div>

      {/* Clock In/Out Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {activeTimer ? 'Currently Clocked In' : 'Clock In'}
        </h2>

        {activeTimer ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <p className="text-5xl font-mono font-bold text-gray-900 mb-2">
                {formatElapsedTime(elapsedTime)}
              </p>
              <p className="text-gray-500">
                Working on: <span className="font-medium">{activeTimer.job_title}</span>
              </p>
              <p className="text-sm text-gray-400">{activeTimer.customer_name}</p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClockOut}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <StopCircle size={20} />
                Clock Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Job
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a job...</option>
                {availableJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.customer}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleClockIn}
              disabled={!selectedJob}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={20} />
              Clock In
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-xl font-bold text-gray-900">{stats.todayHours.toFixed(1)} hrs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">This Week</p>
              <p className="text-xl font-bold text-gray-900">{stats.weekHours.toFixed(1)} hrs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Jobs Worked</p>
              <p className="text-xl font-bold text-gray-900">{stats.activeJobs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Week View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Week Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-semibold text-gray-900">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
          <button
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date())
            const dayHours = getTotalHoursForDay(day)
            return (
              <div 
                key={idx} 
                className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}
              >
                <p className="text-sm text-gray-500">{format(day, 'EEE')}</p>
                <p className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {format(day, 'd')}
                </p>
                <p className="text-sm text-gray-600 mt-1">{dayHours.toFixed(1)} hrs</p>
              </div>
            )
          })}
        </div>

        {/* Time Entries */}
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {timeEntries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="mx-auto mb-2 text-gray-300" size={40} />
              <p>No time entries yet</p>
              <p className="text-sm">Clock in to a job to start tracking time</p>
            </div>
          ) : (
            timeEntries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="w-24 text-center">
                  <p className="font-semibold text-gray-900">
                    {format(new Date(entry.clock_in), 'MMM d')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(entry.clock_in), 'h:mm a')}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{entry.job_title}</p>
                  <p className="text-sm text-gray-500">{entry.customer_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{entry.employee_name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{entry.total_hours.toFixed(1)} hrs</p>
                  {entry.break_minutes > 0 && (
                    <p className="text-xs text-gray-500">{entry.break_minutes} min break</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
