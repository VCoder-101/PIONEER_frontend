'use client'

import { useState, useEffect } from 'react'

const AUTH_KEY = 'pioneer_user'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // читаем сессию из localStorage при загрузке
  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY)
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const login = (phone) => {
    const userData = { phone, loggedAt: Date.now() }
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  return { user, loading, login, logout }
}
