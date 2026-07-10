import React, { useState } from 'react'
import './UploadForm.css'

const EXPIRY_OPTIONS = [
  { label: '5 minutes', value: 5 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '6 hours', value: 360 },
  { label: '24 hours', value: 1440 },
]

export default function UploadForm({ onUpload, uploading, disabled }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [password, setPassword] = useState('')
  const [expiryMinutes, setExpiryMinutes] = useState(60)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) return
    onUpload(file, title, description, password, expiryMinutes)
    setFile(null)
    setTitle('')
    setDescription('')
    setPassword('')
    setExpiryMinutes(60)
    e.target.reset()
  }

  return (
    <form className="upload-form card shadow-sm p-4 animate-in border" onSubmit={handleSubmit}>
      <div className="row g-4">
        <div className="col-12 col-md-5">
          <label className="file-drop w-100 h-100">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={disabled}
            />
            <span className="file-drop-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="8.3" cy="9.3" r="1.6" stroke="currentColor" strokeWidth="1.7" />
                <path d="M3.8 16.5 8.5 12l3 2.7 3.8-4.2 4.9 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="file-drop-text">{file ? file.name : 'Choose an image to upload'}</span>
            <span className="file-drop-hint">PNG, JPG or GIF</span>
          </label>
        </div>

        <div className="col-12 col-md-7">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small text-uppercase text-muted-soft fw-semibold">Title</label>
              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="A short name for this image"
                disabled={disabled}
              />
            </div>

            <div className="col-12">
              <label className="form-label small text-uppercase text-muted-soft fw-semibold">Description</label>
              <input
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why you're sharing it"
                disabled={disabled}
              />
            </div>

            <div className="col-12">
              <label className="form-label small text-uppercase text-muted-soft fw-semibold">Access password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password to open the shared image"
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="upload-actions d-flex flex-wrap gap-3 align-items-center mt-4">
        <select
          className="form-select upload-list"
          style={{ maxWidth: 220 }}
          value={expiryMinutes}
          onChange={(e) => setExpiryMinutes(Number(e.target.value))}
          disabled={disabled}
        >
          {EXPIRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Expires in {opt.label}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" type="submit" disabled={disabled || uploading || !file || !title || !password}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </form>
  )
}
