'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const AUTH_KEY = 'pioneer_user'
const TOKEN_KEY = 'pioneer_token'

export function useAuth() {
  const router = useRouter()
  const [userData, setUserData] = useState([])

  const getUserData = async () => {
    //setAccessToken(localStorage.getItem("pioneer_token"))
    let access_token
    access_token = localStorage.getItem("pioneer_token")
    //setLoadingStatus(false)
    const response = await fetch('http://localhost:8000/api/users/me/', {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${access_token}`,
        }
    })
    if(response.ok){
      const data = await response.json()
      console.log(data)
      setUserData(data)
      //setStatusAuth(true)
      //setLoadingStatus(false)
    }else if(response.status == 401){
      refreshAccessToken()
    }
  }

  const refreshAccessToken = async () => {
    //setRefreshToken(localStorage.getItem("pioneer_refresh_token"))
    let refresh_token
    refresh_token = localStorage.getItem("pioneer_refresh_token")
    console.log("REFR", refresh_token)
    console.log("REFR2", {
          "refresh": refresh_token
        })
    //setLoadingStatus(false)
    const response = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          "refresh": refresh_token
        })
    })
    if(response.ok){
      const token = await response.json()
      console.log("NEW",token.access)
      localStorage.setItem("pioneer_token", token.access)
    }else if(!response.ok){
      router.push('/login')
      localStorage.removeItem("pioneer_token")
      localStorage.removeItem("pioneer_refresh_token")
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return { userData }
}
