import React from 'react'
import Sparkline from '../components/SparkLine'
import { fmtPrice, fmtPct, fmtMarketCap } from '../utils/formatters'

export default function CoinTable({ coins, onSelect }) {
  return (
    <>
      <style>{`
        .coin-row:hover { background: var(--bg-2) !important; cursor: pointer; }
        .coin-row { transition: background var(--transition); }
        @media (max-width: 768px) {
          .col-mcap { display: none !important; }
          .col-vol  { display: none !important; }
        }
        @media (max-width: 540px) {
          .col-1h { display: none !important; }
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 130px 90px 110px 110px 90px', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
        {['#','Asset','Price','24h %','Market Cap','Volume 24h','7d'].map((h, i) => (
          <div key={h} style={{ fontSize: '0.62rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', textAlign: i >= 2 ? 'right' : 'left' }}
            className={i === 4 ? 'col-mcap' : i === 5 ? 'col-vol' : i === 3 ? 'col-1h' : ''}
          >
            {h}
          </div>
        ))}
      </div>

      {coins.map((coin, idx) => {
        const p24h  = coin.price_change_percentage_24h
        const p7d   = coin.price_change_percentage_7d_in_currency
        const spark = coin.sparkline_in_7d?.price || []

        return (
          <div key={coin.id} className="coin-row" onClick={() => onSelect(coin.id)}
            style={{ display: 'grid', gridTemplateColumns: '40px 2fr 130px 90px 110px 110px 90px', gap: 8, padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'transparent', animation: `fadeUp 0.3s ease ${Math.min(idx,15)*20}ms both` }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>{coin.market_cap_rank}</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, alignSelf: 'center', minWidth: 0 }}>
              <img src={coin.image} alt={coin.name} style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{coin.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{coin.symbol}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', alignSelf: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-1)' }}>{fmtPrice(coin.current_price)}</div>
              <Sparkline data={spark.slice(-20)} positive={(p7d ?? 0) >= 0} width={60} height={20} />
            </div>

            <div className="col-1h" style={{ textAlign: 'right', alignSelf: 'center' }}>
              <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 6, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 500, background: p24h >= 0 ? 'var(--gain-bg)' : 'var(--loss-bg)', color: p24h >= 0 ? 'var(--gain)' : 'var(--loss)' }}>
                {fmtPct(p24h)}
              </span>
            </div>

            <div className="col-mcap" style={{ textAlign: 'right', alignSelf: 'center', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{fmtMarketCap(coin.market_cap)}</div>
            <div className="col-vol"  style={{ textAlign: 'right', alignSelf: 'center', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{fmtMarketCap(coin.total_volume)}</div>
            <div style={{ textAlign: 'right', alignSelf: 'center', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: (p7d ?? 0) >= 0 ? 'var(--gain)' : 'var(--loss)' }}>{fmtPct(p7d)}</div>
          </div>
        )
      })}
    </>
  )
}