export const fmtPrice = (n) => {
    if (n == null) return '—'
    if (n >= 1000) return '$' + n.toLocaleString('en', { maximumFractionDigits: 2 })
    if (n >= 1)    return '$' + n.toFixed(2)
    if (n >= 0.01) return '$' + n.toFixed(4)
    return '$' + n.toFixed(6)
  }
  
  export const fmtPct = (n) => {
    if (n == null) return '—'
    return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
  }
  
  export const fmtMarketCap = (n) => {
    if (n == null) return '—'
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T'
    if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2) + 'B'
    if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M'
    return '$' + n.toLocaleString()
  }
  
  export const fmtVolume = fmtMarketCap
  
  export const fmtSupply = (n) => {
    if (n == null) return '—'
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
    return n.toLocaleString()
  }