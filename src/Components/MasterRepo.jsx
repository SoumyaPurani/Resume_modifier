import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

function MasterRepo({ onStatusChange }) {
  const [status, setStatus] = useState({ loaded: false, isTemplate: true })
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState(null)
  const [content, setContent] = useState('')
  const fileInputRef = useRef(null)

  const fetchRepo = async () => {
    try {
      const res = await axios.get('/api/master-repo')
      setContent(res.data.content)
      const newStatus = { loaded: true, isTemplate: res.data.isTemplate }
      setStatus(newStatus)
      onStatusChange?.(newStatus)
    } catch {
      setStatus({ loaded: false, isTemplate: true })
    }
  }

  useEffect(() => {
    fetchRepo()
  }, [])

  const handleDownload = () => {
    const filename = status.isTemplate ? 'master-repo.template.md' : 'master-repo.md'
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleUpload = async (file) => {
    if (!file) return
    if (!file.name.endsWith('.md')) {
      setUploadMsg({ type: 'error', text: 'Only .md files accepted' })
      return
    }
    setUploading(true)
    setUploadMsg(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      await axios.post('/api/master-repo', formData)
      setUploadMsg({ type: 'success', text: 'Repository updated' })
      fetchRepo()
    } catch (err) {
      setUploadMsg({ type: 'error', text: err.response?.data?.error || 'Upload failed' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="card anim-1" style={{ padding: '14px 16px' }}>
      <div className="flex items-center justify-between">
        <div className="section-label" style={{ marginBottom: 0 }}>
          Master Repository
        </div>
        <span className={`badge ${status.isTemplate ? 'badge-warning' : 'badge-success'}`}>
          <span className={`badge-dot ${!status.isTemplate ? 'pulse' : ''}`} />
          {status.isTemplate ? 'Template' : 'Loaded'}
        </span>
      </div>

      {status.isTemplate && (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, marginBottom: 0, fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
          Using default template. Download → fill in your experience → upload.
        </p>
      )}

      <div className="rm-divider" />

      <div className="flex gap-2">
        <button className="btn btn-ghost" onClick={handleDownload} style={{ flex: 1 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{ flex: 1 }}
        >
          {uploading ? (
            <><div className="spinner" style={{ width: 11, height: 11, borderWidth: 1.5 }} />Uploading…</>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Upload .md
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </div>

      {uploadMsg && (
        <div
          className={`badge ${uploadMsg.type === 'success' ? 'badge-success' : 'badge-error'}`}
          style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
        >
          {uploadMsg.text}
        </div>
      )}
    </div>
  )
}

export default MasterRepo
