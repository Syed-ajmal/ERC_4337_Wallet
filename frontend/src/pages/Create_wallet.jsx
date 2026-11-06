import Navbar from '../components/Navbar.jsx'
import WalletDashboard from '../components/WalletDashboard.jsx'
import { projectId } from '../utils/appkit.js'

function CreateWalletPage() {
  return (
    <div className="min-h-screen bg-[#f2eafa] text-[#25232b]">
      <Navbar />

      <main className="mx-auto w-[calc(100%-28px)] max-w-[1120px] pb-14 pt-5 sm:w-[calc(100%-38px)] sm:pt-7 md:w-[calc(100%-48px)] md:pb-20 md:pt-10">
        <div className="mx-auto max-w-[760px] text-center">
          <h1 className="mt-5 font-[Manrope,sans-serif] text-[clamp(2.1rem,8vw,3rem)] font-semibold leading-tight tracking-[-1.5px] sm:mt-6 sm:text-5xl sm:tracking-[-2px] md:text-[58px]">
            Smart Wallet <em className="not-italic text-[#7c3aed]">dashboard.</em>
          </h1>
          <p className="mx-auto mt-4 max-w-[570px] text-sm leading-7 text-[#817b83] md:text-base">
            Connect an owner wallet to preview your ERC-4337 account on Sepolia.
          </p>
        </div>

        <section
          className="mx-auto mt-7 max-w-[700px] rounded-2xl border border-[#eae6ed] bg-white p-4 shadow-[0_18px_55px_#4a40530d] sm:mt-10 sm:p-8 md:mt-12"
          aria-label="Smart Wallet dashboard"
        >
          {projectId ? <WalletDashboard /> : (
            <div className="py-8 text-center sm:py-10">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f3eef9] text-2xl text-[#7c3aed]">◈</div>
              <h2 className="mt-4 text-lg font-semibold">Wallet connection isn’t configured</h2>
              <p className="mx-auto mt-2 max-w-[390px] text-xs leading-6 text-[#817b83]">Add your Reown project ID to enable wallet connection and smart wallet address prediction.</p>
            </div>
          )}
        </section>

        <div className="mx-auto mt-8 flex max-w-[700px] items-center justify-center gap-3 text-[10px] text-[#a29ca7]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9875cf]" /> SELF-CUSTODIAL <i>·</i> ERC-4337 <i>·</i> SEPOLIA TESTNET
        </div>
      </main>
    </div>
  )
}

export default CreateWalletPage
