import { useCallback, useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  concatHex,
  encodeFunctionData,
  formatEther,
  isAddress,
  parseEther,
  toHex,
} from 'viem'
import { getWalletNonce } from '../services/wallet.service.js'
import { useBundler } from './useBundler.js'
import {
  ENTRY_POINT_ADDRESS,
  entryPointAbi,
  FACTORY_ADDRESS,
  factoryAbi,
  SEPOLIA_CHAIN_ID,
  smartWalletAbi,
} from '../utils/userOperationConfig.js'

const OWNER_SIGNATURE_PLACEHOLDER = `0x${'ff'.repeat(65)}`

function addGasBuffer(gas, percent) {
  const value = BigInt(gas)
  return (value * BigInt(100 + percent) + 99n) / 100n
}

function packUserOperation(userOp, deployed) {
  const initCode = deployed
    ? '0x'
    : concatHex([FACTORY_ADDRESS, userOp.factoryData])

  return {
    sender: userOp.sender,
    nonce: BigInt(userOp.nonce),
    initCode,
    callData: userOp.callData,
    accountGasLimits: concatHex([
      toHex(BigInt(userOp.verificationGasLimit), { size: 16 }),
      toHex(BigInt(userOp.callGasLimit), { size: 16 }),
    ]),
    preVerificationGas: BigInt(userOp.preVerificationGas),
    gasFees: concatHex([
      toHex(BigInt(userOp.maxPriorityFeePerGas), { size: 16 }),
      toHex(BigInt(userOp.maxFeePerGas), { size: 16 }),
    ]),
    paymasterAndData: '0x',
    signature: '0x',
  }
}

export function useUserOperation() {
  const { address: ownerAddress } = useAppKitAccount({ namespace: 'eip155' })
  const {
    data: walletClient,
    refetch: refetchWalletClient,
  } = useWalletClient({ chainId: SEPOLIA_CHAIN_ID })
  const publicClient = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })
  const {
    estimate,
    getGasPrice,
    submit,
    checkStatus: checkBundlerStatus,
    reset: resetBundler,
    error: bundlerError,
    userOperationHash,
    receipt,
  } = useBundler()
  const [phase, setPhase] = useState('idle')
  const [error, setError] = useState('')
  const [preparedOperation, setPreparedOperation] = useState(null)
  const [estimatedFee, setEstimatedFee] = useState('')

  const prepareSend = useCallback(async ({
    recipient,
    amountEth,
    smartWalletAddress,
    salt,
    isDeployed,
    walletBalance,
  }) => {
    setError('')
    setPreparedOperation(null)
    setEstimatedFee('')

    try {
      if (!isAddress(recipient)) {
        throw new Error('Enter a valid recipient address.')
      }
      if (!amountEth || Number(amountEth) <= 0) {
        throw new Error('Enter an amount greater than zero.')
      }
      if (!isAddress(smartWalletAddress) || !isAddress(ownerAddress)) {
        throw new Error('Connect your owner wallet before preparing a transaction.')
      }
      if (!publicClient) {
        throw new Error('Sepolia network client is not ready yet. Try again in a moment.')
      }
      const signingClient = walletClient ?? (await refetchWalletClient()).data
      if (!signingClient) {
        throw new Error('Could not access your connected wallet. Reconnect it and try again.')
      }
      if (signingClient.chain?.id !== SEPOLIA_CHAIN_ID) {
        throw new Error('Switch your connected wallet to Sepolia before sending.')
      }
      if (signingClient.account.address.toLowerCase() !== ownerAddress.toLowerCase()) {
        throw new Error('The connected signing wallet does not match the selected owner wallet.')
      }

      const value = parseEther(amountEth)
      const nonceResult = await getWalletNonce(smartWalletAddress)
      const gasPrices = await getGasPrice()
      if (!gasPrices?.standard?.maxFeePerGas || !gasPrices?.standard?.maxPriorityFeePerGas) {
        throw new Error('Pimlico did not return its standard UserOperation gas prices.')
      }
      const factoryData = !isDeployed
        ? encodeFunctionData({
          abi: factoryAbi,
          functionName: 'createWallet',
          args: [ownerAddress, salt],
        })
        : undefined
      const callData = encodeFunctionData({
        abi: smartWalletAbi,
        functionName: 'execute',
        args: [recipient, value, '0x'],
      })

      const draft = {
        sender: smartWalletAddress,
        nonce: toHex(BigInt(nonceResult.nonce)),
        ...(factoryData ? { factory: FACTORY_ADDRESS, factoryData } : {}),
        callData,
        callGasLimit: '0x0',
        verificationGasLimit: '0x0',
        preVerificationGas: '0x0',
        maxFeePerGas: toHex(BigInt(gasPrices.standard.maxFeePerGas)),
        maxPriorityFeePerGas: toHex(BigInt(gasPrices.standard.maxPriorityFeePerGas)),
        signature: OWNER_SIGNATURE_PLACEHOLDER,
      }

      setPhase('estimating')
      const gasEstimate = await estimate(draft)
      const operation = {
        ...draft,
        callGasLimit: toHex(addGasBuffer(gasEstimate.callGasLimit, 20)),
        verificationGasLimit: toHex(addGasBuffer(gasEstimate.verificationGasLimit, 20)),
        preVerificationGas: toHex(BigInt(gasEstimate.preVerificationGas) + 5000n),
      }
      const totalGas = BigInt(operation.callGasLimit)
        + BigInt(operation.verificationGasLimit)
        + BigInt(operation.preVerificationGas)
      const feeWei = totalGas * BigInt(operation.maxFeePerGas)

      if (walletBalance !== undefined && BigInt(walletBalance) < value + feeWei) {
        throw new Error('The smart wallet balance may not cover the amount and estimated network fee.')
      }

      setPreparedOperation({ operation, value, isDeployed, ownerAddress })
      setEstimatedFee(formatEther(feeWei))
      setPhase('ready')
      return { estimatedFee: formatEther(feeWei) }
    } catch (prepareError) {
      setError(prepareError.message)
      setPhase('error')
      throw prepareError
    }
  }, [estimate, getGasPrice, ownerAddress, publicClient, refetchWalletClient, walletClient])

  const confirmSend = useCallback(async () => {
    setError('')
    setPhase('signing')

    try {
      if (!preparedOperation || !publicClient || !ownerAddress) {
        throw new Error('Review a transaction before confirming it.')
      }
      const signingClient = walletClient ?? (await refetchWalletClient()).data
      if (!signingClient) {
        throw new Error('Could not access your connected wallet. Reconnect it and try again.')
      }
      if (preparedOperation.ownerAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
        throw new Error('The connected owner wallet changed. Review the transaction again.')
      }
      if (signingClient.chain?.id !== SEPOLIA_CHAIN_ID) {
        throw new Error('Switch your connected wallet to Sepolia before signing.')
      }
      if (signingClient.account.address.toLowerCase() !== ownerAddress.toLowerCase()) {
        throw new Error('The connected signing wallet does not match the selected owner wallet.')
      }

      const packedOperation = packUserOperation(
        preparedOperation.operation,
        preparedOperation.isDeployed,
      )
      const userOpHash = await publicClient.readContract({
        address: ENTRY_POINT_ADDRESS,
        abi: entryPointAbi,
        functionName: 'getUserOpHash',
        args: [packedOperation],
      })
      const signature = await signingClient.signMessage({
        message: { raw: userOpHash },
      })
      setPhase('submitting')
      const result = await submit({
        ...preparedOperation.operation,
        signature,
      })

      if (result.status === 'success') {
        setPhase('success')
      } else {
        setPhase('pending')
      }

      return result
    } catch (sendError) {
      setError(sendError.message)
      setPhase('error')
      throw sendError
    }
  }, [ownerAddress, preparedOperation, publicClient, refetchWalletClient, submit, walletClient])

  const checkStatus = useCallback(async () => {
    try {
      const result = await checkBundlerStatus()
      if (result?.status === 'success') setPhase('success')
      else if (result?.status === 'failed') {
        setPhase('error')
        setError('The bundler included the UserOperation, but execution failed.')
      }
      else if (result?.status === 'pending') setPhase('pending')
      return result
    } catch (statusError) {
      setError(statusError.message)
      return null
    }
  }, [checkBundlerStatus])

  const reset = useCallback(() => {
    setError('')
    setPreparedOperation(null)
    setEstimatedFee('')
    setPhase('idle')
    resetBundler()
  }, [resetBundler])

  return {
    phase,
    error: error || bundlerError,
    estimatedFee,
    userOperationHash,
    receipt,
    prepareSend,
    confirmSend,
    checkStatus,
    reset,
  }
}
