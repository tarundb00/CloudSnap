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
    <form className="upload-form" onSubmit={handleSubmit}>
      <div className="upload-grid">
         <label className="file-drop">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={disabled}
          />
          <span>{file ? file.name : 'Choose an image to upload'}</span>
        </label>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="A short name for this image"
            disabled={disabled}
          />
        </label>

        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe why you're sharing it"
            disabled={disabled}
          />
        </label>

        <label>
          Access password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password to open the shared image"
            disabled={disabled}
          />
        </label>

       
      </div>

      <div className="upload-actions">
        <select
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

        <button className="btn-primary" type="submit" disabled={disabled || uploading || !file || !title || !password}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </form>
  )
}
