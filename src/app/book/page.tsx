'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Wrench
} from 'lucide-react'
import { format, addDays, startOfWeek, addWeeks, isSameDay, isBefore, startOfDay } from 'date-fns'

interface ServiceType {
  id: string
  name: string
  duration: number
  price: number | null
  description: string
}

const serviceTypes: ServiceType[] = [
  { id: '1', name: 'General Service Call', duration: 60, price: null, description: 'Diagnose and assess any HVAC issues' },
  { id: '2', name: 'AC Maintenance', duration: 60, price: 149, description: 'Annual AC tune-up and inspection' },
  { id: '3', name: 'Furnace Maintenance', duration: 60, price: 129, description: 'Annual furnace tune-up and inspection' },
  { id: '4', name: 'AC Repair', duration: 120, price: null, description: 'Repair existing AC unit issues' },
  { id: '5', name: 'Furnace Repair', duration: 120, price: null, description: 'Repair existing furnace issues' },
  { id: '6', name: 'New System Estimate', duration: 90, price: 0, description: 'Free estimate for new HVAC system' },
]

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', 
  '13:00', '14:00', '15:00', '16:00'
]

type Step = 'service' | 'datetime' | 'info' | 'confirm' | 'success'

export default function OnlineBooking() {
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today = startOfDay(new Date())

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setStep('success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              GP
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">GP Solutions</h1>
              <p className="text-sm text-gray-500">Online Booking</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        {step !== 'success' && (
          <div className="flex items-center justify-center mb-8">
            {(['service', 'datetime', 'info', 'confirm'] as Step[]).map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? 'bg-blue-600 text-white' :
                  (['service', 'datetime', 'info', 'confirm'].indexOf(step) > idx) ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {(['service', 'datetime', 'info', 'confirm'].indexOf(step) > idx) ? '✓' : idx + 1}
                </div>
                {idx < 3 && (
                  <div className={`w-12 h-1 mx-1 ${
                    ['service', 'datetime', 'info', 'confirm'].indexOf(step) > idx ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Select Service */}
        {step === 'service' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Service</h2>
            <p className="text-gray-500 mb-6">What can we help you with?</p>
            
            <div className="space-y-3">
              {serviceTypes.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service)
                    setStep('datetime')
                  }}
                  className={`w-full flex items-center gap-4 p-4 border rounded-lg text-left transition-colors hover:border-blue-300 hover:bg-blue-50 ${
                    selectedService?.id === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wrench className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.description}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      ~{service.duration} min
                      {service.price !== null && (
                        <span className="ml-2 text-green-600 font-medium">
                          {service.price === 0 ? 'Free' : `$${service.price}`}
                        </span>
                      )}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 'datetime' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <button
              onClick={() => setStep('service')}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
            <p className="text-gray-500 mb-6">{selectedService?.name}</p>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setWeekStart(addWeeks(weekStart, -1))}
                disabled={isBefore(weekStart, today)}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium text-gray-900">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </span>
              <button
                onClick={() => setWeekStart(addWeeks(weekStart, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {weekDays.map((day) => {
                const isPast = isBefore(day, today)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isToday = isSameDay(day, today)
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => !isPast && setSelectedDate(day)}
                    disabled={isPast}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      isPast ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                      isSelected ? 'bg-blue-600 text-white' :
                      'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                      {format(day, 'EEE')}
                    </p>
                    <p className={`text-lg font-semibold ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {format(day, 'd')}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <>
                <h3 className="font-medium text-gray-900 mb-3">Available Times</h3>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg text-center transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {parseInt(time) > 12 ? `${parseInt(time) - 12}:00 PM` : 
                         parseInt(time) === 12 ? '12:00 PM' : `${parseInt(time)}:00 AM`}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            <button
              onClick={() => setStep('info')}
              disabled={!selectedDate || !selectedTime}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 'info' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <button
              onClick={() => setStep('datetime')}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Information</h2>
            <p className="text-gray-500 mb-6">Please provide your contact details</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP *</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Anything we should know?"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setStep('confirm')}
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zip}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review Booking
            </button>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <button
              onClick={() => setStep('info')}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-6">Confirm Your Booking</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Wrench className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{selectedService?.name}</p>
                  <p className="text-sm text-gray-500">{selectedService?.description}</p>
                  {selectedService && selectedService.price !== null && (
                    <p className="text-sm font-medium text-green-600 mt-1">
                      {selectedService.price === 0 ? 'Free' : `$${selectedService.price}`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedTime && (parseInt(selectedTime) > 12 
                      ? `${parseInt(selectedTime) - 12}:00 PM` 
                      : parseInt(selectedTime) === 12 
                      ? '12:00 PM' 
                      : `${parseInt(selectedTime)}:00 AM`)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p>
                  <p className="text-sm text-gray-500">{formData.email}</p>
                  <p className="text-sm text-gray-500">{formData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{formData.address}</p>
                  <p className="text-sm text-gray-500">{formData.city}, {formData.state} {formData.zip}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">
              We've sent a confirmation email to <strong>{formData.email}</strong>
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="font-medium text-gray-900 mb-2">{selectedService?.name}</p>
              <p className="text-sm text-gray-600">
                {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at{' '}
                {selectedTime && (parseInt(selectedTime) > 12 
                  ? `${parseInt(selectedTime) - 12}:00 PM` 
                  : `${parseInt(selectedTime)}:00 AM`)}
              </p>
              <p className="text-sm text-gray-600">{formData.address}, {formData.city}</p>
            </div>

            <p className="text-sm text-gray-500">
              Need to make changes? Call us at <a href="tel:5559876543" className="text-blue-600">(555) 987-6543</a>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
