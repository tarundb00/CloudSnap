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
      <div className="dashboard-header">
        <div>
          <h1>Your uploads</h1>
          <p className="dashboard-subtitle">
            {activeCount} / {MAX_IMAGES} slots used — images vanish automatically once their timer runs out.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {toast && <div className="alert-success">{toast}</div>}

      <UploadForm onUpload={handleUpload} uploading={uploading} disabled={atLimit} />
      {atLimit && (
        <p className="limit-note">
          You've reached the {MAX_IMAGES}-image limit. Delete one to upload another.
        </p>
      )}

      {loading ? (
        <p className="muted">Loading images…</p>
      ) : images.length === 0 ? (
        <p className="muted">Nothing uploaded yet. Add your first image above.</p>
      ) : (
        <div className="image-grid">
          {images.map((img) => (
            <ImageCard key={img.id} image={img} onDelete={handleDelete} onCopy={handleCopy} />
          ))}
        </div>
      )}
    </div>
  )
}
