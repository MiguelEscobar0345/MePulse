import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const CG = 'https://api.coingecko.com/api/v3'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/global': {
        target: CG,
        changeOrigin: true,
        rewrite: () => '/global',
      },
      '/api/market': {
        target: CG,
        changeOrigin: true,
        rewrite: (path) => {
          const u = new URL('http://x' + path)
          const page = u.searchParams.get('page') || 1
          return `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`
        },
      },
      '/api/coin': {
        target: CG,
        changeOrigin: true,
        rewrite: (path) => {
          const u = new URL('http://x' + path)
          const id = u.searchParams.get('id')
          return `/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
        },
      },
      '/api/chart': {
        target: CG,
        changeOrigin: true,
        rewrite: (path) => {
          const u = new URL('http://x' + path)
          const id = u.searchParams.get('id')
          return `/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`
        },
      },
    },
  },
})