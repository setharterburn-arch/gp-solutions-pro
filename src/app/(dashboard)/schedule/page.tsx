'use client'

import { useState, useEffect, useRef } from 'react'
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
  User,
  GripVertical
} from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, parseISO, addDays } from 'date-fns'
import { formatTime, getStatusColor, getPriorityColor } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

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
  const [draggedJob, setDraggedJob] = useState<ScheduledJob | null>(null)
  const [dropTarget, setDropTarget] = useState<{ date: string; time?: string } | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        // Get date range based on current view
        let startDate: string, endDate: string
        
        if (view === 'month') {
          const start = startOfMonth(currentDate)
          const end = endOfMonth(currentDate)
          startDate = format(start, 'yyyy-MM-dd')
          endDate = format(end, 'yyyy-MM-dd')
        } else if (view === 'week') {
          const start = startOfWeek(currentDate)
          const end = endOfWeek(currentDate)
          startDate = format(start, 'yyyy-MM-dd')
          endDate = format(end, 'yyyy-MM-dd')
        } else {
          startDate = format(currentDate, 'yyyy-MM-dd')
          endDate = format(currentDate, 'yyyy-MM-dd')
        }

        const { data, error } = await supabase
          .from('jobs')
          .select(`
            id, title, scheduled_date, scheduled_time, end_time, status, priority, assigned_to,
            customers (name, address, city, state)
          `)
          .gte('scheduled_date', startDate)
          .lte('scheduled_date', endDate)
          .not('status', 'eq', 'cancelled')
          .order('scheduled_date')
          .order('scheduled_time')

        if (error) throw error

        const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4']
        
        const formattedJobs = (data || []).map((job: any, index: number) => ({
          id: job.id,
          title: job.title,
          customer_name: job.customers?.name || 'Unknown',
          customer_address: [job.customers?.address, job.customers?.city, job.customers?.state].filter(Boolean).join(', '),
          scheduled_date: job.scheduled_date,
          scheduled_time: job.scheduled_time || '09:00',
          end_time: job.end_time || '',
          status: job.status,
          priority: job.priority,
          assigned_to: job.assigned_to || [],
          color: colors[index % colors.length]
        }))

        setJobs(formattedJobs)
      } catch (error) {
        console.error('Error fetching schedule:', error)
      }
    }

    fetchJobs()
  }, [currentDate, view])

  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
    } else if (view === 'day') {
      setCurrentDate(direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1))
    } else {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
    }
  }

  const goToToday = () => setCurrentDate(new Date())

  const getJobsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return jobs.filter(job => job.scheduled_date === dateStr)
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, job: ScheduledJob) => {
    setDraggedJob(job)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, date: string, time?: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTarget({ date, time })
  }

  const handleDragLeave = () => {
    setDropTarget(null)
  }

  const handleDrop = (e: React.DragEvent, date: string, time?: string) => {
    e.preventDefault()
    if (draggedJob) {
      setJobs(jobs.map(job => 
        job.id === draggedJob.id 
          ? { 
              ...job, 
              scheduled_date: date,
              scheduled_time: time || job.scheduled_time
            } 
          : job
      ))
      // TODO: API call to update job
    }
    setDraggedJob(null)
    setDropTarget(null)
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
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500">
            {view === 'month' 
              ? format(currentDate, 'MMMM yyyy')
              : view === 'day'
              ? format(currentDate, 'EEEE, MMMM d, yyyy')
              : `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
            }
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span className="sm:inline">New Job</span>
        </Link>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
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
            {(['day', 'week', 'month', 'list'] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drag & Drop Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
        💡 <strong>Drag & drop</strong> jobs to reschedule them
      </div>

      {/* Month View with Drag & Drop */}
      {view === 'month' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 lg:p-3 text-center text-xs lg:text-sm font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {monthDays.map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const dayJobs = getJobsForDate(day)
              const isToday = isSameDay(day, new Date())
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isDropTarget = dropTarget?.date === dateStr

              return (
                <div
                  key={idx}
                  className={`min-h-[80px] lg:min-h-[100px] p-1 lg:p-2 border-b border-r border-gray-100 transition-colors ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  } ${isDropTarget ? 'bg-blue-50 ring-2 ring-blue-400 ring-inset' : ''}`}
                  onDragOver={(e) => handleDragOver(e, dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dateStr)}
                >
                  <div className={`text-xs lg:text-sm font-medium mb-1 ${
                    isToday 
                      ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center' 
                      : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayJobs.slice(0, 2).map((job) => (
                      <div
                        key={job.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, job)}
                        className="group px-1.5 py-0.5 text-xs rounded truncate cursor-move hover:opacity-80 flex items-center gap-1"
                        style={{ backgroundColor: job.color + '20', color: job.color }}
                      >
                        <GripVertical size={10} className="opacity-0 group-hover:opacity-100" />
                        <span className="truncate">{job.title}</span>
                      </div>
                    ))}
                    {dayJobs.length > 2 && (
                      <div className="text-xs text-gray-500 px-1">
                        +{dayJobs.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Week View with Drag & Drop */}
      {view === 'week' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="min-w-[800px]">
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

            <div className="grid grid-cols-8" style={{ minHeight: '500px' }}>
              <div className="border-r border-gray-100">
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-14 px-2 py-1 text-right text-xs text-gray-500 border-b border-gray-100">
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                  </div>
                ))}
              </div>

              {weekDays.map((day, dayIdx) => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const dayJobs = getJobsForDate(day)
                const isToday = isSameDay(day, new Date())

                return (
                  <div key={dayIdx} className={`border-r border-gray-100 relative ${isToday ? 'bg-blue-50/30' : ''}`}>
                    {timeSlots.map((hour) => {
                      const timeStr = `${hour.toString().padStart(2, '0')}:00`
                      const isDropTarget2 = dropTarget?.date === dateStr && dropTarget?.time === timeStr
                      return (
                        <div 
                          key={hour} 
                          className={`h-14 border-b border-gray-100 transition-colors ${isDropTarget2 ? 'bg-blue-100' : ''}`}
                          onDragOver={(e) => handleDragOver(e, dateStr, timeStr)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, dateStr, timeStr)}
                        />
                      )
                    })}
                    
                    {dayJobs.map((job) => {
                      const [startHour, startMin] = job.scheduled_time.split(':').map(Number)
                      const [endHour, endMin] = job.end_time.split(':').map(Number)
                      const top = (startHour - 7) * 56 + (startMin / 60) * 56
                      const height = Math.max(((endHour - startHour) * 60 + (endMin - startMin)) / 60 * 56, 28)

                      return (
                        <Link
                          key={job.id}
                          href={`/jobs/${job.id}`}
                          draggable
                          onDragStart={(e) => { e.preventDefault(); handleDragStart(e as any, job) }}
                          className="absolute left-1 right-1 rounded-lg p-1.5 text-white text-xs overflow-hidden hover:opacity-90 transition-opacity cursor-move"
                          style={{ 
                            backgroundColor: job.color,
                            top: `${top}px`,
                            height: `${height}px`,
                            minHeight: '28px'
                          }}
                        >
                          <div className="font-medium truncate">{job.title}</div>
                          {height > 40 && <div className="truncate opacity-80">{job.customer_name}</div>}
                        </Link>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Day View */}
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
                    <div className="w-24 lg:w-32">
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

      {/* List View */}
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
                    className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-1 h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: job.color }}
                    />
                    <div className="w-16 lg:w-24 text-center flex-shrink-0">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">
                        {format(parseISO(job.scheduled_date), 'MMM d')}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {formatTime(job.scheduled_time)}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate text-sm lg:text-base">{job.title}</p>
                        <span className={`hidden sm:inline px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{job.customer_name}</p>
                    </div>
                    <span className={`px-2 lg:px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
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
