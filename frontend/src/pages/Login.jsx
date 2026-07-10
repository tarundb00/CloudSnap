import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <form className="auth-card card shadow-lg border-0 p-4 p-sm-5 animate-in" onSubmit={handleSubmit}>
        <div className="brand-mark mx-auto mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18a4.5 4.5 0 0 1-.4-8.98A5.5 5.5 0 0 1 17.3 8.03 4 4 0 0 1 17 16H7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 12v6m0-6-2.2 2.2M12 12l2.2 2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-center gradient-text fw-bold fs-2 mb-1">Welcome back</h1>
        <p className="auth-subtitle text-muted-soft text-center mb-4">Log in to manage your temporary uploads.</p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="mb-3">
          <label className="form-label fw-semibold">Username</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button className="btn btn-primary w-100 mb-3" type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-switch text-center text-muted-soft mb-0">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}
