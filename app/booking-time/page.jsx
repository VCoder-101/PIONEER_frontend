'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'
import { apiClient } from '@/lib/authFetch'

function BookingTimeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId     = searchParams.get('service')       || 'wash'
  const orgId         = searchParams.get('orgId')         || '1'
  const orgName       = searchParams.get('orgName')       || ''
  const orgAddress    = searchParams.get('orgAddress')    || ''
  const totalPrice    = searchParams.get('totalPrice')    || '0'
  const totalDuration = searchParams.get('totalDuration') || '0'
  const serviceApiId  = searchParams.get('serviceApiId')  || ''
  let works = []; try { works = JSON.parse(searchParams.get('works') || '[]') } catch {}

  const [day, setDay]           = useState('today')
  const [timeSlot, setTimeSlot] = useState(null)
  const [slots, setSlots]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const getDateStr = (d) => {
    const now = new Date()
    if (d === 'tomorrow') now.setDate(now.getDate() + 1)
    const pad = n => String(n).padStart(2, '0')
    return now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate())
  }

  useEffect(() => {
    if (!serviceApiId) return
    setLoading(true)
    setTimeSlot(null)
    setSlots([])
    setError(null)
    apiClient.get(`/organizations/available-slots/for_service/?service_id=${serviceApiId}&date=${getDateStr(day)}`)
      .then(data => setSlots(data.slots || []))
      .catch(() => setError('Не удалось загрузить слоты'))
      .finally(() => setLoading(false))
  }, [day, serviceApiId])

  const handleSelect = () => {
    const params = new URLSearchParams({ service: serviceId, orgName, orgAddress, day, time: timeSlot, totalPrice, totalDuration, works: JSON.stringify(works), serviceApiId })
    router.push(`/booking-confirm?${params.toString()}`)
  }

  const availableSlots = slots.filter(s => s.available)

  return (
    <div className="px-5 py-4 flex-1 flex flex-col">
      <div className="mb-3">
        <div className="font-brand text-[17px] font-bold text-txt">{orgName}</div>
        <div className="text-[13px] text-muted mt-0.5">{orgAddress}</div>
      </div>
      <div className="px-[14px] py-3 mb-4 bg-gray-50 rounded-[10px] border border-border">
        <div className="text-[12px] text-muted font-semibold mb-2">Услуга:</div>
        {works.map((w, i) => (
          <div key={i} className="flex justify-between text-[13px] text-txt mb-1">
            <span>{w.title || w.name}</span>
            <span className="text-muted shrink-0 ml-2">{w.price} RUB {w.duration} мин</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 flex justify-between">
          <span className="text-[13px] font-semibold text-txt">Итого:</span>
          <span className="text-[13px] font-bold text-primary">{totalPrice} RUB {totalDuration} мин</span>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {[{ id: 'today', label: 'Сегодня' }, { id: 'tomorrow', label: 'Завтра' }].map(d => (
          <button key={d.id} onClick={() => { setDay(d.id); setTimeSlot(null) }}
            className={`flex-1 py-2.5 rounded-[10px] border-none cursor-pointer font-brand text-[15px] font-bold tracking-wide transition-all ${day === d.id ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}`}>
            {d.label}
          </button>
        ))}
      </div>
      <div className="text-[12px] text-muted font-semibold uppercase tracking-widest mb-2.5">Время записи</div>

      {loading && <p className="text-[13px] text-muted text-center py-6">Загрузка слотов...</p>}
      {error && <p className="text-[13px] text-danger text-center py-6">⚠ {error}</p>}
      {!loading && !error && availableSlots.length === 0 && (
        <p className="text-[13px] text-muted text-center py-6">Нет доступных слотов на этот день</p>
      )}

      {!loading && availableSlots.length > 0 && (
        <div className="flex-1 overflow-y-auto border border-border rounded-xl mb-4">
          {availableSlots.map((slot, idx) => (
            <label key={slot.time}
              className={`flex items-center gap-3 px-4 py-[14px] cursor-pointer transition-colors ${idx < availableSlots.length - 1 ? 'border-b border-border' : ''} ${timeSlot === slot.time ? 'bg-primary-l' : 'bg-white'}`}>
              <input type="radio" name="timeslot" value={slot.time} checked={timeSlot === slot.time}
                onChange={() => setTimeSlot(slot.time)} className="w-[18px] h-[18px] shrink-0" style={{ accentColor: '#1a56db' }} />
              <span className={`font-brand text-[16px] tracking-widest ${timeSlot === slot.time ? 'text-primary font-bold' : 'text-txt font-normal'}`}>{slot.time}</span>
            </label>
          ))}
        </div>
      )}

      <button onClick={handleSelect} disabled={!timeSlot}
        className={`w-full py-4 rounded-xl font-brand text-[17px] font-bold tracking-widest border-none transition-all ${timeSlot ? 'bg-primary text-white cursor-pointer' : 'bg-border text-muted cursor-not-allowed'}`}>
        ВЫБРАТЬ
      </button>
    </div>
  )
}

export default function BookingTimePage() {
  const searchParams = useSearchParams()
  const serviceId  = searchParams.get('service')    || 'wash'
  const orgId      = searchParams.get('orgId')      || '1'
  const orgName    = searchParams.get('orgName')    || ''
  const orgAddress = searchParams.get('orgAddress') || ''
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted text-[14px]">Загрузка...</div>}>
      <div className="page-enter flex flex-col min-h-screen bg-white">
        <TopBar backHref={`/service-details?service=${serviceId}&orgId=${orgId}&orgName=${encodeURIComponent(orgName)}&orgAddress=${encodeURIComponent(orgAddress)}`} title="ВРЕМЯ ЗАПИСИ" />
        <BookingTimeContent />
        <Footer />
      </div>
    </Suspense>
  )
}