export const veBannyResolverABI = [
  { inputs: [], name: 'INSUFFICIENT_BALANCE', type: 'error' },
  { inputs: [], name: 'INVALID_LOCK_DURATION', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_duration', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      {
        internalType: 'uint256[]',
        name: '_lockDurationOptions',
        type: 'uint256[]',
      },
    ],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
]
