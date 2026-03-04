import React from 'react'

export default function Sparkline({ data = [], positive, width = 80, height = 32 }) {
  if (!data.length) return <div style={{ width, height }} />

  const min  = Math.min(...data)
  const max  = Math.max(...data)
  const range = max - min || 1
  const pts   = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })
  const color = positive ? '#00d26a' : '#ff4757'
  const path  = `M ${pts.join(' L ')}`
  const area  = `M 0,${height} L ${pts.join(' L ')} L ${width},${height} Z`

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`g-${positive}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${positive})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}