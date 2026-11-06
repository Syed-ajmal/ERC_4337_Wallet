import Navbar from '../components/Navbar.jsx'
import { Link } from 'react-router-dom'

const Arrow = ({ diagonal = false }) => <span aria-hidden="true" className="ml-1.5 text-base">{diagonal ? '↗' : '→'}</span>

const Eyebrow = ({ children }) => <div className="inline-flex items-center gap-2.5 rounded-full border border-[#e7dcf4] bg-[#f8f4fc] px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[1.4px] text-[#7652a8]"><span className="h-2 w-2 rounded-full bg-[#9b70d8] shadow-[0_0_0_3px_#bf8cff22]" />{children}</div>

function HomePage() {
  return (
    <div id="top" className="overflow-hidden bg-[#f2eafa] text-[#25232b]">
      <Navbar />
      <main>
        <section className="relative isolate w-full overflow-hidden bg-[linear-gradient(135deg,#eee5f7_0%,#f7f1fb_48%,#ece7fb_100%)] px-2 py-2 sm:px-3 sm:py-3">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_45%,#d8c4ff66_0%,#ebe2f855_28%,transparent_64%)]" />
          <div className="relative mx-auto grid min-h-0 w-full max-w-none grid-cols-1 items-center gap-0 rounded-[18px] border border-white/80 bg-[#fffefe] px-4 py-8 shadow-[0_24px_80px_#4e34710d] sm:rounded-[24px] sm:px-8 sm:py-10 lg:min-h-[calc(100vh-92px)] lg:grid-cols-2 lg:gap-[30px] lg:px-12 lg:py-[55px]">
          <div className="z-10 pb-0 md:pb-[30px]">
            <Eyebrow>ERC-4337 SMART ACCOUNTS</Eyebrow>
            <h1 className="mb-5 mt-6 font-[Manrope,sans-serif] text-[clamp(2.35rem,9vw,3.875rem)] font-extrabold leading-[1.05] tracking-[-2.5px] text-[#21182f] sm:mt-[27px] sm:text-[62px] sm:tracking-[-3.5px] lg:text-[clamp(49px,5.5vw,76px)] lg:tracking-[-4.5px]">Smarter accounts.<br /><em className="text-[#7c3aed] not-italic">Smoother Web3.</em></h1>
            <p className="max-w-[490px] text-[14px] leading-[1.8] text-[#6f6879] sm:text-[15px] lg:text-[17px]">Build experiences people love with smart accounts. Gasless onboarding, flexible signing, and transactions that just make sense.</p>
            <div className="mt-[31px] flex flex-wrap items-center gap-3.5 md:gap-4"><Link className="inline-flex items-center rounded-xl bg-[#6d3be7] px-5 py-[14px] text-[13px] font-bold text-white shadow-[0_8px_24px_#6d3be733] transition hover:-translate-y-0.5 hover:bg-[#7c3aed] md:px-6 md:py-4" to="/create-wallet">Create wallet <Arrow /></Link><Link className="inline-flex items-center rounded-xl border border-[#ded6e9] px-5 py-[14px] text-[13px] font-semibold text-[#41364e] transition hover:border-[#bca3e8] hover:bg-[#f8f4fc] md:px-6 md:py-4" to="/how-to-use">How to use</Link></div>
            <div className="mt-[29px] flex flex-wrap items-center gap-[9px] text-[10px] text-[#777080] md:mt-[38px] md:text-[11px]"><span className="grid h-[23px] w-[23px] place-items-center rounded-full bg-[#e9ddff] text-[13px] text-[#6d3be7]">◈</span><span>Built on <b className="font-semibold text-[#30263e]">ERC-4337</b></span><i className="mx-1.5 h-4 w-px bg-[#ded6e8]" /><span className="grid h-[14px] w-[14px] place-items-center rounded-full bg-[#e5faf2] text-[9px] leading-none text-[#008c68]">✓</span><span>Open &amp; auditable</span></div>
          </div>

          <div className="relative mx-0 mt-5 flex h-[390px] origin-top scale-[.88] items-center justify-center sm:mt-6 sm:h-[430px] sm:scale-100 lg:mt-0 lg:h-[500px]">
            <div className="absolute right-3 top-12 h-[270px] w-[270px] rounded-full bg-[radial-gradient(circle_at_50%_45%,#e7d8ff_0%,#efe8fa_45%,#f8f5fc_72%,transparent_74%)] sm:right-5 sm:top-11 sm:h-[340px] sm:w-[340px] lg:h-[390px] lg:w-[390px]" />
            <div className="relative z-[2] w-[min(355px,calc(100vw-64px))] rotate-0 rounded-[15px] border border-[#eeebf0] bg-white px-[15px] py-[16px] shadow-[0_22px_65px_#4a405315,0_3px_10px_#4a405308] sm:rotate-1 sm:px-[17px] sm:py-[17px] lg:w-[364px] lg:px-[21px] lg:py-5">
              <div className="flex items-center justify-between"><span className="font-mono text-[9px] font-medium tracking-[.8px] text-[#97919e]"><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#9875cf]" /> SMART ACCOUNT</span><span className="rounded border border-[#eeebf0] px-2 py-[5px] text-[9px] text-[#726c79]"><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#74c6a2]" /> Sepolia⌄</span></div>
              <div className="mt-[25px] flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#f0e9fa] text-[21px] text-[#7c3aed]">◈</span><div><b className="block text-xs font-semibold text-[#383440]">My smart wallet</b><small className="mt-[3px] block font-mono text-[9px] text-[#a29ca7]">0x71C...9a2f ▣</small></div><span className="ml-auto text-[19px] text-[#999]">···</span></div>
              <div className="mt-[25px]"><small className="block font-mono text-[9px] tracking-[.5px] text-[#aaa4ad]">ACCOUNT BALANCE</small><strong className="mt-1 block font-[Manrope,sans-serif] text-[30px] font-semibold tracking-[-1.2px] text-[#25232b]">2,450.80 <i className="font-sans text-[11px] not-italic tracking-normal text-[#8b8590]">USDC</i></strong><span className="text-[9px] text-[#aaa4ad]"><b className="mr-1 font-medium text-[#4b9c73]">↗ 2.4%</b>this month</span></div>
              <div className="my-5 h-px bg-[#f0edf1]" />
              <div className="flex justify-between font-mono text-[9px] tracking-[.5px] text-[#aaa4ad]">READY TO SEND <span className="text-[8px] text-[#a48acb]">● SIMULATED</span></div>
              <div className="my-[13px] flex items-center"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8f4ee] text-[17px] font-bold text-[#4b9c73]">$</span><span className="ml-[9px]"><b className="block text-[11px] text-[#383440]">25.00 USDC</b><small className="text-[9px] text-[#aaa4ad]">To <strong className="font-medium text-[#77717c]">alex.eth</strong></small></span><i className="ml-auto text-base not-italic text-[#aaa]">↗</i></div>
              <div className="mb-[14px] flex items-center justify-between text-[9px] text-[#99939d]"><span>Network fee</span><b className="rounded bg-[#edf7f1] px-[7px] py-1 text-[9px] font-medium text-[#4b9c73]">Sponsored ✦</b></div>
              <button className="h-[38px] w-full rounded-md bg-[#7c3aed] text-[10px] font-semibold text-white" type="button">Send with smart account <Arrow /></button><div className="mt-2.5 text-center text-[8px] text-[#aaa4ad]">No ETH needed · Protected by your passkey</div>
            </div>
            <div className="absolute right-0 top-16 z-[3] flex items-center gap-2 rounded-[9px] border border-[#efecf0] bg-white px-3 py-2.5 shadow-lg md:right-[-5px] md:top-[86px]"><span className="grid h-[25px] w-[25px] place-items-center rounded-[7px] bg-[#f0e9fa] text-[#9b7dc5]">✦</span><span><b className="block text-[9px] font-semibold text-[#4a4551]">Gas sponsored</b><small className="mt-0.5 block text-[8px] text-[#aaa3ae]">On us, always</small></span><i className="ml-1 text-[11px] not-italic text-[#6eb089]">✓</i></div>
            <div className="absolute bottom-[57px] left-0 z-[3] flex items-center gap-2 rounded-[9px] border border-[#efecf0] bg-white px-3 py-2.5 shadow-lg md:bottom-[76px] md:left-[-4px]"><span className="grid h-[25px] w-[25px] place-items-center rounded-[7px] bg-[#e8f4ee] text-xl text-[#4b9c73]">⌁</span><span><b className="block text-[9px] font-semibold text-[#4a4551]">Passkey secured</b><small className="mt-0.5 block text-[8px] text-[#aaa3ae]">Biometric approval</small></span></div>
            <div className="absolute bottom-[-2px] right-[14px] text-[8px] text-[#a29ca7] md:bottom-0 md:right-[30px] md:text-[9px]">A better wallet experience, by default</div>
          </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#e5dce9]"><div className="mx-auto flex w-[calc(100%-28px)] max-w-[1560px] flex-wrap items-center gap-3 py-5 sm:w-[calc(100%-40px)] md:w-[calc(100%-48px)] md:min-h-[76px] md:gap-5 md:py-0"><a className="flex items-center gap-2 font-[Manrope,sans-serif] text-sm font-extrabold tracking-[-1px]" href="#top"><span className="flex h-[21px] w-[21px] -rotate-[8deg] items-center justify-center gap-[2px] rounded-[7px] bg-[#7c3aed]"><i className="h-2.5 w-[3px] skew-x-[-18deg] rounded bg-[#d8c6ff]" /><i className="h-3.5 w-[3px] skew-x-[-18deg] rounded bg-[#9875cf]" /><i className="h-2 w-[3px] skew-x-[-18deg] rounded bg-[#d8c6ff]" /></span>Smart Wallet<span className="-ml-2 text-[#7c3aed]">.</span></a><span className="text-[9px] text-[#8d8497] max-sm:basis-full">Account abstraction for a more open web.</span><div className="ml-auto flex gap-4 text-[10px] text-[#716781]"><Link to="/how-to-use">How to use</Link><Link to="/about">About</Link></div><small className="w-full font-mono text-[8px] text-[#aaa4ad] sm:ml-auto sm:w-auto md:text-[9px]">© 2025 Smart Wallet Protocol</small></div></footer>
    </div>
  )
}

export default HomePage
