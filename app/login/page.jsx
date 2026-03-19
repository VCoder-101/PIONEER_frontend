'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()

  const [email, setEmail]           = useState('')
  const [code, setCode]             = useState('')
  const [userName, setUserName]     = useState('')
  const [agreed, setAgreed]         = useState(false)
  const [codeSent, setCodeSent]     = useState(false)
  const [authType, setAuthType]     = useState('login')
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [shake, setShake]           = useState(false)

  useEffect(() => { if (!loading && user) router.replace('/services') }, [user, loading])

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500) }

  const isRegistration = authType === 'registration' || authType === 'complete_registration'

  const handleSendCode = async () => {
    if (!email.trim()) { setErrors({ email: 'Введите email' }); triggerShake(); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrors({ email: 'Некорректный email' }); triggerShake(); return }
    setSubmitting(true); setErrors({})
    try {
      const result = await authService.sendEmailCode(email)
      const type = result?.auth_type || 'login'
      setAuthType(type)
      setCodeSent(true)
    } catch (e) {
      setErrors({ server: e.message || 'Ошибка отправки кода' })
    } finally { setSubmitting(false) }
  }

  const handleVerify = async () => {
    if (isRegistration && !userName.trim()) { setErrors({ userName: 'Введите ваше имя' }); triggerShake(); return }
    if (isRegistration && !agreed) { setErrors({ agreed: 'Примите условия политики конфиденциальности' }); triggerShake(); return }
    if (code.length < 4) { setErrors({ code: 'Введите код из письма' }); triggerShake(); return }
    setSubmitting(true); setErrors({})
    try {
      const data = await authService.verifyEmailCode(email, code, isRegistration ? userName : '')
      login(email, data)
      router.push('/services')
    } catch (e) {
      setErrors({ code: e.message || 'Неверный код. Попробуйте ещё раз.' })
      triggerShake()
    } finally { setSubmitting(false) }
  }

  if (loading) return null

  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar backHref="/select-role" hideProfile />
      <div className="px-6 pt-8 pb-6 flex-1 flex flex-col">
        <h1 className="fade-in font-brand text-[26px] font-bold text-txt tracking-widest text-center mb-8">
          {isRegistration ? 'РЕГИСТРАЦИЯ' : 'ВХОД'}
        </h1>

        <div className={`flex flex-col gap-5 ${shake ? 'shake' : ''}`}>

          {/* Email */}
          <div className="fade-in">
            <label className="block text-[13px] font-semibold text-txt mb-1.5">Email</label>
            <input type="email" value={email}
              onChange={e => { setEmail(e.target.value); setErrors({}) }}
              placeholder="example@mail.ru" disabled={codeSent}
              className={`w-full px-[14px] py-3 rounded-[10px] text-[15px] text-txt outline-none font-body transition-colors border-[1.5px]
                ${errors.email ? 'border-danger' : 'border-border'} ${codeSent ? 'bg-gray-50' : 'bg-white'}`}
            />
            {errors.email && <p className="fade-in mt-1 text-[12px] text-danger">⚠ {errors.email}</p>}
          </div>

          {/* Имя — появляется при регистрации после отправки кода */}
          {isRegistration && codeSent && (
            <div className="fade-in">
              <label className="block text-[13px] font-semibold text-txt mb-1.5">Ваше имя</label>
              <input type="text" value={userName}
                onChange={e => { setUserName(e.target.value); setErrors({}) }}
                placeholder="Имя"
                className={`w-full px-[14px] py-3 rounded-[10px] text-[15px] text-txt outline-none font-body transition-colors border-[1.5px]
                  ${errors.userName ? 'border-danger' : 'border-border'}`}
              />
              {errors.userName && <p className="fade-in mt-1 text-[12px] text-danger">⚠ {errors.userName}</p>}
            </div>
          )}

          {/* Код — появляется после отправки */}
          {codeSent && (
            <div className="fade-in">
              <label className="block text-[13px] font-semibold text-txt mb-1.5">Код из письма</label>
              <p className="text-[12px] text-muted mb-2.5">Мы отправили код на {email}</p>
              <input type="text" value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}) }}
                placeholder="Введите код" maxLength={6}
                className={`w-full px-[14px] py-3 rounded-[10px] text-[22px] text-txt outline-none font-brand tracking-[0.3em] text-center transition-colors border-[1.5px]
                  ${errors.code ? 'border-danger' : 'border-border'}`}
              />
              {errors.code && <p className="fade-in mt-1 text-[12px] text-danger">⚠ {errors.code}</p>}
              <button onClick={handleSendCode} className="mt-2 bg-transparent border-none text-primary text-[13px] cursor-pointer underline p-0">
                Отправить код повторно
              </button>
            </div>
          )}

          {/* Галочка — при регистрации после отправки кода */}
          {isRegistration && codeSent && (
            <>
              <label className="fade-in flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors({}) }}
                  className="w-[18px] h-[18px] mt-0.5 accent-primary cursor-pointer shrink-0" />
                <span className="text-[13px] text-muted leading-relaxed">
                  Принимаю условия{' '}
                  <Link href="/privacy" className="text-primary underline">политики конфиденциальности</Link>
                </span>
              </label>
              {errors.agreed && <p className="fade-in -mt-3 text-[12px] text-danger">⚠ {errors.agreed}</p>}
            </>
          )}

          {errors.server && (
            <div className="fade-in px-[14px] py-2.5 bg-red-50 rounded-lg border border-red-300 text-[13px] text-red-600">
              ❌ {errors.server}
            </div>
          )}

          <Button fullWidth onClick={codeSent ? handleVerify : handleSendCode} disabled={submitting}
            className="py-4 text-[16px] font-brand tracking-widest">
            {submitting ? 'ЗАГРУЗКА...' : codeSent ? (isRegistration ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ВОЙТИ') : 'ПОЛУЧИТЬ КОД'}
          </Button>

          {!codeSent && (
            <p className="fade-in text-center text-[13px] text-muted">
              Нет аккаунта?{' '}
              <button onClick={() => router.push('/register')}
                className="text-primary font-semibold bg-transparent border-none cursor-pointer p-0 text-[13px]">
                Зарегистрироваться
              </button>
            </p>
          )}

        </div>
      </div>
      <Footer />
    </div>
  )
}
