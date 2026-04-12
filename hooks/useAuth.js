/* 'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'

const AUTH_KEY    = 'pioneer_user'
const TOKEN_KEY   = 'pioneer_token'
const REFRESH_KEY = 'pioneer_refresh_token'
const SESSION_KEY = 'pioneer_session_id'

export function useAuth() {
  const router = useRouter()
  const [userData, setUserData] = useState([])

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresStr = "expires=" + expires.toUTCString();
    document.cookie = `${name}=${value}; ${expiresStr}; path=/`;
  }

  const getUserData = async () => {
    //setAccessToken(localStorage.getItem("pioneer_token"))
    let access_token
    access_token = localStorage.getItem("pioneer_token")
    //setLoadingStatus(false)
    const response = await fetch(`${API_URL}/users/me/`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${access_token}`,
      }
    })
    if(response.ok){
      const data = await response.json()
      console.log("data", data)
      setUserData(data)
    }else if(response.status == 401){
      refreshAccessToken()
    }
  }

  const refreshAccessToken = async () => {
    //setRefreshToken(localStorage.getItem("pioneer_refresh_token"))
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
  
    const deviceID = `${userAgent}-${platform}-${randomString}`;

    let refresh_token
    refresh_token = localStorage.getItem("pioneer_refresh_token")
    if(refresh_token !== null){
      setCookie('pioneer_refresh_token', refresh_token, 7);
      const response = await fetch(`${API_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          "device_id": deviceID,
          "refresh": refresh_token
        })
      })
      if(response.ok){
        const token = await response.json()
        console.log("NEW",token.access)
        localStorage.setItem("pioneer_token", token.access)
        setCookie('pioneer_token', token.access, 7);
      }
    }else{
      alert("TOJEN NULL")
      router.push('/login')
      localStorage.removeItem("pioneer_token")
      localStorage.removeItem("pioneer_refresh_token")
    }
    
  }

  useEffect(() => {
    getUserData()
  }, [])

  return { userData, refreshAccessToken }
}
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export function useAuth() {
  const router = useRouter()

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // защита от параллельного refresh
  const isRefreshing = useRef(false)


  const getDeviceId = () => {
    if (typeof window === 'undefined') return null

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

  const setCookie = (name, value, days) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 86400000)
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`
  }

  const logout = () => {
    if (typeof window === 'undefined') return

    localStorage.removeItem('pioneer_token')
    localStorage.removeItem('pioneer_refresh_token')
    localStorage.removeItem('device_id')

    router.push('/login')
  }

  // REFRESH TOKEN (без гонок)
  const refreshAccessToken = async () => {
    if (isRefreshing.current) {
      // ждём пока закончится refresh
      return new Promise(resolve => {
        const interval = setInterval(() => {
          if (!isRefreshing.current) {
            clearInterval(interval)
            resolve(true)
          }
        }, 100)
      })
    }
    isRefreshing.current = true
    try {
      const refresh_token = localStorage.getItem('pioneer_refresh_token')

      if (!refresh_token) {
        logout()
        return false
      }

      const response = await fetch(`${API_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refresh: refresh_token,
          device_id: getDeviceId()
        })
      })
      if (!response.ok) {
        //console.log("!responce", response)
        logout()
        return false
      }

      const data = await response.json()
      //console.log("REAL DATA", JSON.stringify(data))

      localStorage.setItem('pioneer_token', data.access)
      setCookie('pioneer_token', data.access, 7)
      //getUserData()
      return true

    } catch (err) {
      console.error('Refresh error:', err)
      logout()
      return false

    } finally {
      isRefreshing.current = false
    }
  }

  // 🔐 универсальный fetch с авто-refresh
  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('pioneer_token')

    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    // если access протух
    if (response.status == 401) {
      const refreshed = await refreshAccessToken()

      if (!refreshed) throw new Error('Unauthorized')

      token = localStorage.getItem('pioneer_token')

      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    return response
  }

  const getUserData = async () => {
    if (typeof window === 'undefined') return

    setLoading(true)

    try {
      const response = await authFetch(`${API_URL}/users/me/`)

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const data = await response.json()
      setUserData(data)

    } catch (err) {
      console.error('Auth error:', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return {
    userData,
    loading,
    refreshAccessToken,
    refetchUser: getUserData
  }
}