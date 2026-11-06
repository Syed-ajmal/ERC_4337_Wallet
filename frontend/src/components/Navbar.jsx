import WalletButton from './WalletButton.jsx'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="h-[58px] border-b border-[#ede7f7] bg-[#fbf8ff] shadow-[0_4px_14px_#30175312] md:h-[68px]">
      <nav className="mx-auto flex h-full w-[calc(100%-16px)] max-w-[1800px] items-center sm:w-[calc(100%-32px)] md:w-[calc(100%-48px)]" aria-label="Main navigation">
        <div className="flex min-w-0 items-center gap-2 md:gap-4 lg:gap-10">
          <Link className="flex shrink-0 items-center gap-1.5 font-[Manrope,sans-serif] text-[14px] font-extrabold tracking-[-1.2px] text-[#23153c] sm:gap-2 sm:text-[19px] md:gap-2.5 md:text-[21px]" to="/" aria-label="Smart Wallet home">
            <span className="flex h-[30px] w-[30px] -rotate-[4deg] items-center justify-center gap-[2px] rounded-[10px] bg-[#7c3aed] shadow-[0_5px_12px_#7c3aed40] sm:h-[32px] sm:w-[32px]"><i className="h-[11px] w-[3px] skew-x-[-18deg] rounded bg-white" /><i className="h-4 w-[3px] skew-x-[-18deg] rounded bg-[#e0d1ff]" /><i className="h-2 w-[3px] skew-x-[-18deg] rounded bg-white" /></span>
            <span>Smart Wallet<span className="text-[#7c3aed]">.</span></span>
          </Link>
          <div className="hidden items-center gap-3 text-[11px] font-semibold text-[#61566f] md:flex lg:gap-8 lg:text-[13px]"><Link className="transition hover:text-[#7c3aed]" to="/how-to-use">How to use</Link><Link className="transition hover:text-[#7c3aed]" to="/about">About</Link><Link className="font-bold text-[#7c3aed] transition hover:text-[#6226cb]" to="/create-wallet">Create wallet</Link></div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <WalletButton />
          <details className="group relative md:hidden">
            <summary aria-label="Open navigation menu" className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-lg border border-[#e8e0f2] text-[#61566f] [&::-webkit-details-marker]:hidden">
              <span className="flex flex-col gap-1"><i className="h-0.5 w-4 rounded bg-current" /><i className="h-0.5 w-4 rounded bg-current" /><i className="h-0.5 w-4 rounded bg-current" /></span>
            </summary>
            <div className="absolute right-0 top-[calc(100%+10px)] z-30 grid min-w-48 gap-1 rounded-xl border border-[#ede7f7] bg-white p-2 shadow-xl">
              <Link className="rounded-lg px-3 py-2.5 text-xs font-semibold text-[#61566f] hover:bg-[#f7f3fb]" to="/how-to-use">How to use</Link>
              <Link className="rounded-lg px-3 py-2.5 text-xs font-semibold text-[#61566f] hover:bg-[#f7f3fb]" to="/about">About</Link>
              <Link className="rounded-lg px-3 py-2.5 text-xs font-semibold text-[#7c3aed] hover:bg-[#f7f3fb]" to="/create-wallet">Create wallet</Link>
            </div>
          </details>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
