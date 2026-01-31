'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  User,
  Phone,
  ExternalLink,
  List,
  Map as MapIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { formatTime, getStatusColor, getPriorityColor } from '@/lib/utils'

interface RouteJob {
  id: string
  title: string
  customer_name: string
  customer_phone: string
  address: string
  lat: number
  lng: number
  scheduled_time: string
  end_time: string
  status: string
  priority: string
  order: number
}

export default function RoutePage() {
  const [jobs, setJobs] = useState<RouteJob[]>([])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [view, setView] = useState<'list' | 'map'>('list')

  useEffect(() => {
    // Mock data - replace with API call
    setJobs([
      {
        id: '1',
        title: 'HVAC Maintenance',
        customer_name: 'John Smith',
        customer_phone: '(555) 123-4567',
        address: '123 Main St, Springfield, IL 62701',
        lat: 39.7817,
        lng: -89.6501,
        scheduled_time: '09:00',
        end_time: '11:00',
        status: 'scheduled',
        priority: 'normal',
        order: 1
      },
      {
        id: '2',
        title: 'AC Repair',
        customer_name: 'Jane Doe',
        customer_phone: '(555) 234-5678',
        address: '456 Oak Ave, Springfield, IL 62702',
        lat: 39.7900,
        lng: -89.6440,
        scheduled_time: '11:30',
        end_time: '13:30',
        status: 'scheduled',
        priority: 'high',
        order: 2
      },
      {
        id: '3',
        title: 'Furnace Inspection',
        customer_name: 'Bob Wilson',
        customer_phone: '(555) 345-6789',
        address: '789 Pine Rd, Springfield, IL 62703',
        lat: 39.7750,
        lng: -89.6600,
        scheduled_time: '14:00',
        end_time: '15:30',
        status: 'scheduled',
        priority: 'normal',
        order: 3
      },
      {
        id: '4',
        title: 'Duct Cleaning',
        customer_name: 'Alice Brown',
        customer_phone: '(555) 456-7890',
        address: '321 Elm St, Springfield, IL 62704',
        lat: 39.7880,
        lng: -89.6700,
        scheduled_time: '16:00',
        end_time: '17:30',
        status: 'scheduled',
        priority: 'low',
        order: 4
      },
    ])
  }, [selectedDate])

  const totalDrivingTime = 45 // minutes - would be calculated from Google Maps API
  const totalJobTime = jobs.reduce((sum, job) => {
    const [startH, startM] = job.scheduled_time.split(':').map(Number)
    const [endH, endM] = job.end_time.split(':').map(Number)
    return sum + (endH - startH) + (endM - startM) / 60
  }, 0)

  const openInGoogleMaps = () => {
    if (jobs.length === 0) return
    
    // Build Google Maps directions URL
    const origin = encodeURIComponent(jobs[0].address)
    const destination = encodeURIComponent(jobs[jobs.length - 1].address)
    const waypoints = jobs.slice(1, -1).map(j => encodeURIComponent(j.address)).join('|')
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Optimization</h1>
          <p className="text-gray-500">Plan your daily route</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${
                view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setView('map')}
              className={`p-2 rounded-md transition-colors ${
                view === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              <MapIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Today's Jobs</p>
          <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Est. Job Time</p>
          <p className="text-2xl font-bold text-gray-900">{totalJobTime.toFixed(1)} hrs</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Est. Drive Time</p>
          <p className="text-2xl font-bold text-gray-900">{totalDrivingTime} min</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <button
            onClick={openInGoogleMaps}
            className="w-full h-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Navigation size={20} />
            Open in Google Maps
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {view === 'list' ? (
        /* Route List */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {jobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MapPin className="mx-auto mb-2 text-gray-300" size={40} />
                <p>No jobs scheduled for this date</p>
                <Link href="/jobs/new" className="text-blue-600 hover:underline text-sm">
                  Schedule a job
                </Link>
              </div>
            ) : (
              jobs.map((job, index) => (
                <div key={job.id} className="flex items-start gap-4 p-4 hover:bg-gray-50">
                  {/* Stop Number */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    {index < jobs.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/jobs/${job.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {job.title}
                      </Link>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                        {job.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(job.scheduled_time)} - {formatTime(job.end_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {job.customer_name}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-1 text-sm text-gray-500">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{job.address}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${job.customer_phone}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Call customer"
                      >
                        <Phone size={16} />
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Navigate"
                      >
                        <Navigation size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Map View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapIcon className="mx-auto mb-2" size={48} />
              <p className="font-medium">Map View</p>
              <p className="text-sm">Integrate with Google Maps API for interactive map</p>
              <button
                onClick={openInGoogleMaps}
                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink size={16} />
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-2">Route Optimization Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Jobs are ordered by scheduled time</li>
          <li>• Drag and drop jobs to reorder (coming soon)</li>
          <li>• Click "Open in Google Maps" for turn-by-turn navigation</li>
          <li>• Allow extra time between jobs for unexpected delays</li>
        </ul>
      </div>
    </div>
  )
}
