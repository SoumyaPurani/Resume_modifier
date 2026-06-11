function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header
      style={{
        height: '56px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 28, height: 28,
            background: 'var(--accent)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L1 8h5l-1 5 7-8H7l1-4z" fill="var(--bg)" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            letterSpacing: '0.08em',
            color: 'var(--text)',
          }}
        >
          RESUME MODIFIER
        </span>
        <span
          className="badge badge-dim"
          style={{ marginLeft: 2 }}
        >
          v1.0
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span className="label" style={{ fontSize: 9 }}>
          AI-POWERED · ONE PAGE
        </span>
        <button
          onClick={onToggleDarkMode}
          className="btn btn-ghost"
          style={{ padding: '5px 12px' }}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              Light
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Dark
            </>
          )}
        </button>
      </div>
    </header>
  )
}

export default Header
