import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : window.location.origin)

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

async function requestData(request, fallbackMessage) {
  try {
    const { data } = await request

    if (!data.success) {
      throw new Error(data.message || fallbackMessage)
    }

    return data.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || fallbackMessage, { cause: error })
    }

    if (error.request) {
      throw new Error('Unable to reach the UserOperation API. Check that the backend is running.', { cause: error })
    }

    throw error
  }
}

export function estimateUserOperation(userOp) {
  return requestData(
    api.post('/api/user-operation/estimate', { userOp }),
    'Failed to estimate the UserOperation gas.',
  )
}

export function getUserOperationGasPrice() {
  return requestData(
    api.get('/api/user-operation/gas-price'),
    'Failed to retrieve current UserOperation gas prices.',
  )
}

export function sendUserOperation(userOp) {
  return requestData(
    api.post('/api/user-operation/send', { userOp }),
    'Failed to submit the UserOperation to the bundler.',
  )
}

export function getUserOperationStatus(userOpHash) {
  return requestData(
    api.get(`/api/user-operation/${encodeURIComponent(userOpHash)}`),
    'Failed to retrieve the UserOperation status.',
  )
}
