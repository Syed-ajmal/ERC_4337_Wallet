import { useState } from 'react'
import WalletButton from './WalletButton.jsx'
import { useWalletPrediction } from '../hooks/useWalletPrediction.js'
import { useUserOperation } from '../hooks/useUserOperation.js'

function shortenAddress(address = '') {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
}

function formatEth(value) {
  const amount = Number(value)
  return Number.isFinite(amount)
    ? amount.toLocaleString(undefined, { maximumFractionDigits: 6 })
    : '—'
}

function WalletDashboard() {
  const {
    address,
    isConnected,
    prediction,
    walletDetails,
    transactions,
    error,
    isLoading,
    isActivityLoading,
    isRefreshing,
    walletDetailsError,
    transactionsError,
    copied,
    copyError,
    retry,
    refreshWalletData,
    copyAddress,
  } = useWalletPrediction()
  const {
    phase,
    error: sendError,
    estimatedFee,
    userOperationHash,
    receipt,
    prepareSend,
    confirmSend,
    checkStatus,
    reset: resetOperation,
  } = useUserOperation()
  const [activeModal, setActiveModal] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isReviewingSend, setIsReviewingSend] = useState(false)

  function openSend() {
    resetOperation()
    setRecipient('')
    setAmount('')
    setIsReviewingSend(false)
    setActiveModal('send')
  }

  async function reviewSend() {
    setIsReviewingSend(true)
    try {
      await prepareSend({
        recipient,
        amountEth: amount,
        smartWalletAddress: prediction.smartWalletAddress,
        salt: prediction.salt,
        isDeployed: walletDetails?.isDeployed,
        walletBalance: walletDetails?.balance,
      })
    } catch {
      // The hook exposes the error for the dialog to render.
    }
  }

  async function submitSend() {
    try {
      await confirmSend()
    } catch {
      // The hook exposes signing and bundler errors for the dialog to render.
    }
  }

  if (!isConnected || !address) {
    return (
      <div className="py-8 text-center sm:py-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f3eef9] text-2xl text-[#7c3aed]">◈</div>
        <h3 className="mt-4 text-lg font-semibold">Connect an owner wallet</h3>
        <p className="mx-auto mt-2 max-w-[390px] text-xs leading-6 text-[#817b83]">We’ll use its public address to predict your smart wallet address. Connecting won’t deploy the smart wallet or send a transaction.</p>
        <div className="mt-5 flex justify-center"><WalletButton /></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div aria-live="polite" className="py-8 text-center sm:py-10">
        <div className="mx-auto grid h-14 w-14 animate-pulse place-items-center rounded-2xl bg-[#f3eef9] text-2xl text-[#7c3aed]">◈</div>
        <h3 className="mt-4 text-lg font-semibold">Predicting your smart wallet address</h3>
        <p className="mt-2 text-xs text-[#817b83]">Checking the Sepolia wallet factory…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div aria-live="polite" className="py-8 text-center sm:py-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0f0] text-xl text-[#bd5555]">!</div>
        <h3 className="mt-4 text-lg font-semibold">Couldn’t predict the address</h3>
        <p className="mx-auto mt-2 max-w-[390px] break-words text-xs leading-6 text-[#817b83]">{error}</p>
        <button className="mt-5 rounded-lg bg-[#6d3be7] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#7c3aed]" onClick={retry} type="button">Try again</button>
      </div>
    )
  }

  if (!prediction) return null

  const walletAddress = prediction.smartWalletAddress
  const balance = walletDetails?.balanceInEther

  return (
    <div className="py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><div className="font-mono text-[9px] font-semibold tracking-[1px] text-[#92869f]">SEPOLIA SMART ACCOUNT</div><h3 className="mt-1 text-lg font-bold text-[#30243b]">My Smart Wallet</h3></div>
        <span className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${walletDetails?.isDeployed ? 'bg-[#e8f7ef] text-[#27845b]' : 'bg-[#f2eef8] text-[#79658f]'}`}>{walletDetails ? (walletDetails.isDeployed ? 'Deployed' : 'Not deployed') : 'Predicted'}</span>
      </div>

      <div className="mt-5 rounded-xl border border-[#eae6ed] bg-[#fbf9fd] p-4 sm:p-5">
        <div className="font-mono text-[9px] font-semibold tracking-[.8px] text-[#958aa1]">SMART WALLET ADDRESS</div>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 break-all font-mono text-xs leading-6 text-[#32243f] sm:text-sm">{walletAddress}</code>
          <button className="shrink-0 self-start rounded-lg border border-[#e4d9f0] bg-white px-3 py-2 text-xs font-semibold text-[#6d3be7] transition hover:bg-[#f7f2fc] sm:self-auto" onClick={copyAddress} type="button">{copied ? 'Copied' : 'Copy address'}</button>
        </div>
        {copyError && <p className="mt-2 text-[11px] text-[#bd5555]">{copyError}</p>}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-[#eae6ed] bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3"><div className="font-mono text-[9px] font-semibold tracking-[.8px] text-[#958aa1]">TOTAL BALANCE</div><button aria-label="Refresh balance and activity" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#e4d9f0] bg-white text-[#6d3be7] transition hover:bg-[#f7f2fc] disabled:cursor-not-allowed disabled:opacity-50" disabled={isRefreshing || isActivityLoading} onClick={refreshWalletData} title="Refresh balance and activity" type="button"><svg aria-hidden="true" className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24"><path d="M20 7v5h-5M4.8 9a7.5 7.5 0 0 1 13-2L20 12M4 17v-5h5m10.2 3a7.5 7.5 0 0 1-13 2L4 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg></button></div>
          <div aria-live="polite" className="mt-2 flex items-baseline gap-2"><strong className="font-[Manrope,sans-serif] text-3xl font-bold tracking-[-1.5px] text-[#30243b]">{isActivityLoading && !walletDetails ? 'Loading…' : formatEth(balance)}</strong><span className="text-sm font-semibold text-[#766b81]">ETH</span></div>
          <div className="mt-1 text-[11px] text-[#93899e]">≈ $ — ETH price not loaded</div>
          {walletDetailsError && <p className="mt-2 text-[10px] text-[#bd5555]">Balance unavailable: {walletDetailsError}</p>}
        </div>
        <div className="flex gap-2 sm:flex-col">
          <button className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#6d3be7] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[132px]" disabled={!walletDetails || phase === 'pending' || phase === 'signing' || phase === 'submitting'} onClick={openSend} type="button"><span aria-hidden="true">↗</span> Send</button>
          <button className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-[#e4d9f0] bg-white px-4 py-3 text-xs font-semibold text-[#6d3be7] transition hover:bg-[#f7f2fc] sm:min-w-[132px]" onClick={() => setActiveModal('receive')} type="button"><span aria-hidden="true">↓</span> Receive</button>
        </div>
      </div>
      {phase === 'pending' && <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#f7f4fa] p-3 text-[11px] text-[#756b80]"><span>A UserOperation is still pending with the bundler.</span><button className="font-semibold text-[#6d3be7]" onClick={() => setActiveModal('send')} type="button">Track status</button></div>}

      <div className="mt-7">
        <div className="flex items-center justify-between border-b border-[#eee9f1] pb-3"><h4 className="text-sm font-semibold text-[#30243b]">Recent activity</h4><span className="font-mono text-[9px] text-[#a39aaa]">ON SEPOLIA</span></div>
        {isActivityLoading && transactions.length === 0 ? <p className="py-6 text-center text-xs text-[#8d8497]">Loading wallet activity…</p> : transactionsError && transactions.length === 0 ? <p className="py-6 text-center text-xs text-[#8d8497]">Activity could not be loaded: {transactionsError}</p> : transactions.length === 0 ? <p className="py-6 text-center text-xs text-[#8d8497]">No activity yet. The predicted address can receive ETH before deployment.</p> : (
          <div className="divide-y divide-[#f0edf2]">
            {transactions.map((transaction) => {
              const transfer = transaction.transfers?.[0]
              const direction = transaction.direction
              const isReceived = direction === 'received'
              const counterparty = isReceived ? transfer?.from : transfer?.to
              const amount = transaction.totalTransferred || transfer?.valueInEth || '0'

              return (
                <a className="flex items-center gap-3 py-4" href={transaction.explorerUrl} key={transaction.hash} rel="noreferrer" target="_blank">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-base ${isReceived ? 'bg-[#e7f5ee] text-[#31865f]' : 'bg-[#f0e9fa] text-[#7c3aed]'}`}>{isReceived ? '↓' : '↗'}</span>
                  <span className="min-w-0 flex-1"><strong className="block truncate text-xs font-semibold text-[#41364e]">{isReceived ? 'Received ETH' : direction === 'sent' ? 'Sent ETH' : 'Wallet transaction'}</strong><span className="mt-1 block truncate text-[10px] text-[#91889a]">{isReceived ? 'From' : 'To'} {shortenAddress(counterparty)}</span></span>
                  <span className="shrink-0 text-right"><strong className={`block text-xs font-semibold ${isReceived ? 'text-[#31865f]' : 'text-[#41364e]'}`}>{isReceived ? '+' : direction === 'sent' ? '−' : ''}{formatEth(amount)} ETH</strong><span className="mt-1 block text-[9px] capitalize text-[#91889a]">{isReceived ? 'Received' : direction === 'sent' ? 'Sent' : transaction.status || 'Activity'}</span></span>
                </a>
              )
            })}
          </div>
        )}
      </div>

      <p className="mt-5 rounded-lg bg-[#f7f4fa] p-3 text-[10px] leading-5 text-[#756b80]">The address is predicted by the factory. It can hold ETH before deployment; the balance shown comes from Sepolia.</p>

      {activeModal && <div className="fixed inset-0 z-50 grid place-items-center bg-[#21182f80] p-4" onClick={() => setActiveModal('')} role="presentation">
        <section aria-labelledby="wallet-modal-title" aria-modal="true" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()} role="dialog">
          <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[9px] font-semibold tracking-[1px] text-[#92869f]">SMART WALLET</p><h3 className="mt-1 text-lg font-bold text-[#30243b]" id="wallet-modal-title">{activeModal === 'receive' ? 'Receive ETH' : phase === 'success' ? (walletDetails?.isDeployed ? 'Transaction complete' : 'Smart Wallet created') : phase === 'pending' ? 'Transaction pending' : phase === 'signing' || phase === 'submitting' ? (!walletDetails?.isDeployed ? 'Creating your Smart Wallet' : 'Sending transaction') : 'Send ETH'}</h3></div><button aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-lg text-[#817b83] hover:bg-[#f7f4fa]" onClick={() => setActiveModal('')} type="button">×</button></div>
          {activeModal === 'receive' ? <><p className="mt-4 text-xs leading-5 text-[#817b83]">Send ETH on Sepolia to this smart wallet address. It can receive funds before its contract is deployed.</p><code className="mt-4 block break-all rounded-xl bg-[#f7f4fa] p-4 font-mono text-xs leading-6 text-[#32243f]">{walletAddress}</code><button className="mt-4 w-full rounded-xl bg-[#6d3be7] px-4 py-3 text-xs font-semibold text-white" onClick={copyAddress} type="button">{copied ? 'Copied address' : 'Copy address'}</button></> : <>
            {phase === 'success' ? <div className="mt-5 rounded-xl bg-[#eff9f3] p-4 text-sm text-[#286847]"><p className="font-semibold">Your transaction was confirmed on Sepolia.</p>{receipt?.receipt?.transactionHash && <a className="mt-2 block break-all text-xs underline" href={`https://sepolia.etherscan.io/tx/${receipt.receipt.transactionHash}`} rel="noreferrer" target="_blank">View transaction</a>}<button className="mt-4 w-full rounded-lg bg-[#6d3be7] px-4 py-2.5 text-xs font-semibold text-white" onClick={() => { setActiveModal(''); retry() }} type="button">Done</button></div> : <>
              {phase === 'signing' || phase === 'submitting' ? <div aria-live="polite" className="mt-5 rounded-xl bg-[#f7f4fa] p-4 text-xs leading-6 text-[#756b80]">{phase === 'signing' ? 'Review and confirm this request in your connected owner wallet.' : !walletDetails?.isDeployed ? 'The bundler is submitting your operation. Your account will deploy and then execute the transfer.' : 'The bundler is submitting your operation.'}</div> : phase === 'pending' ? <div aria-live="polite" className="mt-5 rounded-xl bg-[#f7f4fa] p-4 text-xs leading-6 text-[#756b80]">The operation is still pending with the bundler. You can check its status again.</div> : <>
                <p className="mt-4 text-xs leading-5 text-[#817b83]">{isReviewingSend ? 'Review the recipient, amount, and estimated fee before your owner wallet signs.' : 'Your owner wallet will review and sign the UserOperation.'}</p>
                <div className="mt-4 space-y-3"><label className="block text-xs font-medium text-[#51465e]">Recipient address<input className="mt-1.5 w-full rounded-lg border border-[#e7e1eb] px-3 py-2.5 font-mono text-xs outline-none focus:border-[#9a73d2]" disabled={phase === 'ready'} onChange={(event) => { setRecipient(event.target.value); setIsReviewingSend(false); resetOperation() }} placeholder="0x…" value={recipient} /></label><label className="block text-xs font-medium text-[#51465e]">Amount (ETH)<input className="mt-1.5 w-full rounded-lg border border-[#e7e1eb] px-3 py-2.5 text-xs outline-none focus:border-[#9a73d2]" disabled={phase === 'ready'} min="0" onChange={(event) => { setAmount(event.target.value); setIsReviewingSend(false); resetOperation() }} placeholder="0.01" step="any" type="number" value={amount} /></label></div>
                {phase === 'ready' && <div className="mt-4 rounded-lg border border-[#e7e1eb] p-3 text-xs"><div className="font-semibold text-[#51465e]">Review transaction</div><div className="mt-2 break-all text-[#817b83]">To: {recipient}</div><div className="mt-1 text-[#817b83]">Amount: {amount} ETH</div><div className="mt-1 text-[#817b83]">Estimated network fee: {estimatedFee} ETH</div><div className="mt-1 text-[#817b83]">{walletDetails?.isDeployed ? 'Wallet is already deployed.' : 'First transaction includes account deployment.'}</div></div>}
                {sendError && <p className="mt-3 rounded-lg bg-[#fff0f0] p-3 text-[11px] leading-5 text-[#a34141]">{sendError}</p>}
                <button className="mt-4 w-full rounded-xl bg-[#6d3be7] px-4 py-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={phase === 'estimating' || phase === 'signing' || phase === 'submitting' || !recipient || !amount || Number(amount) <= 0} onClick={phase === 'ready' ? submitSend : reviewSend} type="button">{phase === 'estimating' ? 'Estimating network fee…' : phase === 'ready' ? 'Confirm with owner wallet' : 'Review transaction'}</button>
              </>}
              {phase === 'pending' && <><p className="mt-3 break-all text-[10px] text-[#817b83]">UserOperation: {userOperationHash}</p><button className="mt-3 w-full rounded-xl border border-[#e4d9f0] px-4 py-3 text-xs font-semibold text-[#6d3be7]" onClick={checkStatus} type="button">Check status</button></>}
            </>}
          </>}
        </section>
      </div>}
    </div>
  )
}

export default WalletDashboard
