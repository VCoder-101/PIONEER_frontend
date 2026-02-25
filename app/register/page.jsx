'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PhoneInput from '@/components/ui/PhoneInput'
import SmsInput from '@/components/ui/SmsInput'
import Button from '@/components/ui/Button'
import TopBar from '@/components/ui/TopBar'
import { useAuth } from '@/hooks/useAuth'

const DEMO_CODE = '4444'

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()

  const [phone, setPhone] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [shakePhone, setShakePhone] = useState(false)
  const [shakeSms, setShakeSms] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/services')
  }, [user, loading])

  const phoneComplete = phone.replace(/\D/g, '').length === 11
  const canGetCode = phoneComplete && agreed

  const handleGetCode = () => {    if (!phoneComplete) {
      setPhoneError('Введите корректный номер телефона')
      setShakePhone(true)
      setTimeout(() => setShakePhone(false), 500)
      return
    }
    if (!agreed) {
      setPhoneError('Примите условия политики конфиденциальности')
      return
    }
    setPhoneError('')
    setSmsCode('')
    setError('')
    setCodeSent(true)
  }

  const handleSmsChange = (val) => {
    setSmsCode(val)
    setError('')

    if (val.length === 4) {
      if (val === DEMO_CODE) {
        login(phone)
        setTimeout(() => router.push('/services'), 400)
      } else {
        setError('Неверный код. Попробуйте ещё раз.')
        setShakeSms(true)
        setTimeout(() => setShakeSms(false), 500)
      }
    }
  }

  const handlePhoneChange = (val) => {
    setPhone(val)
    if (phoneError) setPhoneError('')
  }

  if (loading) return null

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar backHref="/select-role" />

      <div style={{ padding: '32px 24px', flex: 1 }}>
        <h1 className="fade-in" style={{
          fontFamily: 'var(--font-brand)', fontSize: '26px', fontWeight: 700,
          color: 'var(--text)', letterSpacing: '0.04em',
          marginBottom: '32px', textAlign: 'center',
        }}>
          РЕГИСТРАЦИЯ
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className={`delay-1 fade-in ${shakePhone ? 'shake' : ''}`}>
            <PhoneInput value={phone} onChange={handlePhoneChange} />
            {phoneError && (
              <div className="fade-in" style={{
                marginTop: '6px', fontSize: '12px', color: 'var(--danger)',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                ⚠ {phoneError}
              </div>
            )}
          </div>
          {codeSent && (
            <div className={`fade-in ${shakeSms ? 'shake' : ''}`}>
              <SmsInput value={smsCode} onChange={handleSmsChange} />

              {error && (
                <div className="fade-in" style={{
                  marginTop: '8px', padding: '10px 14px',
                  background: '#fef2f2', borderRadius: '8px',
                  border: '1px solid #fca5a5',
                  fontSize: '13px', color: '#dc2626',
                }}>
                  ❌ {error}
                </div>
              )}

              {smsCode.length === 4 && !error && (
                <p className="fade-in" style={{ marginTop: '8px', fontSize: '13px', color: 'var(--success)', textAlign: 'center' }}>
                  ✓ Входим...
                </p>
              )}

              <button onClick={handleGetCode} style={{
                marginTop: '10px', background: 'none', border: 'none',
                color: 'var(--primary)', fontSize: '13px', cursor: 'pointer',
                textDecoration: 'underline', padding: 0,
              }}>
                Отправить код повторно
              </button>
            </div>
          )}
          <label className="delay-2 fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox" checked={agreed}
              onChange={e => { setAgreed(e.target.checked); setPhoneError('') }}
              style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Принимаю условия{' '}
              <Link href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                политики конфиденциальности
              </Link>
            </span>
          </label>

          <div className="delay-3 fade-in">
            <Button fullWidth onClick={handleGetCode} disabled={!canGetCode}
              style={{ marginTop: '8px', padding: '16px', fontSize: '16px' }}>
              {codeSent ? 'ОТПРАВИТЬ КОД ПОВТОРНО' : 'ПОЛУЧИТЬ КОД'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
