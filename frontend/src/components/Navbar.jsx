import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isSharePage = location.pathname.startsWith('/share/')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">◆</span> CloudSnap
      </Link>
      {!isSharePage && user && (
        <div className="nav-right">
          <span className="nav-user">{user.username}</span>
          <button className="btn-ghost" onClick={handleLogout}>Log out</button>
        </div>
      )}
    </header>
  )
}
