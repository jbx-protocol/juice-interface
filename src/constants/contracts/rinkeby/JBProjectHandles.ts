export const rinkebyJbProjectHandles = {
  address: '0x812dC61A4aD3D6eB47ec92dF712b52c12E6A9B93',
  abi: [
    {
      inputs: [
        {
          internalType: 'contract IJBProjects',
          name: '_projects',
          type: 'address',
        },
        {
          internalType: 'contract IJBOperatorStore',
          name: '_operatorStore',
          type: 'address',
        },
        {
          internalType: 'contract ITextResolver',
          name: '_textResolver',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'EMPTY_NAME_PART',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NO_PARTS',
      type: 'error',
    },
    {
      inputs: [],
      name: 'UNAUTHORIZED',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'projectId',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'string',
          name: 'handle',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'string[]',
          name: 'parts',
          type: 'string[]',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'SetEnsNameParts',
      type: 'event',
    },
    {
      inputs: [],
      name: 'TEXT_KEY',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_projectId',
          type: 'uint256',
        },
      ],
      name: 'ensNamePartsOf',
      outputs: [
        {
          internalType: 'string[]',
          name: '',
          type: 'string[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_projectId',
          type: 'uint256',
        },
      ],
      name: 'handleOf',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'operatorStore',
      outputs: [
        {
          internalType: 'contract IJBOperatorStore',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'projects',
      outputs: [
        {
          internalType: 'contract IJBProjects',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_projectId',
          type: 'uint256',
        },
        {
          internalType: 'string[]',
          name: '_parts',
          type: 'string[]',
        },
      ],
      name: 'setEnsNamePartsFor',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'textResolver',
      outputs: [
        {
          internalType: 'contract ITextResolver',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
}
