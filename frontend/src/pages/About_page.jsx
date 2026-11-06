import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

const principles = [
  { number: '01', title: 'You stay in control', description: 'A smart account is still yours. You choose the wallet that authorizes it and approve actions before they are sent.' },
  { number: '02', title: 'Fewer barriers to Web3', description: 'ERC-4337 gives applications room to make onboarding and transaction flows easier to understand.' },
  { number: '03', title: 'Built to be programmable', description: 'Smart accounts can support features such as sponsored fees, batched actions, and custom authorization rules.' },
]

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f2eafa] text-[#25232b]">
      <Navbar />
      <main className="mx-auto w-[calc(100%-28px)] max-w-[1120px] pb-16 pt-12 sm:w-[calc(100%-40px)] sm:pt-16 md:w-[calc(100%-64px)] md:pb-24 md:pt-24">
        <section className="border-b border-[#e5dce9] pb-10 sm:pb-14 md:pb-16">
          <div className="font-mono text-[10px] font-semibold tracking-[1.3px] text-[#8c8394]">ABOUT SMART WALLET</div>
          <h1 className="mt-5 max-w-[800px] font-[Manrope,sans-serif] text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold leading-[1.04] tracking-[-.055em]">A more thoughtful way to use <em className="not-italic text-[#7c3aed]">Web3.</em></h1>
          <p className="mt-5 max-w-[670px] text-sm leading-7 text-[#6f6879] sm:text-base">Smart Wallet is an ERC-4337 project exploring how smart accounts can make blockchain applications easier to access, while keeping people in control of their assets and approvals.</p>
          <Link className="mt-7 inline-flex items-center rounded-xl bg-[#6d3be7] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_#6d3be733] transition hover:bg-[#7c3aed]" to="/create-wallet">Create wallet <span className="ml-2">→</span></Link>
        </section>

        <section className="py-10 sm:py-14 md:py-16">
          <div className="grid gap-8 md:grid-cols-[.75fr_1.25fr] md:gap-16">
            <div><div className="font-mono text-[10px] font-semibold tracking-[1.2px] text-[#8c8394]">WHAT WE BELIEVE</div><h2 className="mt-4 font-[Manrope,sans-serif] text-3xl font-bold leading-tight tracking-[-1.5px] sm:text-4xl">Better account experiences should feel <em className="text-[#7c3aed]">simple.</em></h2></div>
            <div className="divide-y divide-[#e5dce9] border-t border-[#e5dce9]">{principles.map((principle) => <article className="grid grid-cols-[32px_1fr] gap-3 py-5 sm:grid-cols-[44px_1fr] sm:gap-4 sm:py-6" key={principle.number}><span className="pt-1 font-mono text-[10px] text-[#9a8cac]">{principle.number}</span><div><h3 className="text-sm font-bold sm:text-base">{principle.title}</h3><p className="mt-2 max-w-[540px] text-xs leading-6 text-[#817b83] sm:text-sm">{principle.description}</p></div></article>)}</div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AboutPage
