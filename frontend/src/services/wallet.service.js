import axios from 'axios'

const API_BASE_URL = import.meta.env.PROD
  ? ''
  : window.location.origin

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

async function getData(path, fallbackMessage) {
  try {
    const { data } = await api.get(path)

    if (!data.success) {
      throw new Error(data.message || fallbackMessage)
    }

    return data.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || fallbackMessage, { cause: error })
    }

    if (error.request) {
      throw new Error('Unable to reach the wallet API. Check that the backend is running.', { cause: error })
    }

    throw error
  }
}

export function predictWallet(owner) {
  if (!owner || typeof owner !== 'string') {
    throw new Error('A valid owner wallet address is required.')
  }

  return getData(
    `/api/wallet/predict/${encodeURIComponent(owner)}`,
    'Failed to predict the smart wallet address.',
  )
}

export function getWalletDetails(walletAddress) {
  if (!walletAddress || typeof walletAddress !== 'string') {
    throw new Error('A valid smart wallet address is required.')
  }

  return getData(
    `/api/wallet/${encodeURIComponent(walletAddress)}`,
    'Failed to retrieve smart wallet details.',
  )
}

export function getWalletNonce(walletAddress) {
  if (!walletAddress || typeof walletAddress !== 'string') {
    throw new Error('A valid smart wallet address is required.')
  }

  return getData(
    `/api/wallet/${encodeURIComponent(walletAddress)}/nonce`,
    'Failed to retrieve the smart wallet nonce.',
  )
}

export function getWalletTransactions(walletAddress, page = 1, offset = 10) {
  if (!walletAddress || typeof walletAddress !== 'string') {
    throw new Error('A valid smart wallet address is required.')
  }

  return getData(
    `/api/wallet/${encodeURIComponent(walletAddress)}/transactions?page=${page}&offset=${offset}`,
    'Failed to retrieve wallet activity.',
  )
}
