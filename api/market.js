export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { page = 1 } = req.query
    try {
      const r = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd` +
        `&order=market_cap_desc&per_page=50&page=${page}` +
        `&sparkline=true&price_change_percentage=1h,24h,7d`
      )
      const d = await r.json()
      res.setHeader('Cache-Control', 's-maxage=60')
      res.status(200).json(d)
    } catch {
      res.status(500).json({ error: 'Failed' })
    }
  }