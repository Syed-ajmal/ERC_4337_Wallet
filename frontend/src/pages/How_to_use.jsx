import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

const steps = [
  { number: '01', title: 'Open Create wallet', description: 'Start from the Create wallet page to begin setting up a smart account on the Sepolia test network.' },
  { number: '02', title: 'Connect your owner wallet', description: 'Choose a compatible wallet. It acts as the owner that authorizes actions for your smart account.' },
  { number: '03', title: 'Review and approve', description: 'Read each wallet request carefully and approve it in your wallet. Connecting by itself does not deploy an account or send a transaction.' },
  { number: '04', title: 'Use the smart account', description: 'Once account setup is available, you can use its supported account features on Sepolia. Testnet assets have no real-world value.' },
]

function HowToUsePage() {
  return (
    <div className="min-h-screen bg-[#f2eafa] text-[#25232b]">
      <Navbar />
      <main className="mx-auto w-[calc(100%-28px)] max-w-[1120px] pb-16 pt-12 sm:w-[calc(100%-40px)] sm:pt-16 md:w-[calc(100%-64px)] md:pb-24 md:pt-24">
        <section className="border-b border-[#e5dce9] pb-10 sm:pb-14 md:pb-16">
          <div className="font-mono text-[10px] font-semibold tracking-[1.3px] text-[#8c8394]">QUICK START · SEPOLIA</div>
          <h1 className="mt-5 max-w-[760px] font-[Manrope,sans-serif] text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold leading-[1.04] tracking-[-.055em]">How to use <em className="not-italic text-[#7c3aed]">Smart Wallet.</em></h1>
          <p className="mt-5 max-w-[650px] text-sm leading-7 text-[#6f6879] sm:text-base">Follow these steps to connect an owner wallet and explore the smart-account setup on Sepolia.</p>
        </section>

        <section className="py-12 sm:py-16 md:py-20">
          <div className="mb-6 sm:mb-8"><div className="font-mono text-[10px] font-semibold tracking-[1.2px] text-[#8c8394]">GETTING STARTED</div><h2 className="mt-3 font-[Manrope,sans-serif] text-2xl font-bold tracking-[-1px] sm:text-3xl">Your first steps</h2></div>
          <div className="divide-y divide-[#e5dce9] border-t border-[#e5dce9]">{steps.map((step) => <article className="grid grid-cols-[36px_1fr] gap-3 py-5 sm:grid-cols-[56px_1fr] sm:gap-5 sm:py-7" key={step.number}><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#e9ddff] font-mono text-[10px] font-semibold text-[#7c3aed] sm:h-10 sm:w-10">{step.number}</span><div><h3 className="text-sm font-bold sm:text-base">{step.title}</h3><p className="mt-2 max-w-[650px] text-xs leading-6 text-[#817b83] sm:text-sm">{step.description}</p></div></article>)}</div>
          <Link className="mt-8 inline-flex items-center rounded-xl bg-[#6d3be7] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#7c3aed]" to="/create-wallet">Go to Create wallet <span className="ml-2">→</span></Link>
        </section>
      </main>
    </div>
  )
}

export default HowToUsePage
