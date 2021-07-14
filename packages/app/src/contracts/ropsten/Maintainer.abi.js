module.exports = [
  {
    inputs: [
      {
        internalType: 'contract ITerminalV1',
        name: '_terminalV1',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'CleanTrackedWantToken',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'cleanTrackedWantedTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'terminalV1',
    outputs: [
      {
        internalType: 'contract ITerminalV1',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
