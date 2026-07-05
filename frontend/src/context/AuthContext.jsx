import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cloudsnap_token')
    const username = localStorage.getItem('cloudsnap_username')
    const email = localStorage.getItem('cloudsnap_email')
    if (token && username) {
      setUser({ token, username, email })
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    persistSession(data)
    return data
  }

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password })
    persistSession(data)
    return data
  }

  const persistSession = (data) => {
    localStorage.setItem('cloudsnap_token', data.token)
    localStorage.setItem('cloudsnap_username', data.username)
    localStorage.setItem('cloudsnap_email', data.email)
    setUser({ token: data.token, username: data.username, email: data.email })
  }

  const logout = () => {
    localStorage.removeItem('cloudsnap_token')
    localStorage.removeItem('cloudsnap_username')
    localStorage.removeItem('cloudsnap_email')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
