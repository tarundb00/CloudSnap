import React, { useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import UploadForm from '../components/UploadForm'
import ImageCard from '../components/ImageCard'
import './Dashboard.css'

const MAX_IMAGES = 5

export default function Dashboard() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const fetchImages = async () => {
    try {
      const { data } = await api.get('/images')
      setImages(data)
    } catch (err) {
      setError('Could not load your images.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
    const interval = setInterval(fetchImages, 15000) // keep list fresh as items expire
    return () => clearInterval(interval)
  }, [])

  const handleUpload = async (file, title, description, password, expiryMinutes) => {
    setError('')
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('password', password)
    formData.append('expiryMinutes', expiryMinutes)

    try {
      await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await fetchImages()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/images/${id}`)
      setImages((prev) => prev.filter((img) => img.id !== id))
    } catch (err) {
      setError('Could not delete image.')
    }
  }

  const handleCopy = (shareUrl) => {
    navigator.clipboard.writeText(shareUrl)
    setToast('Link copied to clipboard')
    setTimeout(() => setToast(''), 2000)
  }

  const activeCount = images.filter(
    (img) => new Date(img.expiryTime).getTime() > Date.now()
  ).length
  const atLimit = activeCount >= MAX_IMAGES

  return (
    <div className="page dashboard">
      <div className="dashboard-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 animate-in">
        <div>
          <h1 className="gradient-text fw-bold mb-1">Your uploads</h1>
          <p className="dashboard-subtitle text-muted-soft mb-0">
            {activeCount} / {MAX_IMAGES} slots used — images vanish automatically once their timer runs out.
          </p>
        </div>
        <span className="badge rounded-pill text-bg-light border px-3 py-2 fw-semibold">
          {activeCount}/{MAX_IMAGES} active
        </span>
      </div>

      {error && <div className="alert alert-danger animate-fade">{error}</div>}
      {toast && <div className="alert alert-success toast-alert animate-fade">{toast}</div>}

      <UploadForm onUpload={handleUpload} uploading={uploading} disabled={atLimit} />
      {atLimit && (
        <p className="limit-note alert alert-warning mt-3">
          You've reached the {MAX_IMAGES}-image limit. Delete one to upload another.
        </p>
      )}

      {loading ? (
        <p className="muted text-muted-soft text-center py-5">Loading images…</p>
      ) : images.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="empty-icon mb-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="8.3" cy="9.3" r="1.6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.8 16.5 8.5 12l3 2.7 3.8-4.2 4.9 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="muted text-muted-soft mb-0">Nothing uploaded yet. Add your first image above.</p>
        </div>
      ) : (
        <div className="image-grid row g-4 mt-1">
          {images.map((img) => (
            <div className="col-12 col-sm-6 col-lg-4" key={img.id}>
              <ImageCard image={img} onDelete={handleDelete} onCopy={handleCopy} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
