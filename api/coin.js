export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { id } = req.query
    try {
      const r = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
      )
      const d = await r.json()
      res.setHeader('Cache-Control', 's-maxage=120')
      res.status(200).json(d)
    } catch {
      res.status(500).json({ error: 'Failed' })
    }
  }