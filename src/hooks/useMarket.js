import { useState, useEffect, useCallback, useRef } from 'react'

const cache = { coins: {}, global: null, ts: 0 }

export function useMarket() {
  const [coins, setCoins]             = useState([])
  const [global, setGlobal]           = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [page, setPage]               = useState(1)
  const [hasMore, setHasMore]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const fetchedRef = useRef(false)

  const fetchGlobal = useCallback(async () => {
    if (cache.global && Date.now() - cache.ts < 60000) {
      setGlobal(cache.global); return
    }
    try {
      const res = await fetch('/api/global')
      if (!res.ok) return
      const data = await res.json()
      cache.global = data.data
      setGlobal(data.data)
    } catch {
        // Ignore errors, we'll just show empty state
    }
  }, [])

  const fetchCoins = useCallback(async (pageNum = 1, append = false) => {
    const key = `page_${pageNum}`
    if (cache.coins[key] && Date.now() - cache.ts < 60000) {
      if (append) setCoins(prev => [...prev, ...cache.coins[key]])
      else setCoins(cache.coins[key])
      setLoading(false)
      setHasMore(cache.coins[key].length === 50)
      return
    }
    try {
      if (append) setLoadingMore(true)
      else setLoading(true)

      const res = await fetch(`/api/market?page=${pageNum}`)
      if (res.status === 429) {
        setError('Rate limit reached — wait 30 seconds and click refresh.')
        return
      }
      if (!res.ok) throw new Error('fetch_error')

      const data = await res.json()
      cache.coins[key] = data
      cache.ts = Date.now()

      if (append) setCoins(prev => [...prev, ...data])
      else setCoins(data)

      setHasMore(data.length === 50)
      setError(null)
    } catch {
      setError('Failed to fetch market data.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchGlobal()
    fetchCoins(1, false)
  }, [fetchGlobal, fetchCoins])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchCoins(next, true)
  }

  const refresh = () => {
    cache.coins = {}
    cache.global = null
    cache.ts = 0
    fetchedRef.current = false
    setPage(1)
    setCoins([])
    setError(null)
    setGlobal(null)
    fetchGlobal()
    fetchCoins(1, false)
  }

  return { coins, global, loading, loadingMore, error, hasMore, loadMore, refresh }
}