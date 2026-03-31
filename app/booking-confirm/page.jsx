'use client'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'
import { apiClient } from '@/lib/authFetch'

const CheckIcon = () => (
  <svg width="56" height="56" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

function BookingConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const orgName       = searchParams.get('orgName')       || ''
  const orgAddress    = searchParams.get('orgAddress')    || ''
  const day           = searchParams.get('day')           || 'today'
  const time          = searchParams.get('time')          || ''
  const totalPrice    = searchParams.get('totalPrice')    || '0'
  const totalDuration = searchParams.get('totalDuration') || '0'
  const serviceApiId  = searchParams.get('serviceApiId')  || null
  let works = []; try { works = JSON.parse(searchParams.get('works') || '[]') } catch {}

  const [booked, setBooked]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [noCar, setNoCar]     = useState(false)
  const creatingRef = useRef(false)

  const dayLabel = day === 'today' ? 'сегодня' : 'завтра'

  useEffect(() => {
    const createBooking = async () => {
      if (creatingRef.current) return
      creatingRef.current = true
      const svcId = serviceApiId || (works.length > 0 ? works[0].id : null)
      if (!svcId) { setBooked(true); return }

      setLoading(true)
      try {
        let carBrand = ''
        let carWheelDiameter = 16
        try {
          const carsData = await apiClient.get('/cars/')
          const cars = carsData.results || carsData
          if (cars.length === 0) {
            setNoCar(true)
            setBooked(true)
            setLoading(false)
            return
          }
          carBrand = cars[0].brand || ''
          carWheelDiameter = cars[0].wheel_diameter || 16
        } catch {}

        const now = new Date()
        if (day === 'tomorrow') now.setDate(now.getDate() + 1)
        const [hours, minutes] = (time || '10:00').split(':')
        now.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        const pad = n => String(n).padStart(2, '0')
        const scheduledAt = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':00'

        await apiClient.post('/bookings/', {
          service: svcId,
          dateTime: scheduledAt,
          scheduled_at: scheduledAt,
          status: 'NEW',
          carModel: carBrand,
          wheelDiameter: carWheelDiameter,
        })
        setBooked(true)
      } catch (e) {
        setError(e.message)
        setBooked(true)
      } finally { setLoading(false) }
    }
    createBooking()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[14px] text-muted">Создаём запись...</p>
      </div>
    )
  }

  if (noCar) return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
        <div className="text-[40px] mb-3">🚗</div>
        <h2 className="font-brand text-[18px] font-bold text-txt mb-2 tracking-wide">Нет автомобиля</h2>
        <p className="text-[13px] text-muted mb-5">Добавьте хотя бы один автомобиль в личном кабинете, чтобы записаться на услугу</p>
        <button onClick={() => router.push('/profile')}
          className="w-full py-3 bg-primary text-white rounded-xl font-brand text-[15px] font-bold tracking-widest border-none cursor-pointer mb-2">
          ПЕРЕЙТИ В ПРОФИЛЬ
        </button>
        <button onClick={() => router.push('/services')}
          className="w-full py-3 bg-gray-100 text-muted rounded-xl font-brand text-[15px] font-bold tracking-widest border-none cursor-pointer">
          НА ГЛАВНУЮ
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(26,86,219,0.3)]">
        <CheckIcon />
      </div>

      <p className="font-brand text-[20px] font-bold text-txt text-center leading-relaxed mb-8 tracking-wide">
        Ждем Вас {dayLabel} в {time}{'\n'}в {orgName} по адресу:{'\n'}{orgAddress}
      </p>

      <div className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-border mb-6">
        <div className="text-[12px] text-muted font-semibold uppercase tracking-widest mb-2.5">Состав записи</div>
        {works.map((w, i) => (
          <div key={i} className="flex justify-between text-[13px] mb-1.5">
            <span className="text-txt">{w.title || w.name}</span>
            <span className="text-muted shrink-0 ml-2">{w.price} RUB</span>
          </div>
        ))}
        <div className="border-t border-border mt-2.5 pt-2.5 flex justify-between">
          <span className="text-[14px] font-bold text-txt">Итого:</span>
          <span className="text-[14px] font-bold text-primary">{totalPrice} RUB · {totalDuration} мин</span>
        </div>
      </div>

      {error && (
        <div className="w-full px-4 py-3 bg-red-50 rounded-xl border border-red-200 text-[13px] text-red-600 mb-4">
          ⚠ {error}
        </div>
      )}

      <button onClick={() => router.push('/services')}
        className="w-full py-4 bg-primary text-white rounded-xl font-brand text-[17px] font-bold tracking-widest border-none cursor-pointer">
        НА ГЛАВНУЮ
      </button>
    </div>
  )
}

export default function BookingConfirmPage() {
  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar title="ЗАПИСЬ ПОДТВЕРЖДЕНА" hideProfile />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted text-[14px]">Загрузка...</div>}>
        <BookingConfirmContent />
      </Suspense>
      <Footer />
    </div>
  )
}
