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
    <div className={`image-card card h-100 shadow-sm hover-lift ${expired ? 'is-expired' : ''}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
          <div
            className="image-thumb-icon flex-shrink-0"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="8.3" cy="9.3" r="1.6" stroke="currentColor" strokeWidth="1.7" />
              <path d="M3.8 16.5 8.5 12l3 2.7 3.8-4.2 4.9 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={`badge rounded-pill timer ${expired ? 'text-bg-secondary' : 'text-bg-warning-subtle'}`}>
            ⏱ {formatRemaining(remaining)}
          </span>
        </div>

        <div className="filename fw-bold mb-1" title={image.title || image.originalFilename}>
          {image.title || image.originalFilename}
        </div>
        {image.description && <p className="image-description text-muted-soft small mb-0">{image.description}</p>}

        <div className="image-card-actions d-flex flex-wrap gap-2 mt-auto pt-3">
          <button
            className="btn btn-outline-secondary btn-sm flex-fill"
            disabled={expired}
            onClick={() => onCopy(image.shareUrl)}
          >
            Copy link
          </button>
          <a className="btn btn-outline-secondary btn-sm flex-fill" href={image.shareUrl} target="_blank" rel="noreferrer">
            Open
          </a>
          <button className="btn btn-outline-danger btn-sm flex-fill" onClick={() => onDelete(image.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
