import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axiosInstance'
import './SharePage.css'

function formatRemaining(ms) {
  if (ms <= 0) return 'Expired'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export default function SharePage() {
  const { shareId } = useParams()
  const [data, setData] = useState(null)
  const [expired, setExpired] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [remaining, setRemaining] = useState(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [unlockError, setUnlockError] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  const fetchShare = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/share/${shareId}`)
      setData(res.data)
      setRemaining(new Date(res.data.expiryTime).getTime() - Date.now())
    } catch (err) {
      if (err.response?.status === 410) {
        setExpired(true)
      } else {
        setNotFound(true)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShare()
  }, [shareId])

  useEffect(() => {
    if (remaining === null) return
    if (remaining <= 0) {
      setExpired(true)
      return
    }
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1000
        if (next <= 0) {
          setExpired(true)
          clearInterval(interval)
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [remaining])

  const handleUnlock = async (e) => {
    e.preventDefault()
    setUnlockError('')
    try {
      const res = await api.post(`/share/${shareId}/unlock`, null, {
        params: { password },
      })
      setData(res.data)
      setUnlocked(true)
    } catch (err) {
      setUnlockError(err.response?.data?.message || 'Please enter the correct password for opening the image.')
    }
  }

  if (loading) {
    return (
      <div className="share-page">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="share-page">
        <div className="timeout-card">
          <div className="timeout-icon">✕</div>
          <h1>Link not found</h1>
          <p>This share link doesn't exist. Double-check the URL.</p>
        </div>
      </div>
    )
  }

  if (expired || !data) {
    return (
      <div className="share-page">
        <div className="timeout-card">
          <div className="timeout-icon">⏱</div>
          <h1>Timeout</h1>
          <p>This link has expired and the image has been permanently deleted.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="share-page">
      <div className="share-card">
        <div className="share-heading">
          <div>
            <h1>{data.title || 'Shared image'}</h1>
            <p className="share-description">{data.description || 'Enter the password below to view the image.'}</p>
          </div>
          <span className="countdown">Expires in {formatRemaining(remaining)}</span>
        </div>

        {!unlocked ? (
          <form className="unlock-form" onSubmit={handleUnlock}>
            <label>Enter password to view</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button className="btn-primary" type="submit">Open image</button>
            {unlockError && <div className="alert-error">{unlockError}</div>}
          </form>
        ) : (
          <img src={data.url} alt={data.originalFilename} className="shared-image" />
        )}
      </div>
    </div>
  )
}
