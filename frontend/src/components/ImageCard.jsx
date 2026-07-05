import React, { useEffect, useState } from 'react'
import './ImageCard.css'

function formatRemaining(ms) {
  if (ms <= 0) return 'Expired'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m left`
  if (m > 0) return `${m}m ${s}s left`
  return `${s}s left`
}

export default function ImageCard({ image, onDelete, onCopy }) {
  const [remaining, setRemaining] = useState(
    new Date(image.expiryTime).getTime() - Date.now()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(new Date(image.expiryTime).getTime() - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [image.expiryTime])

  const expired = remaining <= 0

  return (
    <div className={`image-card ${expired ? 'is-expired' : ''}`}>
      <div className="image-card-body">
        <div>
          <div className="filename" title={image.title || image.originalFilename}>
            {image.title || image.originalFilename}
          </div>
          {image.description && <p className="image-description">{image.description}</p>}
        </div>
        <div className={`timer ${expired ? 'timer-expired' : ''}`}>
          {formatRemaining(remaining)}
        </div>
      </div>
      <div className="image-card-actions">
        <button
          className="btn-secondary"
          disabled={expired}
          onClick={() => onCopy(image.shareUrl)}
        >
          Copy link
        </button>
        <a className="btn-secondary btn-link" href={image.shareUrl} target="_blank" rel="noreferrer">
          Open
        </a>
        <button className="btn-danger" onClick={() => onDelete(image.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
