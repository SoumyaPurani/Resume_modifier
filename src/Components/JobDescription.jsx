const MAX_CHARS = 4000

function JobDescription({ jobDescription, onChange, onGenerate, isLoading, hasResume }) {
  const remaining = MAX_CHARS - jobDescription.length
  const canGenerate = jobDescription.trim().length > 20 && !isLoading

  return (
    <div className="card anim-3" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center justify-between">
        <div className="section-label" style={{ marginBottom: 0 }}>
          Job Description
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: remaining < 200 ? 'var(--warning)' : 'var(--text-muted)',
          }}
        >
          {remaining.toLocaleString()} left
        </span>
      </div>

      <textarea
        className="rm-input"
        rows={9}
        maxLength={MAX_CHARS}
        placeholder={`Paste the full job description here…\n\nInclude:\n• Role title and level\n• Required skills and technologies\n• Responsibilities\n• Company name and culture details`}
        value={jobDescription}
        onChange={(e) => onChange(e.target.value)}
        style={{ resize: 'vertical', minHeight: 180 }}
      />

      {!hasResume && jobDescription.length === 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 10px',
            background: 'var(--warning-dim)',
            border: '1px solid rgba(255,170,0,0.18)',
            borderRadius: 'var(--radius)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--warning)' }}>
            No resume uploaded — AI will use master repository only
          </span>
        </div>
      )}

      <button
        className={`btn-generate ${isLoading ? 'loading' : ''}`}
        onClick={onGenerate}
        disabled={!canGenerate}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <div className="spinner" style={{ borderTopColor: 'var(--bg)', borderColor: 'rgba(0,0,0,0.2)' }} />
            Generating Resume…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Generate Resume
          </span>
        )}
      </button>

      {!canGenerate && !isLoading && jobDescription.length > 0 && jobDescription.trim().length <= 20 && (
        <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          Add more detail to the job description
        </p>
      )}
    </div>
  )
}

export default JobDescription
