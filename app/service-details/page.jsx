'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
const MOCK_WORKS = {
  wash: [
    { id: 1, code: '01', name: 'Мойка днища',              price: 200, duration: 15 },
    { id: 2, code: '02', name: 'Мойка двигателя',          price: 250, duration: 15 },
    { id: 3, code: '03', name: 'Уборка салона пылесосом',  price: 100, duration: 10 },
    { id: 4, code: '04', name: 'Комплексная мойка',        price: 600, duration: 40 },
    { id: 5, code: '05', name: 'Мойка радиатора',          price: 100, duration: 10 },
    { id: 6, code: '06', name: 'Бесконтактная мойка',      price: 200, duration: 15 },
    { id: 7, code: '07', name: 'Мойка с полировкой воском',price: 400, duration: 20 },
    { id: 8, code: '08', name: 'Мойка с чисткой салона',   price: 350, duration: 20 },
    { id: 9, code: '09', name: 'Евромойка',                price: 700, duration: 45 },
  ],
  tire: [
    { id: 1, code: '01', name: 'Снятие/установка колеса R13', price: 150, duration: 10 },
    { id: 2, code: '02', name: 'Снятие/установка колеса R14', price: 160, duration: 10 },
    { id: 3, code: '03', name: 'Снятие/установка колеса R15', price: 180, duration: 10 },
    { id: 4, code: '04', name: 'Снятие/установка колеса R16', price: 200, duration: 15 },
    { id: 5, code: '05', name: 'Балансировка колеса',         price: 120, duration: 10 },
    { id: 6, code: '06', name: 'Ремонт прокола',             price: 250, duration: 20 },
    { id: 7, code: '07', name: 'Сезонное хранение шин',      price: 500, duration: 15 },
  ],
}

export default function ServiceDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const serviceId  = searchParams.get('service')   || 'wash'
  const orgId      = searchParams.get('orgId')      || '1'
  const orgName    = searchParams.get('orgName')    || 'Авангард'
  const orgAddress = searchParams.get('orgAddress') || 'Походный проезд, д. 10'

  const works = MOCK_WORKS[serviceId] || MOCK_WORKS.wash
  const serviceLabel = serviceId === 'wash' ? 'МОЙКА' : 'ШИНОМОНТАЖ'

  const [checked, setChecked] = useState({})

  const toggle = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }
  const totalPrice    = works.filter(w => checked[w.id]).reduce((s, w) => s + w.price, 0)
  const totalDuration = works.filter(w => checked[w.id]).reduce((s, w) => s + w.duration, 0)

  const selectedWorks = works.filter(w => checked[w.id])

  const handleNext = () => {
    const params = new URLSearchParams({
      service:    serviceId,
      orgId,
      orgName,
      orgAddress,
      works:      JSON.stringify(selectedWorks),
      totalPrice: totalPrice.toString(),
      totalDuration: totalDuration.toString(),
    })
    router.push(`/booking-time?${params.toString()}`)
  }

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#fff" }}>
      <TopBar backHref={`/organizations?service=${serviceId}`} title="СОСТАВ УСЛУГИ" />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{
            fontFamily: 'var(--font-brand)', fontSize: '18px',
            fontWeight: 700, color: 'var(--text)', letterSpacing: '0.02em',
          }}>
            {serviceLabel}. {orgName}
          </h2>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', marginBottom: '16px',
          background: totalPrice > 0 ? 'var(--primary-light)' : '#f9fafb',
          borderRadius: '10px',
          border: `1px solid ${totalPrice > 0 ? 'var(--primary)' : 'var(--border)'}`,
          transition: 'all 0.2s',
        }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Итого:
          </span>
          <span style={{
            fontSize: '18px', fontWeight: 700,
            color: totalPrice > 0 ? 'var(--primary)' : 'var(--text-muted)',
            fontFamily: 'var(--font-brand)',
          }}>
            {totalPrice} RUB
          </span>
        </div>
        <div style={{
          flex: 1, overflowY: 'auto',
          border: '1px solid var(--border)', borderRadius: '12px',
          marginBottom: '16px',
        }}>
          {works.map((work, idx) => (
            <label
              key={work.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '14px 16px',
                borderBottom: idx < works.length - 1 ? '1px solid var(--border)' : 'none',
                background: checked[work.id] ? 'var(--primary-light)' : '#fff',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              <input
                type="checkbox"
                checked={!!checked[work.id]}
                onChange={() => toggle(work.id)}
                style={{
                  width: '18px', height: '18px', marginTop: '2px',
                  accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px', fontWeight: 600,
                  color: checked[work.id] ? 'var(--primary)' : 'var(--text)',
                }}>
                  {work.code}. {work.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {work.price} RUB, {work.duration} мин
                </div>
              </div>
            </label>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={selectedWorks.length === 0}
          style={{
            width: '100%', padding: '16px',
            background: selectedWorks.length > 0 ? 'var(--primary)' : '#e5e7eb',
            color: selectedWorks.length > 0 ? '#fff' : '#9ca3af',
            border: 'none', borderRadius: '12px',
            fontFamily: 'var(--font-brand)', fontSize: '17px',
            fontWeight: 700, letterSpacing: '0.04em',
            cursor: selectedWorks.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          ВЫБРАТЬ {selectedWorks.length > 0 ? `(${selectedWorks.length})` : ''}
        </button>

        {selectedWorks.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
            Выберите хотя бы одну услугу
          </p>
        )}
      </div>
    </div>
  )
}
