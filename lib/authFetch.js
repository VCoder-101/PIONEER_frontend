const API_URL = 'http://localhost:8000'

let isRefreshing = false
let refreshPromise = null

const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id')

    if (!deviceId) {
        const userAgent = navigator.userAgent
        const platform = navigator.platform
        const random = Math.random().toString(36).substring(2)

        deviceId = `${userAgent}-${platform}-${random}`
        localStorage.setItem('device_id', deviceId)
    }

    return deviceId
}

const logout = () => {
    localStorage.removeItem('pioneer_token')
    localStorage.removeItem('pioneer_refresh_token')
    localStorage.removeItem('device_id')
    window.location.href = '/login'
}

// глобальный refresh (ОДИН на все запросы)
const refreshAccessToken = async () => {
    if (isRefreshing) return refreshPromise

    isRefreshing = true

    refreshPromise = (async () => {
        const refresh_token = localStorage.getItem('pioneer_refresh_token')

        if (!refresh_token) {
        logout()
        return false
        }

        try {
        const response = await fetch(`${API_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            refresh: refresh_token,
            device_id: getDeviceId()
            })
        })

        if (!response.ok) {
            logout()
            return false
        }

        const data = await response.json()

        localStorage.setItem('pioneer_token', data.access)

        return true
        } catch (e) {
        logout()
        return false
        } finally {
        isRefreshing = false
        }
    })()

    return refreshPromise
    }

    // ГЛАВНАЯ функция
    export const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('pioneer_token')

    let response = await fetch(url, {
        ...options,
        headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
        }
    })

    // если access умер
    if (response.status === 401) {
        const refreshed = await refreshAccessToken()

        if (!refreshed) throw new Error('Unauthorized')

        token = localStorage.getItem('pioneer_token')

        // 🔁 повторяем запрос
        response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`
        }
        })
    }

    return response
}

const BASE_URL = `${API_URL}/api`

export const apiClient = {
  get: async (endpoint) => {
    const res = await authFetch(`${BASE_URL}${endpoint}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || err.message || `Ошибка ${res.status}`)
    }
    return res.json()
  },
  post: async (endpoint, body) => {
    const res = await authFetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || err.message || `Ошибка ${res.status}`)
    }
    return res.json()
  },
  patch: async (endpoint, body) => {
    const res = await authFetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || err.message || `Ошибка ${res.status}`)
    }
    return res.json()
  },
  delete: async (endpoint) => {
    const res = await authFetch(`${BASE_URL}${endpoint}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || err.message || `Ошибка ${res.status}`)
    }
    return res.status === 204 ? null : res.json()
  },
}
