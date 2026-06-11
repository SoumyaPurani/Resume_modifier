import { Suspense, lazy } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ResumeDocument from './ResumeDocument.jsx'

const PDFViewer = lazy(() =>
  import('@react-pdf/renderer').then((m) => ({ default: m.PDFViewer }))
)

function MatchAnalysis({ analysis }) {
  if (!analysis) return null
  const { strongMatches = [], gaps = [], stretchAreas = [] } = analysis

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '12px 14px',
        marginBottom: 12,
      }}
    >
      <div className="section-label" style={{ marginBottom: 8 }}>Match Analysis</div>
      {strongMatches.length > 0 && (
        <div style={{ marginBottom: 6 }}>
          <div className="label" style={{ fontSize: 8, color: 'var(--success)', marginBottom: 4 }}>Strong Matches</div>
          <div className="flex flex-wrap gap-1">
            {strongMatches.map((m, i) => (
              <span key={i} className="match-pill" style={{ background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid rgba(0,224,138,0.2)', fontSize: 10 }}>✓ {m}</span>
            ))}
          </div>
        </div>
      )}
      {gaps.length > 0 && (
        <div style={{ marginBottom: 6 }}>
          <div className="label" style={{ fontSize: 8, color: 'var(--error)', marginBottom: 4 }}>Gaps</div>
          <div className="flex flex-wrap gap-1">
            {gaps.map((g, i) => (
              <span key={i} className="match-pill" style={{ background: 'var(--error-dim)', color: 'var(--error)', border: '1px solid rgba(255,64,64,0.2)', fontSize: 10 }}>✗ {g}</span>
            ))}
          </div>
        </div>
      )}
      {stretchAreas.length > 0 && (
        <div>
          <div className="label" style={{ fontSize: 8, color: 'var(--warning)', marginBottom: 4 }}>Stretch Areas</div>
          <div className="flex flex-wrap gap-1">
            {stretchAreas.map((a, i) => (
              <span key={i} className="match-pill" style={{ background: 'var(--warning-dim)', color: 'var(--warning)', border: '1px solid rgba(255,170,0,0.2)', fontSize: 10 }}>~ {a}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ResumePreview({ resume, isLoading }) {

  if (isLoading) {
    return (
      <div
        className="card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          background: 'var(--surface)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.08em', color: 'var(--text)' }}>
            GENERATING
          </span>
          <span className="label">AI is tailoring your resume…</span>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {['Analysing JD', 'Matching skills', 'Crafting bullets', 'Formatting'].map((step, i) => (
              <span
                key={step}
                className="badge badge-dim"
                style={{ animation: `fadeIn 0.4s ease both`, animationDelay: `${i * 0.3}s` }}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!resume) {
    return (
      <div
        className="card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: 'var(--surface)',
        }}
      >
        <div
          style={{
            width: 90,
            height: 120,
            background: 'var(--surface-2)',
            border: '1px solid var(--border-bright)',
            borderRadius: 4,
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            boxShadow: 'var(--shadow)',
          }}
        >
          <div style={{ height: 8, width: '70%', background: 'var(--border-bright)', borderRadius: 2 }} />
          <div style={{ height: 4, width: '45%', background: 'var(--border)', borderRadius: 2 }} />
          <div style={{ height: 1, background: 'var(--border)', margin: '3px 0' }} />
          {[80, 90, 65, 85, 70].map((w, i) => (
            <div key={i} style={{ height: 3, width: `${w}%`, background: 'var(--border)', borderRadius: 2, opacity: 0.7 }} />
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '3px 0' }} />
          {[75, 55, 80].map((w, i) => (
            <div key={i} style={{ height: 3, width: `${w}%`, background: 'var(--border)', borderRadius: 2, opacity: 0.5 }} />
          ))}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)', borderRadius: '4px 0 0 4px', opacity: 0.6 }} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            YOUR RESUME
          </span>
          <span className="label" style={{ textAlign: 'center', maxWidth: 220, lineHeight: 1.6 }}>
            Fill in the inputs on the left and hit Generate
          </span>
        </div>

        <div className="flex flex-col items-center gap-1" style={{ marginTop: 4 }}>
          {[
            { num: '01', text: 'Upload master repository' },
            { num: '02', text: 'Upload your current resume' },
            { num: '03', text: 'Paste job description' },
            { num: '04', text: 'Hit Generate' },
          ].map(({ num, text }) => (
            <div key={num} className="flex items-center gap-2">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', fontWeight: 700 }}>{num}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const fileName =
    (resume.contact?.name || 'resume').replace(/\s+/g, '_') + '_Resume.pdf'

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'preview-appear 0.4s ease',
      }}
    >
      <MatchAnalysis analysis={resume.matchAnalysis} />

      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="badge badge-success">
            <span className="badge-dot pulse" />
            Ready
          </span>
          <span className="label">Resume generated</span>
        </div>
        <PDFDownloadLink
          document={<ResumeDocument resume={resume} />}
          fileName={fileName}
          style={{ textDecoration: 'none' }}
        >
          {({ loading }) => (
            <button className="btn btn-accent" disabled={loading}>
              {loading ? (
                <><div className="spinner" style={{ width: 11, height: 11, borderWidth: 1.5, borderTopColor: 'var(--bg)', borderColor: 'rgba(0,0,0,0.25)' }} />Preparing…</>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      <div
        className="card"
        style={{ flex: 1, overflow: 'hidden', padding: 0, minHeight: 0 }}
      >
        <Suspense
          fallback={
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner" />
            </div>
          }
        >
          <PDFViewer
            width="100%"
            height="100%"
            style={{ border: 'none', borderRadius: 'var(--radius-lg)' }}
            showToolbar={false}
          >
            <ResumeDocument resume={resume} />
          </PDFViewer>
        </Suspense>
      </div>
    </div>
  )
}

export default ResumePreview
