import { useState } from 'react'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { projectId } from '../utils/appkit.js'

function AppKitConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount({ namespace: 'eip155' })
  const { disconnect } = useDisconnect()

  return (
    <div className="flex items-center gap-2">
      <button className="whitespace-nowrap rounded-lg bg-[#5c50ff] px-2.5 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#6226cb] sm:px-3 sm:text-[11px] md:px-[15px] md:py-[11px] md:text-xs" type="button" onClick={() => open({ view: isConnected ? 'Account' : 'AllWallets', namespace: 'eip155' })}>
        {isConnected && address ? <><span className="sm:hidden">{`${address.slice(0, 4)}…${address.slice(-3)}`}</span><span className="hidden sm:inline">{`${address.slice(0, 6)}…${address.slice(-4)}`}</span></> : 'Connect wallet'}
      </button>
      {isConnected && <button aria-label="Disconnect wallet" title="Disconnect wallet" className="rounded-lg border border-[#e8e4df] px-2 py-2 text-[10px] font-semibold text-[#625b6c] transition hover:border-[#8c7dff] hover:text-[#5c50ff] sm:px-2.5 md:px-3 md:py-2.5 md:text-[11px]" type="button" onClick={() => disconnect({ namespace: 'eip155' })}><span className="sm:hidden" aria-hidden="true">⏻</span><span className="hidden sm:inline">Disconnect</span></button>}
    </div>
  )
}

function WalletButtonFallback() {
  const [message, setMessage] = useState('')

  return (
    <div className="relative">
      <button className="rounded-lg bg-[#5c50ff] px-3 py-[10px] text-[11px] font-semibold text-white transition hover:bg-[#6226cb] md:px-[15px] md:py-[11px] md:text-xs" type="button" onClick={() => setMessage('Wallet selection is not configured yet. Add your Reown project ID as VITE_REOWN_PROJECT_ID in .env.local, then restart the dev server.')}>Connect wallet</button>
      {message && <div role="status" className="absolute right-0 top-[calc(100%+10px)] z-20 w-72 rounded-xl border border-[#e8e4df] bg-white p-3 text-xs leading-relaxed text-[#625b6c] shadow-lg">{message}</div>}
    </div>
  )
}

function WalletButton() {
  return projectId ? <AppKitConnectButton /> : <WalletButtonFallback />
}

export default WalletButton
