'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'

const CheckIcon = () => (
  <svg width="56" height="56" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function BookingConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const orgName    = searchParams.get('orgName')    || 'Авангард'
  const orgAddress = searchParams.get('orgAddress') || 'Походный проезд, д. 10'
  const day        = searchParams.get('day')        || 'today'
  const time       = searchParams.get('time')       || '19:10'
  const totalPrice    = searchParams.get('totalPrice')    || '0'
  const totalDuration = searchParams.get('totalDuration') || '0'

  let works = []
  try { works = JSON.parse(searchParams.get('works') || '[]') } catch {}

  const dayLabel = day === 'today' ? 'сегодня' : 'завтра'

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar title="ЗАПИСЬ ПОДТВЕРЖДЕНА" />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '40px 24px',
      }}>
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(26,86,219,0.3)',
        }}>
          <CheckIcon />
        </div>
        <p style={{
          fontSize: '20px', fontWeight: 700,
          fontFamily: 'var(--font-brand)',
          color: 'var(--text)', textAlign: 'center',
          lineHeight: 1.4, marginBottom: '32px',
          letterSpacing: '0.01em',
        }}>
          Ждем Вас {dayLabel} в {time}{'\n'}в {orgName} по адресу:{'\n'}{orgAddress}
        </p>
        <div style={{
          width: '100%', padding: '16px',
          background: '#f9fafb', borderRadius: '14px',
          border: '1px solid var(--border)', marginBottom: '24px',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Состав записи
          </div>
          {works.map((w, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '13px', marginBottom: '6px',
            }}>
              <span style={{ color: 'var(--text)' }}>{w.code}. {w.name}</span>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: '8px' }}>
                {w.price} RUB
              </span>
            </div>
          ))}
          <div style={{
            borderTop: '1px solid var(--border)', marginTop: '10px', paddingTop: '10px',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Итого:</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
              {totalPrice} RUB · {totalDuration} мин
            </span>
          </div>
        </div>
        <div style={{
          width: '100%', padding: '12px 16px',
          background: '#fef3c7', borderRadius: '10px',
          border: '1px solid #fcd34d', marginBottom: '32px',
        }}>
          <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5, margin: 0 }}>
            ⚠️ Подтверждение записи осуществляется по телефону. Ожидайте звонка от организации.
          </p>
        </div>
        <button
          onClick={() => router.push('/select-role')}
          style={{
            width: '100%', padding: '16px',
            background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: '12px',
            fontFamily: 'var(--font-brand)', fontSize: '17px',
            fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer',
          }}
        >
          НА ГЛАВНУЮ
        </button>
      </div>
    </div>
  )
}
