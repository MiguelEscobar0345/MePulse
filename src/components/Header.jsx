import React from 'react'

export default function Header({ search, onSearch, onRefresh, loading }) {
  return (
    <>
      <style>{`
        .hdr-inner {
          width: 100%; max-width: 1400px; margin: 0 auto;
          padding: 0 28px; height: 60px;
          display: flex; align-items: center; gap: 20px;
          box-sizing: border-box;
        }
        @media (max-width: 640px) {
          .hdr-inner {
            flex-wrap: wrap; height: auto;
            padding: 12px 16px; gap: 10px;
          }
          .hdr-search { width: 100% !important; max-width: 100% !important; order: 2; }
          .hdr-logo { order: 1; }
          .hdr-right { order: 3; margin-left: auto; }
        }
      `}</style>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        width: '100%',
      }}>
        <div className="hdr-inner">
          {/* Logo */}
          <a className="hdr-logo" href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <svg width="29" height="26" viewBox="0 0 80 40" fill="none">
              <polyline points="0,30 15,10 30,22 45,2 60,18 80,8"
                stroke="#00d26a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                Pulse
            </span>
            <span style={{
              fontSize: '0.6rem', fontWeight: 500, color: 'var(--text-3)',
              background: 'var(--bg-2)', border: '1px solid var(--border-2)',
              borderRadius: 6, padding: '2px 7px',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}>
              Crypto
            </span>
          </a>

          {/* Search */}
          <div className="hdr-search" style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search coin…"
              value={search}
              onChange={e => onSearch(e.target.value)}
              style={{
                width: '100%', height: 38,
                background: 'var(--bg-1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0 14px 0 36px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem', color: 'var(--text-1)',
                caretColor: 'var(--gain)',
                outline: 'none', transition: 'all var(--transition)',
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--border-2)'
                e.target.style.background = 'var(--bg-2)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.background = 'var(--bg-1)'
              }}
            />
          </div>

          {/* Right: live dot + refresh */}
          <div className="hdr-right" style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--gain)',
                boxShadow: '0 0 6px var(--gain)',
                animation: 'pulse 2s ease infinite',
              }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                LIVE
              </span>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh data"
              style={{
                width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-1)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke={loading ? 'var(--text-3)' : 'var(--text-2)'}
                strokeWidth="2" strokeLinecap="round"
                style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}