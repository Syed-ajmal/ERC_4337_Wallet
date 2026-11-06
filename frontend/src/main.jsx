import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import './index.css'
import App from './App.jsx'
import { wagmiAdapter } from './utils/appkit.js'

const app = wagmiAdapter ? (
  <WagmiProvider config={wagmiAdapter.wagmiConfig}>
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
) : <App />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {app}
  </StrictMode>,
)
