'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopBar from '@/components/ui/TopBar'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import Button from '@/components/ui/Button'
import { Checkbox } from '@/componentsShadCN/ui/checkbox'

export default function LoginPage() {
  const router = useRouter()
  const { userData } = useAuth()
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresStr = "expires=" + expires.toUTCString();
    document.cookie = `${name}=${value}; ${expiresStr}; path=/`;
  }

  useEffect(()=>{
    if (typeof window === 'undefined') return null

    let deviceId = localStorage.getItem('device_id')

    if (!deviceId) {
      const userAgent = navigator.userAgent
      const platform = navigator.platform
      const random = Math.random().toString(36).substring(2)

      deviceId = `${userAgent}-${platform}-${random}`
      localStorage.setItem('device_id', deviceId)
    }

  }, [])

  useEffect(()=>{
    if(userData && userData.length !== 0){
      router.push('/')
    }
  }, [userData])

  const [email, setEmail]           = useState('')
  const [code, setCode]             = useState('')
  const [codeSent, setCodeSent]     = useState(false)
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [shake, setShake]           = useState(false)
  const [authType, setAuthType] = useState('login')
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [policyAccepted, setPolicyAccepted] = useState(false)

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

    const response = await fetch('http://127.0.0.1:8000/api/users/auth/send-code/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "email": email,
          "privacy_policy_accepted": true
        }),
    })
    if(response.status == 400){
        console.log('400', response)
    }else if(response.ok){
        const data = await response.json()
        console.log("OK",data)
        setAuthType(data.auth_type)
        setSubmitting(false)
        setCodeSent(true)
    }else if(!response.ok){
      console.log("NOT OK",response)
    }
  }

  const handleVerify = async () => {
    if (code.length < 4) {
      setErrors({ code: 'Введите код из письма' })
      return
    }
    if (authType == 'registration' && userName == ''){
      setErrors({ userName: 'Введите имя' })
      return
    }
    if (authType == 'registration' && userPhone.length != 10){
      setErrors({ userPhone: 'Проверьте правильность введенного номера' })
      return
    }
    if (authType == 'registration' && !policyAccepted){
      setErrors({ policyAccepted: 'Без вашего согласия мы не сможем с вами работать 🥺' })
      return
    }


    setSubmitting(true)
    setErrors({})

    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
  
    const deviceID = `${userAgent}-${platform}-${randomString}`;

    const response = await fetch('http://localhost:8000/api/users/auth/verify-code/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "name": userName,
          "email": email,
          "code": code,
          "privacy_policy_accepted": policyAccepted,
          "device_id": deviceID,
          "phone": userPhone
        }),
    })
    if(response.ok){
      console.log("OK",response)
      const data = await response.json()
      localStorage.setItem("pioneer_token", data.jwt.access)
      localStorage.setItem("pioneer_refresh_token", data.jwt.refresh)
      setCookie('pioneer_token', data.jwt.access, 7);
      setCookie('pioneer_refresh_token', data.jwt.refresh, 360);
      router.push('/')
    }else if(!response.ok){
      console.log("NOT OK",response)
      setErrors({ code: 'Неверный код. Попробуйте ещё раз.' })
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setSubmitting(false)
    }
  }

  //if (loading) return null

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar backHref="/" />

      <div style={{ padding: '32px 24px', flex: 1 }}>
        <h1 className="fade-in" style={{
          fontFamily: 'var(--font-brand)', fontSize: '26px', fontWeight: 700,
          color: 'var(--text)', letterSpacing: '0.04em',
          marginBottom: '8px', textAlign: 'center',
        }}>
          {authType == 'registration' ? "РЕГИСТРАЦИЯ" : "ВХОД"}
        </h1>

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

          {authType == 'registration' ? 
            <>
              <div className="fade-in">
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Ваше Имя
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => {setUserName(e.target.value)}}
                  placeholder="Ваше имя"
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: `1.5px solid ${errors.userName ? 'var(--danger)' : 'var(--border)'}`,
                    borderRadius: '10px', fontSize: '22px',
                    outline: 'none', color: 'var(--text)',
                    letterSpacing: '0.3em', textAlign: 'center',
                    fontFamily: 'var(--font-brand)',
                    transition: 'border-color 0.2s',
                  }}
                />
                {errors.userName && (
                  <div className="fade-in" style={{ marginTop: '5px', fontSize: '12px', color: 'var(--danger)' }}>
                    ⚠ {errors.userName}
                  </div>
                )}
              </div>
              <div className="fade-in">
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Телефон
                </label>
                <div className='relative'>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={e => {setUserPhone(e.target.value)}}
                    placeholder="(999) 999 99 99"
                    style={{
                      width: '100%', padding: '6px 14px',
                      border: `1.5px solid ${errors.userPhone ? 'var(--danger)' : 'var(--border)'}`,
                      borderRadius: '10px', fontSize: '22px',
                      outline: 'none', color: 'var(--text)',
                      letterSpacing: '0.2em', textAlign: 'left',
                      fontFamily: 'var(--font-brand)',
                      transition: 'border-color 0.2s',
                      paddingLeft: '40px',
                      lineHeight: '1.5',
                      textBoxTrim: 'trim-both'
                    }}
                    className=''
                  />
                  <span style={{ fontFamily: 'var(--font-brand)', lineHeight: '1.5'}} className='absolute font-medium text-[22px] left-4 top-[50%] translate-y-[calc(-50%)]'>+7</span>
                </div>
                {errors.userPhone && (
                  <div className="fade-in" style={{ marginTop: '5px', fontSize: '12px', color: 'var(--danger)' }}>
                    ⚠ {errors.userPhone}
                  </div>
                )}
              </div>
            </> : null
          }

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
                maxLength={4}
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
                  {errors.code}
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

          {authType == 'registration' ? 
            <>
              <div className="fade-in">
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)'}}>
                  <Checkbox aria-invalid checked={policyAccepted} onCheckedChange={setPolicyAccepted} className={'mr-2 inline-block translate-y-[3px] shadow-red-50 '}/>
                  <span>Я согласен с <Link className='text-blue-600' target="_blank" href={'./privacy'}>политикой Конфиденциальности</Link> и политикой о использовании <Link className='text-blue-600' target="_blank" href={'./privacy'}>Cookie файлов</Link> </span>
                </label>
                {errors.policyAccepted && (
                  <div className="fade-in" style={{ marginTop: '5px', fontSize: '12px', color: 'var(--danger)' }}>
                    {errors.policyAccepted}
                  </div>
                )}
              </div>
            </> : null
          }

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
