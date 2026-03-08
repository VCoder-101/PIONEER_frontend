'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [email, setEmail]           = useState('')
  const [code, setCode]             = useState('')
  const [codeSent, setCodeSent]     = useState(false)
  const [agreed, setAgreed]         = useState(false)
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [shake, setShake]           = useState(false)

  useEffect(() => { if (!loading && user) router.replace('/services') }, [user, loading])

  const validateEmail = () => {
    if (!email.trim()) return 'Введите email'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email'
    return null
  }

  const handleSendCode = async () => {
    const err = validateEmail()
    if (err) { setErrors({ email: err }); setShake(true); setTimeout(() => setShake(false), 500); return }
    if (!agreed) { setErrors({ agreed: 'Примите условия политики конфиденциальности' }); return }
    setSubmitting(true); setErrors({})
    try { await authService.sendEmailCode(email); setCodeSent(true) }
    catch (e) { setErrors({ server: e.message || 'Ошибка отправки кода' }) }
    finally { setSubmitting(false) }
  }

  const handleVerify = async () => {
    if (code.length < 4) { setErrors({ code: 'Введите код из письма' }); return }
    setSubmitting(true); setErrors({})
    try { const data = await authService.verifyEmailCode(email, code); login(email, data.token); router.push('/services') }
    catch { setErrors({ code: 'Неверный код. Попробуйте ещё раз.' }); setShake(true); setTimeout(() => setShake(false), 500) }
    finally { setSubmitting(false) }
  }

  if (loading) return null

  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar backHref="/select-role" />
      <div className="px-6 pt-8 pb-6 flex-1 flex flex-col">
        <h1 className="fade-in font-brand text-[26px] font-bold text-txt tracking-widest text-center mb-2">РЕГИСТРАЦИЯ</h1>
        <p className="fade-in text-center text-[13px] text-muted mb-8">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-primary font-semibold no-underline">Войти</Link>
        </p>
        <div className={`flex flex-col gap-5 ${shake ? 'shake' : ''}`}>
          <div className="fade-in delay-1">
            <label className="block text-[13px] font-semibold text-txt mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors({}) }}
              placeholder="example@mail.ru" disabled={codeSent}
              className={`w-full px-[14px] py-3 rounded-[10px] text-[15px] text-txt outline-none font-body transition-colors border-[1.5px] ${errors.email ? 'border-danger' : 'border-border'} ${codeSent ? 'bg-gray-50' : 'bg-white'}`}
            />
            {errors.email && <p className="fade-in mt-1 text-[12px] text-danger">⚠ {errors.email}</p>}
          </div>

          {codeSent && (
            <div className="fade-in">
              <label className="block text-[13px] font-semibold text-txt mb-1.5">Код из письма</label>
              <input type="text" value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}) }}
                placeholder="Введите код" maxLength={6}
                className={`w-full px-[14px] py-3 rounded-[10px] text-[22px] text-txt outline-none font-brand tracking-[0.3em] text-center transition-colors border-[1.5px] ${errors.code ? 'border-danger' : 'border-border'}`}
              />
              {errors.code && <p className="fade-in mt-1 text-[12px] text-danger">⚠ {errors.code}</p>}
              <button onClick={handleSendCode} className="mt-2 bg-transparent border-none text-primary text-[13px] cursor-pointer underline p-0">
                Отправить код повторно
              </button>
            </div>
          )}

          {!codeSent && (
            <label className="fade-in delay-2 flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors({}) }}
                className="w-[18px] h-[18px] mt-0.5 accent-primary cursor-pointer shrink-0" />
              <span className="text-[13px] text-muted leading-relaxed">
                Принимаю условия{' '}
                <Link href="/privacy" className="text-primary underline">политики конфиденциальности</Link>
              </span>
            </label>
          )}
          {errors.agreed && <p className="fade-in -mt-3 text-[12px] text-danger">⚠ {errors.agreed}</p>}

          {errors.server && (
            <div className="fade-in px-[14px] py-2.5 bg-red-50 rounded-lg border border-red-300 text-[13px] text-red-600">
              ❌ {errors.server}
            </div>
          )}

          <div className="fade-in delay-3">
            <Button fullWidth onClick={codeSent ? handleVerify : handleSendCode} disabled={submitting} className="py-4 text-[16px] font-brand tracking-widest">
              {submitting ? 'ЗАГРУЗКА...' : codeSent ? 'ПОДТВЕРДИТЬ' : 'ПОЛУЧИТЬ КОД'}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
