'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'


const MOCK_SLOTS = {
  today:    ['11:20', '13:40', '15:20', '16:20', '17:30', '18:40', '19:10', '20:30'],
  tomorrow: ['10:00', '11:30', '12:50', '14:10', '15:40', '17:00', '18:20', '19:50'],
}

export default function BookingTimePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const serviceId     = searchParams.get('service')       || 'wash'
  const orgId         = searchParams.get('orgId')         || '1'
  const orgName       = searchParams.get('orgName')       || 'Авангард'
  const orgAddress    = searchParams.get('orgAddress')    || 'Походный проезд, д. 10'
  const totalPrice    = searchParams.get('totalPrice')    || '0'
  const totalDuration = searchParams.get('totalDuration') || '0'

  let works = []
  try { works = JSON.parse(searchParams.get('works') || '[]') } catch {}

  const [day, setDay]       = useState('today')
  const [timeSlot, setTimeSlot] = useState(null)

  const slots = MOCK_SLOTS[day]

  const handleSelect = () => {
    const params = new URLSearchParams({
      service:    serviceId,
      orgName,
      orgAddress,
      day,
      time:       timeSlot,
      totalPrice,
      totalDuration,
      works:      JSON.stringify(works),
    })
    router.push(`/booking-confirm?${params.toString()}`)
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar backHref={`/service-details?service=${serviceId}&orgId=${orgId}&orgName=${encodeURIComponent(orgName)}&orgAddress=${encodeURIComponent(orgAddress)}`} title="ВРЕМЯ ЗАПИСИ" />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontFamily: 'var(--font-brand)', fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
            {orgName}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {orgAddress}
          </div>
        </div>
        <div style={{
          padding: '12px 14px', marginBottom: '16px',
          background: '#f9fafb', borderRadius: '10px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Услуги:
          </div>
          {works.map((w, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '13px', color: 'var(--text)', marginBottom: '4px',
            }}>
              <span>{w.code}. {w.name}</span>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: '8px' }}>
                {w.price} RUB {w.duration} мин
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px',
            display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Итого:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
              {totalPrice} RUB {totalDuration} мин
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[{ id: 'today', label: 'Сегодня' }, { id: 'tomorrow', label: 'Завтра' }].map(d => (
            <button
              key={d.id}
              onClick={() => { setDay(d.id); setTimeSlot(null) }}
              style={{
                flex: 1, padding: '10px',
                borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-brand)', fontSize: '15px', fontWeight: 700,
                letterSpacing: '0.03em',
                background: day === d.id ? 'var(--primary)' : '#f3f4f6',
                color: day === d.id ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.18s',
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          Время записи
        </div>

        <div style={{
          flex: 1, overflowY: 'auto',
          border: '1px solid var(--border)', borderRadius: '12px',
          marginBottom: '16px',
        }}>
          {slots.map((slot, idx) => (
            <label
              key={slot}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px',
                borderBottom: idx < slots.length - 1 ? '1px solid var(--border)' : 'none',
                background: timeSlot === slot ? 'var(--primary-light)' : '#fff',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              <input
                type="radio"
                name="timeslot"
                value={slot}
                checked={timeSlot === slot}
                onChange={() => setTimeSlot(slot)}
                style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', flexShrink: 0 }}
              />
              <span style={{
                fontSize: '16px', fontWeight: timeSlot === slot ? 700 : 400,
                color: timeSlot === slot ? 'var(--primary)' : 'var(--text)',
                fontFamily: 'var(--font-brand)', letterSpacing: '0.04em',
              }}>
                {slot}
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={handleSelect}
          disabled={!timeSlot}
          style={{
            width: '100%', padding: '16px',
            background: timeSlot ? 'var(--primary)' : '#e5e7eb',
            color: timeSlot ? '#fff' : '#9ca3af',
            border: 'none', borderRadius: '12px',
            fontFamily: 'var(--font-brand)', fontSize: '17px',
            fontWeight: 700, letterSpacing: '0.04em',
            cursor: timeSlot ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          ВЫБРАТЬ
        </button>
      </div>
    </div>
  )
}
