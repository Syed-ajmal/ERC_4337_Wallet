export async function connectInjectedWallet() {
  const provider = window.ethereum

  if (!provider) {
    const error = new Error('No browser wallet detected. Install MetaMask or another EVM wallet, then try again.')
    error.code = 'WALLET_NOT_FOUND'
    throw error
  }

  const accounts = await provider.request({ method: 'eth_requestAccounts' })
  if (!accounts?.[0]) {
    const error = new Error('No wallet account was returned.')
    error.code = 'NO_ACCOUNT'
    throw error
  }

  return accounts[0]
}
