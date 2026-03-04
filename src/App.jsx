import React, { useState, useMemo } from 'react'
import Header from './components/Header'
import MarketOverview from './components/MarketOverview'
import CoinTable from './components/CoinTable'
import CoinModal from './components/CoinModal'
import Footer from './components/Footer'
import { useMarket } from './hooks/useMarket'

export default function App() {
  const { coins, global, loading, loadingMore, error, hasMore, loadMore, refresh } = useMarket()
  const [search, setSearch]       = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return coins
    const q = search.toLowerCase()
    return coins.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
    )
  }, [coins, search])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header
        search={search}
        onSearch={setSearch}
        onRefresh={refresh}
        loading={loading}
      />

      <main style={{
        flex: 1, width: '100%', maxWidth: 1400,
        margin: '0 auto', padding: '32px 24px 60px',
        boxSizing: 'border-box',
      }}>
        {/* Hero */}
        <div style={{ marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: 'var(--text-1)', lineHeight: 1.1, marginBottom: 6,
          }}>
            Crypto Markets
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
            Real-time prices · Top 50 by market cap · Powered by CoinGecko ·
            Miguel E. Escobar P.
          </p>
        </div>

        {/* Market overview */}
        <MarketOverview global={global} />

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '40px 20px', animation: 'fadeIn 0.3s ease' }}>
            <p style={{ color: 'var(--loss)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              {error}
            </p>
            <button onClick={refresh} style={{
              marginTop: 16, height: 38, padding: '0 20px',
              background: 'var(--bg-2)', border: '1px solid var(--border-2)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-1)',
              fontFamily: 'var(--font-display)', fontSize: '0.85rem',
              cursor: 'pointer',
            }}>
              Try again
            </button>
          </div>
        )}

        {/* Coin table */}
        {loading && !coins.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 58, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            animation: 'fadeUp 0.4s ease 0.1s both',
          }}>
            <CoinTable coins={filtered} onSelect={setSelectedId} />

            {/* No results */}
            {filtered.length === 0 && search && (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <p style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  No coins found for "{search}"
                </p>
              </div>
            )}

            {/* Load more */}
            {hasMore && !search && (
              <div style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    height: 42, padding: '0 32px',
                    background: loadingMore ? 'var(--bg-2)' : 'var(--bg-2)',
                    border: '1px solid var(--border-2)',
                    borderRadius: 'var(--radius-md)',
                    color: loadingMore ? 'var(--text-3)' : 'var(--text-1)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem', fontWeight: 600,
                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={e => { if (!loadingMore) e.currentTarget.style.borderColor = 'var(--gain)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)' }}
                >
                  {loadingMore ? 'Loading…' : 'Load more coins'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      <CoinModal coinId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  )
}