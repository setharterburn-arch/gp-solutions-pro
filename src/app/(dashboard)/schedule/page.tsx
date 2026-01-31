'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon,
  List,
  Grid3X3,
  MapPin,
  Clock,
  User
} from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, parseISO } from 'date-fns'
import { formatTime, getStatusColor, getPriorityColor } from '@/lib/utils'

interface ScheduledJob {
  id: string
  title: string
  customer_name: string
  customer_address: string
  scheduled_date: string
  scheduled_time: string
  end_time: string
  status: string
  priority: string
  assigned_to: string[]
  color: string
}

type ViewType = 'month' | 'week' | 'day' | 'list'

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>('week')
  const [jobs, setJobs] = useState<ScheduledJob[]>([])

  useEffect(() => {
    // Mock data - replace with API call
    setJobs([
      {
        id: '1',
        title: 'HVAC Maintenance',
        customer_name: 'John Smith',
        customer_address: '123 Main St',
        scheduled_date: '2026-01-31',
        scheduled_time: '09:00',
        end_time: '11:00',
        status: 'scheduled',
        priority: 'normal',
        assigned_to: ['Mike Johnson'],
        color: '#3b82f6'
      },
      {
        id: '2',
        title: 'AC Repair',
        customer_name: 'Jane Doe',
        customer_address: '456 Oak Ave',
        scheduled_date: '2026-01-31',
        scheduled_time: '13:00',
        end_time: '15:00',
        status: 'scheduled',
        priority: 'high',
        assigned_to: ['Mike Johnson'],
        color: '#f59e0b'
      },
      {
        id: '3',
        title: 'New Installation',
        customer_name: 'Bob Wilson',
        customer_address: '789 Pine Rd',
        scheduled_date: '2026-02-01',
        scheduled_time: '08:00',
        end_time: '16:00',
        status: 'scheduled',
        priority: 'normal',
        assigned_to: ['Team A'],
        color: '#10b981'
      },
      {
        id: '4',
        title: 'Furnace Inspection',
        customer_name: 'Alice Brown',
        customer_address: '321 Elm St',
        scheduled_date: '2026-02-02',
        scheduled_time: '14:00',
        end_time: '15:30',
        status: 'scheduled',
        priority: 'low',
        assigned_to: ['Sarah Davis'],
        color: '#8b5cf6'
      },
      {
        id: '5',
        title: 'Duct Cleaning',
        customer_name: 'Chris Martin',
        customer_address: '654 Maple Dr',
        scheduled_date: '2026-02-03',
        scheduled_time: '10:00',
        end_time: '12:00',
        status: 'scheduled',
        priority: 'normal',
        assigned_to: ['Mike Johnson'],
        color: '#ec4899'
      },
    ])
  }, [])

  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
    } else {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getJobsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return jobs.filter(job => job.scheduled_date === dateStr)
  }

  // Week view days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Month view days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 7) // 7 AM to 6 PM

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500">
            {view === 'month' 
              ? format(currentDate, 'MMMM yyyy')
              : `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/jobs/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Job
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      {view === 'month' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {monthDays.map((day, idx) => {
              const dayJobs = getJobsForDate(day)
              const isToday = isSameDay(day, new Date())
              const isCurrentMonth = isSameMonth(day, currentDate)

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] p-2 border-b border-r border-gray-100 ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday 
                      ? 'w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center' 
                      : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayJobs.slice(0, 3).map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="block px-2 py-1 text-xs rounded truncate hover:opacity-80"
                        style={{ backgroundColor: job.color + '20', color: job.color }}
                      >
                        {formatTime(job.scheduled_time)} {job.title}
                      </Link>
                    ))}
                    {dayJobs.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayJobs.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-gray-100">
            <div className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50"></div>
            {weekDays.map((day, idx) => {
              const isToday = isSameDay(day, new Date())
              return (
                <div key={idx} className={`p-3 text-center border-l border-gray-100 ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="text-sm font-medium text-gray-500">{format(day, 'EEE')}</div>
                  <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {format(day, 'd')}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-8" style={{ minHeight: '600px' }}>
            {/* Time Labels */}
            <div className="border-r border-gray-100">
              {timeSlots.map((hour) => (
                <div key={hour} className="h-16 px-2 py-1 text-right text-xs text-gray-500 border-b border-gray-100">
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((day, dayIdx) => {
              const dayJobs = getJobsForDate(day)
              const isToday = isSameDay(day, new Date())

              return (
                <div key={dayIdx} className={`border-r border-gray-100 relative ${isToday ? 'bg-blue-50/30' : ''}`}>
                  {timeSlots.map((hour) => (
                    <div key={hour} className="h-16 border-b border-gray-100"></div>
                  ))}
                  
                  {/* Job Blocks */}
                  {dayJobs.map((job) => {
                    const [startHour, startMin] = job.scheduled_time.split(':').map(Number)
                    const [endHour, endMin] = job.end_time.split(':').map(Number)
                    const top = (startHour - 7) * 64 + (startMin / 60) * 64
                    const height = ((endHour - startHour) * 60 + (endMin - startMin)) / 60 * 64

                    return (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="absolute left-1 right-1 rounded-lg p-2 text-white text-xs overflow-hidden hover:opacity-90 transition-opacity"
                        style={{ 
                          backgroundColor: job.color,
                          top: `${top}px`,
                          height: `${height}px`,
                          minHeight: '32px'
                        }}
                      >
                        <div className="font-medium truncate">{job.title}</div>
                        <div className="truncate opacity-80">{job.customer_name}</div>
                      </Link>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {jobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CalendarIcon className="mx-auto mb-2 text-gray-300" size={40} />
                <p>No scheduled jobs</p>
              </div>
            ) : (
              jobs
                .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date) || a.scheduled_time.localeCompare(b.scheduled_time))
                .map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: job.color }}
                    />
                    <div className="w-24 text-center">
                      <p className="font-semibold text-gray-900">
                        {format(parseISO(job.scheduled_date), 'MMM d')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(job.scheduled_time)}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{job.title}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{job.customer_name}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {job.customer_address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{job.assigned_to.join(', ')}</span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </Link>
                ))
            )}
          </div>
        </div>
      )}

      {view === 'day' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {getJobsForDate(currentDate).length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CalendarIcon className="mx-auto mb-2 text-gray-300" size={40} />
                <p>No jobs scheduled for this day</p>
                <Link href="/jobs/new" className="text-blue-600 hover:underline text-sm">
                  Schedule a job
                </Link>
              </div>
            ) : (
              getJobsForDate(currentDate)
                .sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time))
                .map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-1 h-16 rounded-full"
                      style={{ backgroundColor: job.color }}
                    />
                    <div className="w-32">
                      <p className="font-semibold text-gray-900">
                        {formatTime(job.scheduled_time)}
                      </p>
                      <p className="text-sm text-gray-500">
                        to {formatTime(job.end_time)}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.customer_name}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {job.customer_address}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </Link>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
