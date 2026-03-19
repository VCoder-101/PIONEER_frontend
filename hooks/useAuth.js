'use client'

import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'

const AUTH_KEY    = 'pioneer_user'
const TOKEN_KEY   = 'pioneer_token'
const REFRESH_KEY = 'pioneer_refresh_token'
const SESSION_KEY = 'pioneer_session_id'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY)
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    setLoading(false)
  }, [])

  // login вызывается после успешного verifyEmailCode
  // data — полный ответ от бэкенда { jwt, session, user }
  const login = (email, data) => {
    const userData = {
      id: data?.user?.id || '',
      email,
      name: data?.user?.name || '',
      role: data?.user?.role || 'CLIENT',
      loggedAt: Date.now(),
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(userData))

    if (data?.jwt?.access) {
      localStorage.setItem(TOKEN_KEY, data.jwt.access)
    }
    if (data?.jwt?.refresh) {
      localStorage.setItem(REFRESH_KEY, data.jwt.refresh)
    }
    if (data?.session?.id) {
      localStorage.setItem(SESSION_KEY, data.session.id)
    }

    setUser(userData)
  }

  const logout = async () => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    await authService.logout(sessionId)

    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return { user, loading, login, logout }
}
