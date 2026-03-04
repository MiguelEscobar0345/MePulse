export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/global')
      const d = await r.json()
      res.setHeader('Cache-Control', 's-maxage=60')
      res.status(200).json(d)
    } catch {
      res.status(500).json({ error: 'Failed' })
    }
  }