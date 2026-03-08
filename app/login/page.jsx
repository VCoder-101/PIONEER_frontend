'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopBar from '@/components/ui/TopBar'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()

  const [email, setEmail]           = useState('')
  const [code, setCode]             = useState('')
  const [codeSent, setCodeSent]     = useState(false)
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [shake, setShake]           = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/services')
  }, [user, loading])

  const validateEmail = () => {
    if (!email.trim()) return 'Введите email'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email'
    return null
  }

  const handleSendCode = async () => {
    const emailErr = validateEmail()
    if (emailErr) {
      setErrors({ email: emailErr })
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      await authService.sendEmailCode(email)
      setCodeSent(true)
    } catch (err) {
      setErrors({ server: err.message || 'Ошибка отправки кода' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerify = async () => {
    if (code.length < 4) {
      setErrors({ code: 'Введите код из письма' })
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      const data = await authService.verifyEmailCode(email, code)
      login(email, data.token)
      router.push('/services')
    } catch (err) {
      setErrors({ code: 'Неверный код. Попробуйте ещё раз.' })
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar backHref="/select-role" />

      <div style={{ padding: '32px 24px', flex: 1 }}>
        <h1 className="fade-in" style={{
          fontFamily: 'var(--font-brand)', fontSize: '26px', fontWeight: 700,
          color: 'var(--text)', letterSpacing: '0.04em',
          marginBottom: '8px', textAlign: 'center',
        }}>
          ВХОД
        </h1>
        <p className="fade-in" style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Нет аккаунта?{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Зарегистрироваться
          </Link>
        </p>

        <div className={shake ? 'shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Email */}
          <div className="fade-in delay-1">
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors({}) }}
              placeholder="example@mail.ru"
              disabled={codeSent}
              style={{
                width: '100%', padding: '12px 14px',
                border: `1.5px solid ${errors.email ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: '10px', fontSize: '15px',
                outline: 'none', color: 'var(--text)',
                background: codeSent ? '#f9fafb' : '#fff',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.2s',
              }}
            />
            {errors.email && (
              <div className="fade-in" style={{ marginTop: '5px', fontSize: '12px', color: 'var(--danger)' }}>
                ⚠ {errors.email}
              </div>
            )}
          </div>

          {/* Код из письма */}
          {codeSent && (
            <div className="fade-in">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                Код из письма
              </label>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Мы отправили код на {email}
              </p>
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}) }}
                placeholder="Введите код"
                maxLength={6}
                style={{
                  width: '100%', padding: '12px 14px',
                  border: `1.5px solid ${errors.code ? 'var(--danger)' : 'var(--border)'}`,
                  borderRadius: '10px', fontSize: '22px',
                  outline: 'none', color: 'var(--text)',
                  letterSpacing: '0.3em', textAlign: 'center',
                  fontFamily: 'var(--font-brand)',
                  transition: 'border-color 0.2s',
                }}
              />
              {errors.code && (
                <div className="fade-in" style={{ marginTop: '5px', fontSize: '12px', color: 'var(--danger)' }}>
                  ⚠ {errors.code}
                </div>
              )}
              <button
                onClick={handleSendCode}
                style={{
                  marginTop: '8px', background: 'none', border: 'none',
                  color: 'var(--primary)', fontSize: '13px',
                  cursor: 'pointer', textDecoration: 'underline', padding: 0,
                }}
              >
                Отправить код повторно
              </button>
            </div>
          )}

          {/* Ошибка сервера */}
          {errors.server && (
            <div className="fade-in" style={{
              padding: '10px 14px', background: '#fef2f2',
              borderRadius: '8px', border: '1px solid #fca5a5',
              fontSize: '13px', color: '#dc2626',
            }}>
              ❌ {errors.server}
            </div>
          )}

          {/* Кнопка */}
          <div className="fade-in delay-2">
            <Button
              fullWidth
              onClick={codeSent ? handleVerify : handleSendCode}
              disabled={submitting}
              style={{ padding: '16px', fontSize: '16px' }}
            >
              {submitting ? 'ЗАГРУЗКА...' : codeSent ? 'ВОЙТИ' : 'ПОЛУЧИТЬ КОД'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
