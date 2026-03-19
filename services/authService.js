const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function getDeviceId() {
  if (typeof window === 'undefined') return 'ssr-device'
  let id = localStorage.getItem('pioneer_device_id')
  if (!id) {
    id = 'web-' + Math.random().toString(36).slice(2, 10)
    localStorage.setItem('pioneer_device_id', id)
  }
  return id
}

export const authService = {
  sendEmailCode: async (email) => {
    const response = await fetch(`${BASE_URL}/users/auth/send-code/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, privacy_policy_accepted: true }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || error.detail || 'Ошибка отправки кода')
    }
    return response.json()
  },

  verifyEmailCode: async (email, code, name = '', phone = '') => {
    const response = await fetch(`${BASE_URL}/users/auth/verify-code/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        code,
        device_id: getDeviceId(),
        name: name || 'Пользователь',
        phone: phone || '',
        privacy_policy_accepted: true,
      }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || error.detail || 'Неверный код')
    }
    return response.json()
  },

  logout: async (sessionId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('pioneer_token') : null
    if (!token) return
    try {
      await fetch(`${BASE_URL}/users/auth/logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ session_id: sessionId }),
      })
    } catch {}
  },
}
