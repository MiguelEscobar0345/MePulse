import { useState, useEffect } from 'react'

const cache = {}

export function useCoinDetail(id) {
  const [detail, setDetail]   = useState(null)
  const [chart, setChart]     = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) { setDetail(null); setChart([]); setError(null); return }

    // Hit cache first
    if (cache[id]) {
      setDetail(cache[id].detail)
      setChart(cache[id].chart)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        const [dRes, hRes] = await Promise.all([
          fetch(`/api/coin?id=${id}`),
          fetch(`/api/chart?id=${id}`),
        ])

        if (dRes.status === 429 || hRes.status === 429) {
          if (!cancelled) setError('rate_limit')
          return
        }

        const dJson = await dRes.json()
        const hJson = await hRes.json()
        const chartPrices = hJson.prices?.map(p => p[1]) || []

        cache[id] = { detail: dJson, chart: chartPrices }

        if (!cancelled) {
          setDetail(dJson)
          setChart(chartPrices)
        }
      } catch {
        if (!cancelled) setError('error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  return { detail, chart, loading, error }
}