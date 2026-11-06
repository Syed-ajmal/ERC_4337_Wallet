import { useCallback, useState } from 'react'
import {
  estimateUserOperation,
  getUserOperationGasPrice,
  getUserOperationStatus,
  sendUserOperation,
} from '../services/userOperation.service.js'

const STATUS_POLL_INTERVAL_MS = 2500
const STATUS_POLL_ATTEMPTS = 40

const wait = (milliseconds) => new Promise((resolve) => {
  window.setTimeout(resolve, milliseconds)
})

export function useBundler() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userOperationHash, setUserOperationHash] = useState('')
  const [operationStatus, setOperationStatus] = useState('idle')
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState('')

  const estimate = useCallback(async (userOp) => {
    setError('')
    return estimateUserOperation(userOp)
  }, [])

  const getGasPrice = useCallback(() => getUserOperationGasPrice(), [])

  const checkStatus = useCallback(async (hash = userOperationHash) => {
    if (!hash) return null

    const result = await getUserOperationStatus(hash)
    setOperationStatus(result.status)
    setReceipt(result.receipt || null)
    return { ...result, userOpHash: hash }
  }, [userOperationHash])

  const submit = useCallback(async (userOp) => {
    setIsSubmitting(true)
    setError('')
    setReceipt(null)
    setOperationStatus('submitting')

    try {
      const { userOpHash } = await sendUserOperation(userOp)
      setUserOperationHash(userOpHash)
      setOperationStatus('pending')

      for (let attempt = 0; attempt < STATUS_POLL_ATTEMPTS; attempt += 1) {
        const result = await getUserOperationStatus(userOpHash)

        if (result.status === 'success') {
          setReceipt(result.receipt)
          setOperationStatus('success')
          return { ...result, userOpHash }
        }

        if (result.status === 'failed') {
          setReceipt(result.receipt)
          setOperationStatus('failed')
          const executionError = new Error('The bundler included the UserOperation, but execution failed.')
          executionError.name = 'UserOperationExecutionError'
          throw executionError
        }

        await wait(STATUS_POLL_INTERVAL_MS)
      }

      return { status: 'pending', userOpHash }
    } catch (submitError) {
      setError(submitError.message)
      setOperationStatus(submitError.name === 'UserOperationExecutionError' ? 'failed' : 'error')
      throw submitError
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError('')
    setUserOperationHash('')
    setOperationStatus('idle')
    setReceipt(null)
  }, [])

  return {
    estimate,
    getGasPrice,
    checkStatus,
    submit,
    reset,
    isSubmitting,
    userOperationHash,
    operationStatus,
    receipt,
    error,
  }
}
