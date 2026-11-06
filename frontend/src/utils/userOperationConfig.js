export const SEPOLIA_CHAIN_ID = 11155111

export const FACTORY_ADDRESS =
  import.meta.env.VITE_FACTORY_ADDRESS ||
  '0x330dd31f3a65c5B4f3A8BbAA2bFcaa701C3CEe6b'

export const ENTRY_POINT_ADDRESS =
  import.meta.env.VITE_ENTRY_POINT_ADDRESS ||
  '0x0000000071727De22E5E9d8BAf0edAc6f37da032'

export const factoryAbi = [
  {
    type: 'function',
    name: 'createWallet',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'walletOwner', type: 'address' },
      { name: 'salt', type: 'bytes32' },
    ],
    outputs: [{ name: 'walletAddress', type: 'address' }],
  },
]

export const smartWalletAbi = [
  {
    type: 'function',
    name: 'execute',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'dest', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'functionData', type: 'bytes' },
    ],
    outputs: [],
  },
]

export const entryPointAbi = [
  {
    type: 'function',
    name: 'getUserOpHash',
    stateMutability: 'view',
    inputs: [
      {
        name: 'userOp',
        type: 'tuple',
        components: [
          { name: 'sender', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'initCode', type: 'bytes' },
          { name: 'callData', type: 'bytes' },
          { name: 'accountGasLimits', type: 'bytes32' },
          { name: 'preVerificationGas', type: 'uint256' },
          { name: 'gasFees', type: 'bytes32' },
          { name: 'paymasterAndData', type: 'bytes' },
          { name: 'signature', type: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: 'userOpHash', type: 'bytes32' }],
  },
]
