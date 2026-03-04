export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { id } = req.query
    try {
      const r = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`
      )
      const d = await r.json()
      res.setHeader('Cache-Control', 's-maxage=120')
      res.status(200).json(d)
    } catch {
      res.status(500).json({ error: 'Failed' })
    }
  }