import { useState, useRef } from 'react'
import axios from 'axios'

const ACCEPTED = ['.pdf', '.docx', '.txt']
const ICONS = {
  pdf:  { label: 'PDF',  color: '#ff6b6b' },
  docx: { label: 'DOCX', color: '#4dabf7' },
  txt:  { label: 'TXT',  color: 'var(--text-muted)' },
}

function FileUpload({ onResumeParsed }) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile]         = useState(null)
  const [parsing, setParsing]   = useState(false)
  const [parsed, setParsed]     = useState(false)
  const [error, setError]       = useState(null)
  const inputRef                = useRef(null)

  const getExtension = (name) => name.split('.').pop().toLowerCase()

  const processFile = async (f) => {
    const ext = getExtension(f.name)
    if (!ACCEPTED.includes(`.${ext}`)) {
      setError(`Unsupported format. Use ${ACCEPTED.join(', ')}`)
      return
    }
    setFile(f)
    setParsed(false)
    setError(null)
    setParsing(true)

    const formData = new FormData()
    formData.append('file', f)

    try {
      const res = await axios.post('/api/parse-resume', formData)
      onResumeParsed(res.data.text)
      setParsed(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to parse resume')
      setFile(null)
    } finally {
      setParsing(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    setFile(null)
    setParsed(false)
    setError(null)
    onResumeParsed('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const ext = file ? getExtension(file.name) : null
  const iconInfo = ext ? (ICONS[ext] || ICONS.txt) : null

  return (
    <div className="card anim-2" style={{ padding: '14px 16px' }}>
      <div className="section-label">Current Resume</div>

      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{ cursor: file ? 'default' : 'pointer' }}
      >
        {parsing ? (
          <div className="flex flex-col items-center gap-2">
            <div className="spinner" />
            <span className="label" style={{ fontSize: 10 }}>Parsing document…</span>
          </div>
        ) : parsed && file ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 32, height: 38,
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border-bright)',
                  borderRadius: 3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700, color: iconInfo.color }}>
                  {iconInfo.label}
                </span>
              </div>
              <div className="text-left">
                <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, lineHeight: 1.3 }}>
                  {file.name.length > 28 ? file.name.slice(0, 25) + '…' : file.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-success">
                <span className="badge-dot" />
                Parsed
              </span>
              <button
                className="btn btn-ghost"
                onClick={handleClear}
                style={{ padding: '3px 8px', fontSize: 10 }}
                title="Remove"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                Drop your resume here
              </p>
              <p style={{ margin: '3px 0 0', fontSize: 10, color: 'var(--text-muted)' }}>
                or click to browse
              </p>
            </div>
            <div className="flex gap-2" style={{ marginTop: 2 }}>
              {ACCEPTED.map(ext => (
                <span key={ext} className="badge badge-dim">{ext.toUpperCase()}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-banner" style={{ marginTop: 8, animation: 'shake 0.4s ease' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <p style={{ margin: '8px 0 0', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
        Optional — if omitted, the AI uses your master repository only.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
      />
    </div>
  )
}

export default FileUpload
