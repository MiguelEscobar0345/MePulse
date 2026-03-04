# Pulse — Crypto Market Dashboard

A production-grade cryptocurrency dashboard built with React, Vite, and Vercel Serverless Functions. Real-time market data, interactive price charts, sparklines, and detailed coin analytics — all served through a custom API layer that solves the hard problems most frontend projects ignore.

Live demo → **Coming soon!**

---

## Preview

> Black-on-black fintech aesthetic. Monospaced data typography. Green gains, red losses. Built to look like it belongs next to Bloomberg Terminal.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| API layer | Vercel Serverless Functions (Node.js) |
| Styling | CSS-in-JS + CSS custom properties |
| Data source | [CoinGecko API](https://coingecko.com) |
| Fonts | Epilogue · DM Mono (Google Fonts) |
| Deployment | Vercel |

---

## Features

- **Top 50 coins** by market cap with pagination
- **Market overview** — total market cap, BTC/ETH dominance, 24h change
- **Sparkline charts** — 7-day SVG price trend on every row
- **Real-time search** — filter by name or symbol instantly
- **Coin detail modal** — 30-day price chart, 24h/7d/30d % changes, market cap, volume, ATH, supply
- **Skeleton loaders** — structured placeholders while data fetches
- **Smart cache** — API responses cached in memory, no duplicate requests per session
- **Refresh button** — manual cache invalidation with loading state
- **Fully responsive** — columns hide gracefully on mobile, modal adapts to bottom sheet

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/MiguelEscobar0345/MePulse.git
cd pulse-crypto

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
pulse-crypto/
├── api/                          # Vercel Serverless Functions
│   ├── global.js                 # GET /api/global → CoinGecko /global
│   ├── market.js                 # GET /api/market?page=N → coins/markets
│   ├── coin.js                   # GET /api/coin?id=bitcoin → coin detail
│   └── chart.js                  # GET /api/chart?id=bitcoin → price history
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx            # Sticky nav with search + refresh
│   │   ├── MarketOverview.jsx    # Global market stats cards
│   │   ├── CoinTable.jsx         # Sortable coin rows with sparklines
│   │   ├── Sparkline.jsx         # SVG sparkline chart component
│   │   ├── CoinModal.jsx         # Detail bottom sheet with 30d chart
│   │   └── Footer.jsx            # Personal links footer
│   ├── hooks/
│   │   ├── useMarket.js          # Market data fetching + cache + pagination
│   │   └── useCoinDetail.js      # Coin detail fetching + cache
│   ├── utils/
│   │   └── formatters.js         # Price, %, market cap formatters
│   ├── styles/
│   │   └── globals.css           # CSS variables + animations
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## The Hard Problems — What Actually Had to Be Solved

This project looks simple on the surface. It's not. Here's what had to be engineered to make it work in production.

### Problem 1: CORS — Browser Can't Call CoinGecko Directly

The first instinct is to call `https://api.coingecko.com` directly from the React app. That works in Postman. It doesn't work in a browser.

CoinGecko (like most financial APIs) blocks cross-origin requests from browsers — no `Access-Control-Allow-Origin` header means the browser refuses the response before the app ever sees it.

**Failed approaches tried:**
- Direct fetch → `CORS error` immediately
- `corsproxy.io` as intermediary → returned `530` (the proxy itself couldn't reach CoinGecko)
- CoinCap API as alternative → `ERR_NAME_NOT_RESOLVED` (domain was down)

**Solution: Vercel Serverless Functions as a custom API layer**

```
Browser → /api/market → Vercel Function (Node.js) → CoinGecko → Response
```

Each route in `/api` is a serverless function that runs server-side. From the server's perspective, there's no CORS — it's just an HTTP request. The browser only ever talks to our own domain (`/api/*`), so there's no cross-origin issue.

```js
// api/market.js — the entire "backend"
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const { page = 1 } = req.query
  const r = await fetch(`https://api.coingecko.com/api/v3/coins/markets?...&page=${page}`)
  const d = await r.json()
  res.setHeader('Cache-Control', 's-maxage=60')
  res.status(200).json(d)
}
```

For local development, Vite's dev server proxy mirrors this behavior — requests to `/api/*` are intercepted and forwarded to CoinGecko from Node, not the browser.

---

### Problem 2: Rate Limiting (429) — React StrictMode Double-Fetching

After solving CORS, the app started throwing `429 Too Many Requests` on every page load. CoinGecko's free tier allows ~30 requests/minute per IP.

The culprit: **React 18 StrictMode deliberately mounts components twice in development** to catch side effects. That meant every `useEffect` with a fetch was firing twice — doubling all requests and burning through the rate limit instantly before the page even rendered.

**Solution: `useRef` guard + module-level cache**

```js
const fetchedRef = useRef(false)

useEffect(() => {
  if (fetchedRef.current) return  // ← blocks the second StrictMode mount
  fetchedRef.current = true
  fetchCoins()
}, [])
```

Combined with a module-level cache object that persists across re-renders:

```js
const cache = { coins: {}, global: null, ts: 0 }

// Only fetch if cache is empty or stale (>60s)
if (cache.coins[key] && Date.now() - cache.ts < 60000) {
  setCoins(cache.coins[key])
  return
}
```

This means: first load fetches from the API. Every subsequent navigation, filter, or re-render within 60 seconds serves from memory instantly.

---

### Problem 3: Coin Detail Data Shape Mismatch

The detail modal was rendering `$NaN` for prices and `#undefined` for rank — the data was arriving but nothing was reading correctly.

The root cause: the `CoinModal` component was written for CoinCap's flat data structure (`coin.priceUsd`, `coin.rank`) but the API had been switched to CoinGecko, which nests everything under `market_data`:

```js
// :( CoinCap shape
const price = detail.priceUsd
const rank  = detail.rank

// :) CoinGecko shape
const price = detail.market_data.current_price.usd
const rank  = detail.market_cap_rank
```

All six stats, three percentage changes, and the chart were remapped to CoinGecko's nested structure.

---

### Problem 4: Local Dev Without Vercel CLI

Serverless functions only run in Vercel's infrastructure — they can't be executed locally by default. But waiting to deploy to test every change is not a viable workflow.

**Solution: Vite proxy that mirrors the serverless routes**

```js
// vite.config.js
server: {
  proxy: {
    '/api/market': {
      target: 'https://api.coingecko.com/api/v3',
      changeOrigin: true,
      rewrite: (path) => {
        const u    = new URL('http://x' + path)
        const page = u.searchParams.get('page') || 1
        return `/coins/markets?vs_currency=usd&...&page=${page}`
      },
    },
  },
}
```

In dev: Vite intercepts `/api/*` and proxies from Node (no CORS).
In prod: Vercel routes `/api/*` to the serverless functions.
The React app calls `/api/market` in both environments — zero code changes between local and production.

---

## Deploy on Vercel

### Option 1 — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub Import

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. **Framework Preset:** `Vite`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Click **Deploy**

Vercel automatically detects the `/api` folder and deploys each file as a serverless function. No additional configuration needed.

> **Note:** The 429 rate limit errors that appear in local development disappear in production. Vercel's serverless functions run from distributed server IPs — not your home IP — so CoinGecko's per-IP rate limit is effectively bypassed.

---

## API Reference

All data comes from [CoinGecko's public API](https://docs.coingecko.com). No API key required for the free tier.

| Internal Route | CoinGecko Endpoint | Cache |
|---------------|-------------------|-------|
| `GET /api/global` | `/global` | 60s |
| `GET /api/market?page=N` | `/coins/markets` | 60s |
| `GET /api/coin?id=bitcoin` | `/coins/bitcoin` | 120s |
| `GET /api/chart?id=bitcoin` | `/coins/bitcoin/market_chart` | 120s |

---

## Design Decisions

**Why serverless functions instead of a full backend?**
Zero infrastructure to manage. Deploys with the frontend. Scales automatically. For a portfolio project that needs a proxy layer, Vercel Functions is the minimal viable solution — no Express, no Docker, no separate deployment.

**Why DM Mono for numbers?**
Monospaced fonts give financial data visual alignment and rhythm. When prices update or columns align, proportional fonts shift layout. Monospaced keeps everything anchored — the same reason Bloomberg and trading terminals use it.

**Why SVG sparklines instead of a chart library?**
A chart library (Chart.js, Recharts) would add 50–100kb to the bundle for a 60×20px line. The custom SVG implementation is 30 lines, zero dependencies, and renders identically across all browsers.

**Why module-level cache instead of React state or localStorage?**
React state resets on unmount. localStorage requires serialization and is synchronous. A module-level object persists for the entire session, is instantly readable, and doesn't trigger re-renders when written to — exactly what a request cache needs.

---

## License

MIT © [Miguel E. Escobar P.](https://portfolio.com)