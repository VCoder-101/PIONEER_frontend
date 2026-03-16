'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const [codeSent, setCodeSent]     = useState(false)
  const [authType, setAuthType]     = useState('login') // 'login' | 'registration'
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
    setSubmitting(true); setErrors({})
    try {
      const result = await authService.sendEmailCode(email)
      // если бэкенд вернул auth_type — используем его, иначе дефолт
      if (result?.auth_type) setAuthType(result.auth_type)
      setCodeSent(true)
    } catch (e) {
      setErrors({ server: e.message || 'Ошибка отправки кода' })
    } finally { setSubmitting(false) }
  }

  const handleVerify = async () => {
    if (code.length < 4) { setErrors({ code: 'Введите код из письма' }); return }
    if (authType === 'registration' && !userName.trim()) {
      setErrors({ userName: 'Введите имя' }); return
    }
    setSubmitting(true); setErrors({})
    try {
      const data = await authService.verifyEmailCode(email, code)
      login(email, data.token)
      router.push('/services')
    } catch {
      setErrors({ code: 'Неверный код. Попробуйте ещё раз.' })
      setShake(true); setTimeout(() => setShake(false), 500)
    } finally { setSubmitting(false) }
  }

  if (loading) return null

  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar backHref="/select-role" hideProfile />
      <div className="px-6 pt-8 pb-6 flex-1 flex flex-col">

        <h1 className="fade-in font-brand text-[26px] font-bold text-txt tracking-widest text-center mb-8">
          {authType === 'registration' ? 'РЕГИСТРАЦИЯ' : 'ВХОД'}
        </h1>

        <div className={`flex flex-col gap-5 ${shake ? 'shake' : ''}`}>

          {/* Email */}
          <div className="fade-in delay-1">
            <label className="block text-[13px] font-semibold text-txt mb-1.5">Email</label>
            <input type="email" value={email}
              onChange={e => { setEmail(e.target.value); setErrors({}) }}
              placeholder="example@mail.ru" disabled={codeSent}
              className={`w-full px-[14px] py-3 rounded-[10px] text-[15px] text-txt outline-none font-body transition-colors border-[1.5px]
                ${errors.email ? 'border-danger' : 'border-border'} ${codeSent ? 'bg-gray-50' : 'bg-white'}`}
            />
            {errors.email && <p className="fade-in mt-1 text-[12px] text-danger">⚠ {errors.email}</p>}
          </div>

          {/* Имя — только при регистрации */}
          {authType === 'registration' && !codeSent && (
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

          {/* Код */}
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
              <button onClick={handleSendCode}
                className="mt-2 bg-transparent border-none text-primary text-[13px] cursor-pointer underline p-0">
                Отправить код повторно
              </button>
            </div>
          )}

          {/* Ошибка сервера */}
          {errors.server && (
            <div className="fade-in px-[14px] py-2.5 bg-red-50 rounded-lg border border-red-300 text-[13px] text-red-600">
              ❌ {errors.server}
            </div>
          )}

          {/* Кнопка */}
          <div className="fade-in delay-2">
            <Button fullWidth onClick={codeSent ? handleVerify : handleSendCode} disabled={submitting}
              className="py-4 text-[16px] font-brand tracking-widest">
              {submitting ? 'ЗАГРУЗКА...' : codeSent ? (authType === 'registration' ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ВОЙТИ') : 'ПОЛУЧИТЬ КОД'}
            </Button>
          </div>

          {/* Ссылка на регистрацию — только в режиме входа */}
          {!codeSent && authType === 'login' && (
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
