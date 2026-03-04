import React, { useEffect, useRef } from 'react'
import { useCoinDetail } from '../hooks/useCoinDetail'
import { fmtPrice, fmtPct, fmtMarketCap, fmtSupply } from '../utils/formatters'

export default function CoinModal({ coinId, onClose }) {
  const { detail, chart, loading, error } = useCoinDetail(coinId)
  const overlayRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = coinId ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [coinId])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!coinId) return null

  // CoinGecko fields
  const md     = detail?.market_data
  const price  = md?.current_price?.usd
  const p24h   = md?.price_change_percentage_24h
  const p7d    = md?.price_change_percentage_7d
  const p30d   = md?.price_change_percentage_30d
  const mcap   = md?.market_cap?.usd
  const vol    = md?.total_volume?.usd
  const supply = md?.circulating_supply
  const maxSup = md?.max_supply
  const ath    = md?.ath?.usd
  const rank   = detail?.market_cap_rank
  const pos    = (p24h ?? 0) >= 0

  return (
    <>
      <style>{`
        .modal-scroll::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          .modal-inner { padding: 16px 18px 48px !important; border-radius: 20px 20px 0 0 !important; }
          .modal-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <div
        ref={overlayRef}
        onClick={e => { if (e.target === overlayRef.current) onClose() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div
          className="modal-scroll modal-inner"
          role="dialog" aria-modal="true"
          style={{
            background: 'var(--bg-1)', border: '1px solid var(--border-2)',
            width: '100%', maxWidth: 580, maxHeight: '88vh',
            overflowY: 'auto', borderRadius: '24px 24px 0 0',
            padding: '16px 28px 52px', scrollbarWidth: 'none',
          }}
        >
          {/* Handle */}
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--bg-2)', margin: '0 auto 20px' }} />

          {/* Close */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-2)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Rate limit error */}
          {error === 'rate_limit' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
              <p style={{ color: 'var(--loss)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                Rate limit reached — wait 30 seconds and try again.
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && !error && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0', gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--gain)',
                  animation: `pulse 0.8s ease ${i*0.15}s infinite`,
                }} />
              ))}
            </div>
          )}

          {/* Content */}
          {!loading && !error && detail && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <img
                  src={detail.image?.large} alt={detail.name}
                  style={{ width: 48, height: 48, borderRadius: '50%' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                      {detail.name}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                      {detail.symbol}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.62rem', color: 'var(--text-3)',
                    background: 'var(--bg-2)', border: '1px solid var(--border)',
                    borderRadius: 6, padding: '2px 7px',
                    fontFamily: 'var(--font-mono)', marginTop: 4, display: 'inline-block',
                  }}>
                    Rank #{rank}
                  </span>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.6rem', fontWeight: 800,
                    fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em', color: 'var(--text-1)',
                  }}>
                    {fmtPrice(price)}
                  </div>
                  <div style={{
                    fontSize: '0.85rem', fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: pos ? 'var(--gain)' : 'var(--loss)',
                  }}>
                    {fmtPct(p24h)} <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>24h</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              {chart.length > 1 && (
                <div style={{ background: 'var(--bg-2)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    30-Day Price Chart
                  </div>
                  <svg viewBox="0 0 400 80" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block' }}>
                    {(() => {
                      const min   = Math.min(...chart)
                      const max   = Math.max(...chart)
                      const range = max - min || 1
                      const pts   = chart.map((v, i) =>
                        `${(i / (chart.length - 1)) * 400},${80 - ((v - min) / range) * 72 - 4}`
                      )
                      const color = pos ? '#00d26a' : '#ff4757'
                      return (
                        <>
                          <defs>
                            <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%"   stopColor={color} stopOpacity="0.2"/>
                              <stop offset="100%" stopColor={color} stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <path d={`M 0,80 L ${pts.join(' L ')} L 400,80 Z`} fill="url(#cg)"/>
                          <path d={`M ${pts.join(' L ')}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )
                    })()}
                  </svg>
                </div>
              )}

              {/* % changes */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[
                  { label: '24h', val: p24h },
                  { label: '7d',  val: p7d },
                  { label: '30d', val: p30d },
                ].map(c => (
                  <div key={c.label} style={{ flex: 1, background: 'var(--bg-2)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: (c.val ?? 0) >= 0 ? 'var(--gain)' : 'var(--loss)' }}>
                      {fmtPct(c.val)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats grid */}
              <div className="modal-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Market Cap',  value: fmtMarketCap(mcap) },
                  { label: 'Volume 24h',  value: fmtMarketCap(vol) },
                  { label: 'Rank',        value: '#' + rank },
                  { label: 'Circulating', value: fmtSupply(supply) },
                  { label: 'Max Supply',  value: maxSup ? fmtSupply(maxSup) : '∞' },
                  { label: 'All Time High', value: fmtPrice(ath) },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-1)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}