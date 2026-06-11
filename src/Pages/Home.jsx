import { useState } from 'react'
import axios from 'axios'
import Header from '../Components/Header.jsx'
import MasterRepo from '../Components/MasterRepo.jsx'
import FileUpload from '../Components/FileUpload.jsx'
import JobDescription from '../Components/JobDescription.jsx'
import ResumePreview from '../Components/ResumePreview.jsx'

function Home() {
  const [darkMode,        setDarkMode]        = useState(true)
  const [resumeText,      setResumeText]       = useState('')
  const [jobDescription,  setJobDescription]   = useState('')
  const [generatedResume, setGeneratedResume]  = useState(null)
  const [isLoading,       setIsLoading]        = useState(false)
  const [error,           setError]            = useState(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await axios.post('/api/generate-resume', {
        resumeText: resumeText || 'No current resume provided. Use the master repository exclusively.',
        jobDescription,
      })
      setGeneratedResume(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Check the server and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={darkMode ? '' : 'light'}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg)',
        color: 'var(--text)',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(d => !d)} />

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            background: 'var(--surface)',
          }}
        >
          <MasterRepo />

          <FileUpload onResumeParsed={setResumeText} />

          <JobDescription
            jobDescription={jobDescription}
            onChange={setJobDescription}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            hasResume={!!resumeText}
          />

          {error && (
            <div className="error-banner">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 11, opacity: 0.7 }}
              >
                ✕
              </button>
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 16, textAlign: 'center' }}>
            <a
              href="https://soumyapurani.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                letterSpacing: '0.12em',
                opacity: 0.5,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.5}
            >
              CREATED BY SOUMYA PURANI ✦
            </a>
          </div>
        </div>

        <div
          style={{
            overflow: 'hidden',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg)',
          }}
        >
          <ResumePreview resume={generatedResume} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default Home
