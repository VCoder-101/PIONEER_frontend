'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'

const services = [
  { id: 'wash', title: 'МОЙКА', description: 'Выбор условий мойки', icon: '🚿', color: '#1a56db', bg: '#e8effc', border: '#c3d4f7' },
  { id: 'tire', title: 'ШИНОМОНТАЖ', description: 'Выбор радиуса колеса', icon: '🔧', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
]

export default function ServicesPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('wash')

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar title="УСЛУГИ" />

      <div style={{ padding: '24px 20px', flex: 1 }}>
        <p className="fade-in" style={{
          fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px',
          textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500,
        }}>
          Выберите услугу
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {services.map((s, idx) => (
            <label key={s.id} className={`fade-in delay-${idx + 1}`} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '18px 16px', borderRadius: '14px',
              border: `1.5px solid ${selected === s.id ? s.border : 'var(--border)'}`,
              background: selected === s.id ? s.bg : '#fff',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <input type="radio" name="service" value={s.id} checked={selected === s.id}
                onChange={() => setSelected(s.id)}
                style={{ accentColor: s.color, width: '18px', height: '18px', flexShrink: 0 }} />
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: s.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                border: `1px solid ${s.border}`,
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-brand)', fontSize: '18px', fontWeight: 700, letterSpacing: '0.04em', color: s.color }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.description}</div>
              </div>
            </label>
          ))}
        </div>

        <button className="delay-3 fade-in"
          onClick={() => router.push(`/organizations?service=${selected}`)}
          style={{
            width: '100%', padding: '16px',
            background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: '12px',
            fontFamily: 'var(--font-brand)', fontSize: '17px',
            fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer',
          }}>
          ВЫБРАТЬ УСЛУГУ
        </button>
      </div>
    </div>
  )
}
