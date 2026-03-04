import React from 'react'
import { fmtMarketCap, fmtPct } from '../utils/formatters'

export default function MarketOverview({ global: g }) {
  if (!g) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 12, marginBottom: 32 }}>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72 }} />)}
    </div>
  )

  const items = [
    { label: 'Total Market Cap', value: fmtMarketCap(g.total_market_cap?.usd), change: g.market_cap_change_percentage_24h_usd },
    { label: 'BTC Dominance',    value: g.market_cap_percentage?.btc?.toFixed(1) + '%', icon: '₿' },
    { label: 'ETH Dominance',    value: g.market_cap_percentage?.eth?.toFixed(1) + '%', icon: 'Ξ' },
    { label: 'Active Coins',     value: g.active_cryptocurrencies?.toLocaleString() },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 12, marginBottom: 32, animation: 'fadeUp 0.4s ease both' }}>
      {items.map(item => (
        <div key={item.label} style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', transition: 'border-color var(--transition)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <div style={{ fontSize: '0.62rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{item.label}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)' }}>
            {item.icon && <span style={{ color: 'var(--text-2)', marginRight: 4 }}>{item.icon}</span>}
            {item.value}
          </div>
          {item.change != null && (
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: item.change >= 0 ? 'var(--gain)' : 'var(--loss)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
              {fmtPct(item.change)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}