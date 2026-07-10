import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isSharePage = location.pathname.startsWith('/share/')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : ''

  return (
    <header className="navbar navbar-expand navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container-fluid px-3 px-md-4 py-2">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold m-0">
          <span className="brand-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18a4.5 4.5 0 0 1-.4-8.98A5.5 5.5 0 0 1 17.3 8.03 4 4 0 0 1 17 16H7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M12 12v6m0-6-2.2 2.2M12 12l2.2 2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="fs-5 gradient-text">CloudSnap</span>
        </Link>

        {!isSharePage && user && (
          <div className="d-flex align-items-center gap-3 ms-auto">
            <div className="d-none d-sm-flex align-items-center gap-2">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-semibold"
                style={{ width: 34, height: 34, fontSize: 13, background: 'linear-gradient(135deg, var(--brand), var(--accent))' }}
              >
                {initials}
              </span>
              <span className="text-muted-soft font-mono small">{user.username}</span>
            </div>
            <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
