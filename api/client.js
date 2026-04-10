const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Обновляем access токен через refresh токен
async function refreshAccessToken() {
  const refresh = localStorage.getItem('pioneer_refresh_token')
  if (!refresh) return null

  const deviceId = localStorage.getItem('device_id')

  try {
    const response = await fetch(`${BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh, ...(deviceId ? { device_id: deviceId } : {}) }),
    })
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('pioneer_token', data.access)
      return data.access
    }
  } catch {}
  return null
}

async function request(endpoint, options = {}, retry = true) {
  const url = `${BASE_URL}${endpoint}`

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('pioneer_token') : null
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, config)

  // токен истёк — пробуем обновить через refresh
  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      // повторяем запрос с новым токеном
      return request(endpoint, options, false)
    }
    // refresh тоже не помог — разлогиниваем
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pioneer_user')
      localStorage.removeItem('pioneer_token')
      localStorage.removeItem('pioneer_refresh_token')
      localStorage.removeItem('pioneer_session_id')
      window.location.href = '/login'
    }
    throw new Error('Сессия истекла. Войдите снова.')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }))
    throw new Error(error.message || error.detail || `Ошибка ${response.status}`)
  }

  return response.json()
}

export const apiClient = {
  get: (endpoint, options) =>
    request(endpoint, { method: 'GET', ...options }),

  post: (endpoint, body, options) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: (endpoint, body, options) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),

  patch: (endpoint, body, options) =>
    request(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),

  delete: (endpoint, options) =>
    request(endpoint, { method: 'DELETE', ...options }),
}