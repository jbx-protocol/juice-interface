const abi = {
  abi: [
    {
      inputs: [
        {
          internalType: 'contract IERC20Metadata',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_currency',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_baseWeightCurrency',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_payoutSplitsGroup',
          type: 'uint256',
        },
        {
          internalType: 'contract IJBOperatorStore',
          name: '_operatorStore',
          type: 'address',
        },
        {
          internalType: 'contract IJBProjects',
          name: '_projects',
          type: 'address',
        },
        {
          internalType: 'contract IJBDirectory',
          name: '_directory',
          type: 'address',
        },
        {
          internalType: 'contract IJBSplitsStore',
          name: '_splitsStore',
          type: 'address',
        },
        {
          internalType: 'contract IJBPrices',
          name: '_prices',
          type: 'address',
        },
        {
          internalType: 'contract IJBSingleTokenPaymentTerminalStore',
          name: '_store',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_owner',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'FEE_TOO_HIGH',
      type: 'error',
    },
    {
      inputs: [],
      name: 'INADEQUATE_DISTRIBUTION_AMOUNT',
      type: 'error',
    },
    {
      inputs: [],
      name: 'INADEQUATE_RECLAIM_AMOUNT',
      type: 'error',
    },
    {
      inputs: [],
      name: 'INADEQUATE_TOKEN_COUNT',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NO_MSG_VALUE_ALLOWED',
      type: 'error',
    },
    {
      inputs: [],
      name: 'PAY_TO_ZERO_ADDRESS',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'prod1',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'denominator',
          type: 'uint256',
        },
      ],
      name: 'PRBMath__MulDivOverflow',
      type: 'error',
    },
    {
      inputs: [],
      name: 'PROJECT_TERMINAL_MISMATCH',
      type: 'error',
    },
    {
      inputs: [],
      name: 'REDEEM_TO_ZERO_ADDRESS',
      type: 'error',
    },
    {
      inputs: [],
      name: 'TERMINAL_IN_SPLIT_ZERO_ADDRESS',
      type: 'error',
    },
    {
      inputs: [],
      name: 'TERMINAL_TOKENS_INCOMPATIBLE',
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
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'refundedFees',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'memo',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'metadata',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'AddToBalance',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'contract IJBPayDelegate',
          name: 'delegate',
          type: 'address',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'payer',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'currentFundingCycleConfiguration',
              type: 'uint256',
            },
            {
              components: [
                {
                  internalType: 'address',
                  name: 'token',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'decimals',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'currency',
                  type: 'uint256',
                },
              ],
              internalType: 'struct JBTokenAmount',
              name: 'amount',
              type: 'tuple',
            },
            {
              components: [
                {
                  internalType: 'address',
                  name: 'token',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'decimals',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'currency',
                  type: 'uint256',
                },
              ],
              internalType: 'struct JBTokenAmount',
              name: 'forwardedAmount',
              type: 'tuple',
            },
            {
              internalType: 'uint256',
              name: 'projectTokenCount',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'preferClaimedTokens',
              type: 'bool',
            },
            {
              internalType: 'string',
              name: 'memo',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: 'metadata',
              type: 'bytes',
            },
          ],
          indexed: false,
          internalType: 'struct JBDidPayData',
          name: 'data',
          type: 'tuple',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'delegatedAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'DelegateDidPay',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'contract IJBRedemptionDelegate',
          name: 'delegate',
          type: 'address',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'holder',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'currentFundingCycleConfiguration',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'projectTokenCount',
              type: 'uint256',
            },
            {
              components: [
                {
                  internalType: 'address',
                  name: 'token',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'decimals',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'currency',
                  type: 'uint256',
                },
              ],
              internalType: 'struct JBTokenAmount',
              name: 'reclaimedAmount',
              type: 'tuple',
            },
            {
              components: [
                {
                  internalType: 'address',
                  name: 'token',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'decimals',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'currency',
                  type: 'uint256',
                },
              ],
              internalType: 'struct JBTokenAmount',
              name: 'forwardedAmount',
              type: 'tuple',
            },
            {
              internalType: 'address payable',
              name: 'beneficiary',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'memo',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: 'metadata',
              type: 'bytes',
            },
          ],
          indexed: false,
          internalType: 'struct JBDidRedeemData',
          name: 'data',
          type: 'tuple',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'delegatedAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'DelegateDidRedeem',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fundingCycleConfiguration',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fundingCycleNumber',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'projectId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'distributedAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'fee',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'beneficiaryDistributionAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'metadata',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'DistributePayouts',
      type: 'event',
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
          internalType: 'uint256',
          name: 'domain',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'group',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'bool',
              name: 'preferClaimed',
              type: 'bool',
            },
            {
              internalType: 'bool',
              name: 'preferAddToBalance',
              type: 'bool',
            },
            {
              internalType: 'uint256',
              name: 'percent',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
            },
            {
              internalType: 'address payable',
              name: 'beneficiary',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'lockedUntil',
              type: 'uint256',
            },
            {
              internalType: 'contract IJBSplitAllocator',
              name: 'allocator',
              type: 'address',
            },
          ],
          indexed: false,
          internalType: 'struct JBSplit',
          name: 'split',
          type: 'tuple',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'netAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'DistributeToPayoutSplit',
      type: 'event',
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
          internalType: 'uint256',
          name: 'feeProjectId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'reason',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'FeeReverted',
      type: 'event',
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
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fee',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'feeDiscount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'HoldFee',
      type: 'event',
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
          internalType: 'contract IJBPaymentTerminal',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'Migrate',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fundingCycleConfiguration',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fundingCycleNumber',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'projectId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'payer',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'beneficiaryTokenCount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'memo',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'metadata',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'Pay',
      type: 'event',
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
          components: [
            {
              internalType: 'bool',
              name: 'preferClaimed',
              type: 'bool',
            },
            {
              internalType: 'bool',
              name: 'preferAddToBalance',
              type: 'bool',
            },
            {
              internalType: 'uint256',
              name: 'percent',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
            },
            {
              internalType: 'address payable',
              name: 'beneficiary',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'lockedUntil',
              type: 'uint256',
            },
            {
              internalType: 'contract IJBSplitAllocator',
              name: 'allocator',
              type: 'address',
            },
          ],
          indexed: false,
          internalType: 'struct JBSplit',
          name: 'split',
          type: 'tuple',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'reason',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'PayoutReverted',
      type: 'event',
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
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'bool',
          name: 'wasHeld',
          type: 'bool',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'ProcessFee',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fundingCycleConfiguration',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fundingCycleNumber',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'projectId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'holder',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenCount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'reclaimedAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'memo',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'metadata',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'RedeemTokens',
      type: 'event',
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
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'refundedFees',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'leftoverAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'RefundHeldFees',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'fee',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'SetFee',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'contract IJBFeeGauge',
          name: 'feeGauge',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'SetFeeGauge',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'addrs',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'bool',
          name: 'flag',
          type: 'bool',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'SetFeelessAddress',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fundingCycleConfiguration',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fundingCycleNumber',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'projectId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'distributedAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'netDistributedamount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'memo',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'metadata',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'UseAllowance',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_projectId',
          type: 'uint256',
        },
      ],
      name: 'acceptsToken',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
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
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'string',
          name: '_memo',
          type: 'string',
        },
        {
          internalType: 'bytes',
          name: '_metadata',
          type: 'bytes',
        },
      ],
      name: 'addToBalanceOf',
      outputs: [],
      stateMutability: 'payable',
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
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'bool',
          name: '_shouldRefundHeldFees',
          type: 'bool',
        },
        {
          internalType: 'string',
          name: '_memo',
          type: 'string',
        },
        {
          internalType: 'bytes',
          name: '_metadata',
          type: 'bytes',
        },
      ],
      name: 'addToBalanceOf',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'baseWeightCurrency',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'currency',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
      ],
      name: 'currencyForToken',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
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
      name: 'currentEthOverflowOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
      ],
      name: 'decimalsForToken',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'directory',
      outputs: [
        {
          internalType: 'contract IJBDirectory',
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
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_currency',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_minReturnedTokens',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: '_memo',
          type: 'bytes',
        },
      ],
      name: 'distributePayoutsOf',
      outputs: [
        {
          internalType: 'uint256',
          name: 'netLeftoverDistributionAmount',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'fee',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'feeGauge',
      outputs: [
        {
          internalType: 'contract IJBFeeGauge',
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
      ],
      name: 'heldFeesOf',
      outputs: [
        {
          components: [
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'uint32',
              name: 'fee',
              type: 'uint32',
            },
            {
              internalType: 'uint32',
              name: 'feeDiscount',
              type: 'uint32',
            },
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
            },
          ],
          internalType: 'struct JBFee[]',
          name: '',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'isFeelessAddress',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
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
          internalType: 'contract IJBPaymentTerminal',
          name: '_to',
          type: 'address',
        },
      ],
      name: 'migrate',
      outputs: [
        {
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
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
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
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
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_beneficiary',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_minReturnedTokens',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: '_preferClaimedTokens',
          type: 'bool',
        },
        {
          internalType: 'string',
          name: '_memo',
          type: 'string',
        },
        {
          internalType: 'bytes',
          name: '_metadata',
          type: 'bytes',
        },
      ],
      name: 'pay',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'payoutSplitsGroup',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'prices',
      outputs: [
        {
          internalType: 'contract IJBPrices',
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
      ],
      name: 'processFees',
      outputs: [],
      stateMutability: 'nonpayable',
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
          internalType: 'address',
          name: '_holder',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_projectId',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_tokenCount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_minReturnedTokens',
          type: 'uint256',
        },
        {
          internalType: 'address payable',
          name: '_beneficiary',
          type: 'address',
        },
        {
          internalType: 'string',
          name: '_memo',
          type: 'string',
        },
        {
          internalType: 'bytes',
          name: '_metadata',
          type: 'bytes',
        },
      ],
      name: 'redeemTokensOf',
      outputs: [
        {
          internalType: 'uint256',
          name: 'reclaimAmount',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_fee',
          type: 'uint256',
        },
      ],
      name: 'setFee',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract IJBFeeGauge',
          name: '_feeGauge',
          type: 'address',
        },
      ],
      name: 'setFeeGauge',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_address',
          type: 'address',
        },
        {
          internalType: 'bool',
          name: '_flag',
          type: 'bool',
        },
      ],
      name: 'setFeelessAddress',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'splitsStore',
      outputs: [
        {
          internalType: 'contract IJBSplitsStore',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'store',
      outputs: [
        {
          internalType: 'contract IJBSingleTokenPaymentTerminalStore',
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
          internalType: 'bytes4',
          name: '_interfaceId',
          type: 'bytes4',
        },
      ],
      name: 'supportsInterface',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'token',
      outputs: [
        {
          internalType: 'address',
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
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
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
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_currency',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_minReturnedTokens',
          type: 'uint256',
        },
        {
          internalType: 'address payable',
          name: '_beneficiary',
          type: 'address',
        },
        {
          internalType: 'string',
          name: '_memo',
          type: 'string',
        },
        {
          internalType: 'bytes',
          name: '_metadata',
          type: 'bytes',
        },
      ],
      name: 'useAllowanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: 'netDistributedAmount',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  bytecode: {
    object:
      '0x6101e060405263017d78406002553480156200001a57600080fd5b5060405162006f9238038062006f928339810160408190526200003d9162000281565b8a8b6001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156200007d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000a3919062000363565b6001600160a01b0382811660805260ff9190911660a081905260c08d905290891660e0528b8b8b8b8b8b8b8b8b8b620000dc336200013a565b6101a08990526101c08890526001600160a01b03808716610100528581166101205284811661014052838116610160528216610180526200011d816200018a565b50505050505050505050505050505050505050505050506200038f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b620001946200020d565b6001600160a01b038116620001ff5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b6200020a816200013a565b50565b6000546001600160a01b03163314620002695760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401620001f6565b565b6001600160a01b03811681146200020a57600080fd5b60008060008060008060008060008060006101608c8e031215620002a457600080fd5b8b51620002b1816200026b565b809b505060208c0151995060408c0151985060608c0151975060808c0151620002da816200026b565b60a08d0151909750620002ed816200026b565b60c08d015190965062000300816200026b565b60e08d015190955062000313816200026b565b6101008d015190945062000327816200026b565b6101208d01519093506200033b816200026b565b6101408d01519092506200034f816200026b565b809150509295989b509295989b9093969950565b6000602082840312156200037657600080fd5b815160ff811681146200038857600080fd5b9392505050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a0516101c0516169686200062a600039600081816103ef01526127460152600081816103270152611e7801526000818161051701528181610e2a0152818161161a01528181611e46015281816125c201528181612dc501528181612ec30152818161327301528181613426015281816148f30152614d1a01526000818161067601526117b80152600081816102db0152613d5701526000818161062f0152818161098701528181610a8d0152818161187601528181611f4201528181612b810152818161352301528181613bd30152614a3e0152600081816104c501528181610c9a015281816111cc01528181611536015281816126a00152612fab01526000818161058b015281816123da0152818161249a0152818161296f0152612a2f0152600081816102860152818161072e015281816116ea0152818161176501528181611e2001528181612115015281816136a2015261376101526000818161035b015281816105fb0152818161168b015281816116b7015281816117170152818161179201528181611dfa015281816120ef0152818161367c0152818161373b01526146af0152600081816106ec0152818161078201528181610b3001528181610d4b01528181610eb501528181610f410152818161192101528181611c2301528181611cb801528181611cf201528181611dc5015281816120ba015281816122010152818161254b01528181612b5601528181612bf401528181612cd501528181613646015281816137060152818161380f01528181613ba60152818161409b0152818161467a0152818161473d01528181614a6b01528181614bfa01528181614c3801528181614de40152614e2801526169686000f3fe6080604052600436106102195760003560e01c80638da5cb5b1161011d578063c715967a116100b0578063df21a7dd1161007f578063f2fde38b11610064578063f2fde38b14610750578063fc0c546a14610770578063fe663f0f146107a457600080fd5b8063df21a7dd146106ce578063e5a6b10f1461071c57600080fd5b8063c715967a14610651578063d3419bf314610664578063d6dacc5314610698578063ddca3f43146106b857600080fd5b8063ad007d63116100ec578063ad007d6314610579578063b631b500146105ad578063b7bad1b1146105dd578063c41c2f241461061d57600080fd5b80638da5cb5b146104e7578063975057e714610505578063a02f801c14610539578063a32e1e961461055957600080fd5b80634a4305c0116101b0578063715018a61161017f57806389701db51161016457806389701db5146104665780638af56094146104865780638b79543c146104b357600080fd5b8063715018a6146104315780637258002c1461044657600080fd5b80634a4305c01461039d578063637913ac146103bd57806366248b86146103dd57806369fe0e2d1461041157600080fd5b80632bdfe004116101ec5780632bdfe004146102c95780632d1a590314610315578063313ce56714610349578063405b84fa1461037d57600080fd5b806301ffc9a71461021e5780630cf8e858146102535780631982d679146102685780631ebc263f146102b6575b600080fd5b34801561022a57600080fd5b5061023e610239366004615471565b6107c4565b60405190151581526020015b60405180910390f35b610266610261366004615511565b610950565b005b34801561027457600080fd5b506102a86102833660046155a7565b507f000000000000000000000000000000000000000000000000000000000000000090565b60405190815260200161024a565b6102a86102c43660046155d2565b610a4b565b3480156102d557600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161024a565b34801561032157600080fd5b506102a87f000000000000000000000000000000000000000000000000000000000000000081565b34801561035557600080fd5b506102a87f000000000000000000000000000000000000000000000000000000000000000081565b34801561038957600080fd5b506102a861039836600461569a565b610c68565b3480156103a957600080fd5b506102a86103b83660046156ca565b610feb565b3480156103c957600080fd5b506102666103d83660046155a7565b611007565b3480156103e957600080fd5b506102a87f000000000000000000000000000000000000000000000000000000000000000081565b34801561041d57600080fd5b5061026661042c366004615734565b61107b565b34801561043d57600080fd5b50610266611101565b34801561045257600080fd5b5061026661046136600461574d565b611115565b34801561047257600080fd5b50610266610481366004615734565b61119d565b34801561049257600080fd5b506104a66104a1366004615734565b611452565b60405161024a919061577b565b3480156104bf57600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b3480156104f357600080fd5b506000546001600160a01b03166102fd565b34801561051157600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b34801561054557600080fd5b506102a861055436600461593f565b611504565b34801561056557600080fd5b506102a8610574366004615734565b6115d8565b34801561058557600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b3480156105b957600080fd5b5061023e6105c83660046155a7565b60046020526000908152604090205460ff1681565b3480156105e957600080fd5b506102a86105f83660046155a7565b507f000000000000000000000000000000000000000000000000000000000000000090565b34801561062957600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b61026661065f3660046159f8565b61183f565b34801561067057600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b3480156106a457600080fd5b506003546102fd906001600160a01b031681565b3480156106c457600080fd5b506102a860025481565b3480156106da57600080fd5b5061023e6106e9366004615aa0565b507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0390811691161490565b34801561072857600080fd5b506102a87f000000000000000000000000000000000000000000000000000000000000000081565b34801561075c57600080fd5b5061026661076b3660046155a7565b611a40565b34801561077c57600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b3480156107b057600080fd5b506102a86107bf366004615acc565b611aef565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fedb527eb00000000000000000000000000000000000000000000000000000000148061085757507fffffffff0000000000000000000000000000000000000000000000000000000082167f4a4305c000000000000000000000000000000000000000000000000000000000145b806108a357507fffffffff0000000000000000000000000000000000000000000000000000000082167fa02f801c00000000000000000000000000000000000000000000000000000000145b806108ef57507fffffffff0000000000000000000000000000000000000000000000000000000082167ffe663f0f00000000000000000000000000000000000000000000000000000000145b8061093b57507fffffffff0000000000000000000000000000000000000000000000000000000082167fad007d6300000000000000000000000000000000000000000000000000000000145b8061094a575061094a82611b0f565b92915050565b6040517f6e49181f0000000000000000000000000000000000000000000000000000000081526004810188905230602482015287907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636e49181f90604401602060405180830381865afa1580156109d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109fa9190615b85565b610a30576040517fd8ead2c800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610a4188888860008989898961183f565b5050505050505050565b6040517f6e49181f000000000000000000000000000000000000000000000000000000008152600481018b90523060248201526000908b906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690636e49181f90604401602060405180830381865afa158015610ad4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610af89190615b85565b610b2e576040517fd8ead2c800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661eeee14610bca573415610b98576040517fbcfd35be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000610ba2611bf2565b9050610baf33308e611c9b565b80610bb8611bf2565b610bc29190615bd1565b9b5050610bce565b349a505b610c588b338e8c8c8c8c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050508b8b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611d1992505050565b9c9b505050505050505050505050565b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018390526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa158015610ce9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d0d9190615be4565b836004610d1b83838361237a565b6040517fdf21a7dd0000000000000000000000000000000000000000000000000000000081526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301526024820188905286169063df21a7dd90604401602060405180830381865afa158015610da1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc59190615b85565b610dfb576040517f581010ed00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f6bb6a5ad000000000000000000000000000000000000000000000000000000008152600481018790527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636bb6a5ad906024016020604051808303816000875af1158015610e7b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e9f9190615c01565b93508315610f9d57610eb1858561253e565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661eeee14610eec576000610eee565b845b604080516020810182526000815290517f0cf8e8580000000000000000000000000000000000000000000000000000000081529192506001600160a01b03881691630cf8e858918491610f69918c918b917f000000000000000000000000000000000000000000000000000000000000000091600401615c6a565b6000604051808303818588803b158015610f8257600080fd5b505af1158015610f96573d6000803e3d6000fd5b5050505050505b604080518581523360208201526001600160a01b0387169188917fa7519e5f94697b7f53e97c5eb46a0c730a296ab686ab8fd333835c5f735784eb910160405180910390a350505092915050565b6000610ffb888888878787612576565b98975050505050505050565b61100f612829565b600380547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0383169081179091556040513381527f0a9a80fe9716605b3e52abb3d792d6a4e7816d6afc02a5a4ef023081feaf9f609060200160405180910390a250565b611083612829565b6302faf0808111156110c1576040517f45fbd9c100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002819055604080518281523360208201527fd7414e590e1cb532989ab2a34c8f4c2c17f7ab6f006efeeaef2e87cd5008c202910160405180910390a150565b611109612829565b611113600061289d565b565b61111d612829565b6001600160a01b03821660008181526004602090815260409182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001685151590811790915591513381529192917fa2653e25a502c023a5830d0de847ef6f458387865b1f4f575d7594f9f2c0d71e910160405180910390a35050565b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa15801561121b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061123f9190615be4565b8160056112546000546001600160a01b031690565b6001600160a01b0316336001600160a01b03161461127484848484612905565b600085815260016020908152604080832080548251818502810185019093528083529192909190849084015b8282101561131257600084815260209081902060408051608081018252600286029092018054835260019081015463ffffffff8082168587015264010000000082041692840192909252680100000000000000009091046001600160a01b0316606083015290835290920191016112a0565b5050506000888152600160205260408120929350611331929150615412565b805160005b81811015610a415760006113ae84838151811061135557611355615cb0565b60200260200101516000015185848151811061137357611373615cb0565b60200260200101516020015163ffffffff1686858151811061139757611397615cb0565b60200260200101516040015163ffffffff16612ad9565b90506113d8818584815181106113c6576113c6615cb0565b6020026020010151606001518b612b1f565b60011515818a7fcf0c92a2c6d7c42f488326b0cb900104b99984b6b218db81cd29371364a3525187868151811061141157611411615cb0565b602002602001015160600151336040516114419291906001600160a01b0392831681529116602082015260400190565b60405180910390a450600101611336565b606060016000838152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156114f957600084815260209081902060408051608081018252600286029092018054835260019081015463ffffffff8082168587015264010000000082041692840192909252680100000000000000009091046001600160a01b031660608301529083529092019101611487565b505050509050919050565b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018a90526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa158015611585573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115a99190615be4565b8a60116115b783838361237a565b6115c78d8d8d8c8c8c8c8c612e77565b9d9c50505050505050505050505050565b6040517fd49031c00000000000000000000000000000000000000000000000000000000081523060048201526024810182905260009081906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063d49031c090604401602060405180830381865afa158015611661573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116859190615c01565b905060007f00000000000000000000000000000000000000000000000000000000000000006012146116e2576116dd827f000000000000000000000000000000000000000000000000000000000000000060126130ee565b6116e4565b815b905060017f000000000000000000000000000000000000000000000000000000000000000014611835576118308161173d7f0000000000000000000000000000000000000000000000000000000000000000600a615dff565b6040517fa4d0caf20000000000000000000000000000000000000000000000000000000081527f00000000000000000000000000000000000000000000000000000000000000006004820152600160248201527f000000000000000000000000000000000000000000000000000000000000000060448201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063a4d0caf290606401602060405180830381865afa158015611807573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061182b9190615c01565b61314b565b611837565b805b949350505050565b6040517f6e49181f0000000000000000000000000000000000000000000000000000000081526004810189905230602482015288907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636e49181f90604401602060405180830381865afa1580156118c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118e99190615b85565b61191f576040517fd8ead2c800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661eeee146119bb573415611989576040517fbcfd35be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000611993611bf2565b90506119a033308b611c9b565b806119a9611bf2565b6119b39190615bd1565b9850506119bf565b3497505b611a3589898888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8c018190048102820181019092528a815292508a915089908190840183828082843760009201919091525061324f92505050565b505050505050505050565b611a48612829565b6001600160a01b038116611ae3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b611aec8161289d565b50565b600088886002611b0083838361237a565b610c588c8c8c8b8b8b8b613359565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fc07370e4000000000000000000000000000000000000000000000000000000001480611ba257507fffffffff0000000000000000000000000000000000000000000000000000000082167f2896000200000000000000000000000000000000000000000000000000000000145b8061094a57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff0000000000000000000000000000000000000000000000000000000083161461094a565b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015611c72573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c969190615c01565b905090565b6001600160a01b0383163014611ce557611ce06001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016848484613996565b505050565b611ce06001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168383613a47565b60006001600160a01b038616611d5b576040517fa762251300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b611db36040518061012001604052806000815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b03168152602001600081525090565b606060008060405180608001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031681526020018e81526020017f000000000000000000000000000000000000000000000000000000000000000081526020017f000000000000000000000000000000000000000000000000000000000000000081525090507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632fa1b3918d838e7f00000000000000000000000000000000000000000000000000000000000000008f8d8d6040518863ffffffff1660e01b8152600401611ebc9796959493929190615e0b565b6000604051808303816000875af1158015611edb573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611f039190810190615f98565b99509195509093509150811561206a576040517f5dd8f6aa000000000000000000000000000000000000000000000000000000008152600481018c90527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690635dd8f6aa90602401602060405180830381865afa158015611f91573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611fb59190615be4565b6040517f8ae9c07b000000000000000000000000000000000000000000000000000000008152600481018d9052602481018490526001600160a01b038c8116604483015260c06064830152600060c48301528a15156084830152600160a48301529190911690638ae9c07b9060e4016020604051808303816000875af1158015612043573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120679190615c01565b94505b888510156120a4576040517f7b94612600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b82511561231c57600060405180608001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031681526020018f81526020017f000000000000000000000000000000000000000000000000000000000000000081526020017f0000000000000000000000000000000000000000000000000000000000000000815250905060006040518061014001604052808f6001600160a01b031681526020018e8152602001876020015181526020018481526020018381526020018881526020018d6001600160a01b031681526020018b151581526020018a815260200189815250905060008551905060005b818110156123175760008782815181106121c0576121c0615cb0565b602002602001015190506121dc8160000151826020015161253e565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff11127f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031601612235575060208101515b60208083015160808701519091015281516040517fda9ee8b70000000000000000000000000000000000000000000000000000000081526001600160a01b039091169063da9ee8b790839061228e908990600401616194565b6000604051808303818588803b1580156122a757600080fd5b505af11580156122bb573d6000803e3d6000fd5b505050505081600001516001600160a01b03167f16112c26e14efc4be6c690149aa5a1ba75160de245f60d2273e28adb277b9e1286846020015133604051612305939291906161a7565b60405180910390a250506001016121a4565b505050505b50505087816000015182602001517f133161f1c9161488f777ab9a26aae91d47c0d9a3fafb398960f138db02c737978c8b8f888b8b3360405161236597969594939291906161d9565b60405180910390a45098975050505050505050565b336001600160a01b0384161480159061244757506040517fc161c93f0000000000000000000000000000000000000000000000000000000081523360048201526001600160a01b03848116602483015260448201849052606482018390527f0000000000000000000000000000000000000000000000000000000000000000169063c161c93f90608401602060405180830381865afa158015612421573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124459190615b85565b155b801561250757506040517fc161c93f0000000000000000000000000000000000000000000000000000000081523360048201526001600160a01b03848116602483015260006044830152606482018390527f0000000000000000000000000000000000000000000000000000000000000000169063c161c93f90608401602060405180830381865afa1580156124e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125059190615b85565b155b15611ce0576040517f075fd2b100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6125726001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168383613a90565b5050565b6040517fc6644597000000000000000000000000000000000000000000000000000000008152600481018790526024810186905260448101859052600090819081906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063c664459790606401610140604051808303816000875af115801561260c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612630919061623a565b915091508581101561266e576040517fb01493c100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018a90526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa1580156126ef573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127139190615be4565b90506000806002546000146127305761272b8c613b6f565b612736565b633b9aca005b905060008061276c8e88602001517f00000000000000000000000000000000000000000000000000000000000000008987613d0d565b92509050633b9aca00831461278057908101905b8160000361278f57600061279c565b61279c8e88848887613ece565b935080156127c8576127b18160025485612ad9565b6127bb9082615bd1565b97506127c830868a611c9b565b5050508a846000015185602001517fc41a8d26c70cfcf1b9ea10f82482ac947b8be5bea2750bc729af844bbfde1e28858e88878c8f8f33604051612813989796959493929190616294565b60405180910390a4505050509695505050505050565b6000546001600160a01b03163314611113576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401611ada565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b8015801561291c5750336001600160a01b03851614155b80156129dc57506040517fc161c93f0000000000000000000000000000000000000000000000000000000081523360048201526001600160a01b03858116602483015260448201859052606482018490527f0000000000000000000000000000000000000000000000000000000000000000169063c161c93f90608401602060405180830381865afa1580156129b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129da9190615b85565b155b8015612a9c57506040517fc161c93f0000000000000000000000000000000000000000000000000000000081523360048201526001600160a01b03858116602483015260006044830152606482018490527f0000000000000000000000000000000000000000000000000000000000000000169063c161c93f90608401602060405180830381865afa158015612a76573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a9a9190615b85565b155b15612ad3576040517f075fd2b100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505050565b600080612aeb8484633b9aca0061314b565b612af59085615bd1565b9050612b0a85633b9aca0061182b81856162e8565b612b149086615bd1565b9150505b9392505050565b6040517f86202650000000000000000000000000000000000000000000000000000000008152600160048201526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660248301526000917f000000000000000000000000000000000000000000000000000000000000000090911690638620265090604401602060405180830381865afa158015612bca573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612bee9190615be4565b905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661eeee14612c2b576000612c2d565b845b6040805160208082528183019092529192506000919060208201818036833701905050905083604051602001612c6591815260200190565b60408051601f1981840301815291905290506001600160a01b0383163014612c9157612c91838761253e565b6040517f1ebc263f0000000000000000000000000000000000000000000000000000000081526001600160a01b03841690631ebc263f908490612d06906001908b907f0000000000000000000000000000000000000000000000000000000000000000908c9060009081908b906004016162fb565b60206040518083038185885af193505050508015612d41575060408051601f3d908101601f19168201909252612d3e91810190615c01565b60015b612e6d573d808015612d6f576040519150601f19603f3d011682016040523d82523d6000602084013e612d74565b606091505b506001600160a01b0384163014612d8f57612d8f848861408e565b6040517fe7c8e3e300000000000000000000000000000000000000000000000000000000815260048101869052602481018890527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063e7c8e3e390604401600060405180830381600087803b158015612e1157600080fd5b505af1158015612e25573d6000803e3d6000fd5b505050506001857f80a889d08f0d59eb962335b57fb1d5b29e86e3d23f15087b5541fddf15422bbe898433604051612e5f93929190616352565b60405180910390a350612e6f565b505b505050505050565b6040517f25386715000000000000000000000000000000000000000000000000000000008152600481018990526024810188905260448101879052600090819081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690632538671590606401610140604051808303816000875af1158015612f0d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f31919061623a565b9150915087811015612f6f576040517fb01493c100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018c905260009081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690636352211e90602401602060405180830381865afa158015612ff2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906130169190615be4565b905060006002546000148061303a57503360009081526004602052604090205460ff165b61304c576130478e613b6f565b613052565b633b9aca005b9050633b9aca0081146130715761306c8e86868585613ece565b613074565b60005b8085039650925083831461308d5761308d308b88611c9b565b5050508a826000015183602001517f2eeee47c6d8d31c3523c3aa07b4c3e3795db36be4c04546ef3e30a5102f568e18a8e86898d8d8d336040516130d8989796959493929190616384565b60405180910390a4505098975050505050505050565b60008282036130fe575082612b18565b8282111561312c576131108383615bd1565b61311b90600a615dff565b61312590856163e5565b9050612b18565b6131368284615bd1565b61314190600a615dff565b613125908561642b565b600080807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff858709858702925082811083820303915050806000036131a357838281613199576131996163fc565b0492505050612b18565b8381106131e6576040517f773cc18c0000000000000000000000000000000000000000000000000000000081526004810182905260248101859052604401611ada565b60008486880960026001871981018816978890046003810283188082028403028082028403028082028403028082028403028082028403029081029092039091026000889003889004909101858311909403939093029303949094049190911702949350505050565b60008361325d576000613267565b61326786866140c2565b90506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001663e7c8e3e3876132a384896162e8565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815260048101929092526024820152604401600060405180830381600087803b1580156132f957600080fd5b505af115801561330d573d6000803e3d6000fd5b50505050857f9ecaf7fc3dfffd6867c175d6e684b1f1e3aef019398ba8db2c1ffab4a09db2538683868633604051613349959493929190616466565b60405180910390a2505050505050565b60006001600160a01b03841661339b576040517ff74a1b6600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6133f36040518061012001604052806000815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b03168152602001600081525090565b6040517fa2df1f950000000000000000000000000000000000000000000000000000000081526060906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063a2df1f9590613463908d908d908d908b908b906004016164b3565b6000604051808303816000875af1158015613482573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526134aa91908101906164f3565b97509094509092509050868310156134ee576040517ff896960b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8715613630576040517f5dd8f6aa000000000000000000000000000000000000000000000000000000008152600481018a90527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690635dd8f6aa90602401602060405180830381865afa158015613572573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906135969190615be4565b6040517f1665bc0f0000000000000000000000000000000000000000000000000000000081526001600160a01b038c81166004830152602482018c9052604482018b905260a06064830152600060a4830181905260848301529190911690631665bc0f9060c401600060405180830381600087803b15801561361757600080fd5b505af115801561362b573d6000803e3d6000fd5b505050505b80511561392a57600060405180608001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602001600081526020017f000000000000000000000000000000000000000000000000000000000000000081526020017f0000000000000000000000000000000000000000000000000000000000000000815250905060006040518061012001604052808d6001600160a01b031681526020018c8152602001856020015181526020018b815260200160405180608001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031681526020018881526020017f000000000000000000000000000000000000000000000000000000000000000081526020017f00000000000000000000000000000000000000000000000000000000000000008152508152602001838152602001896001600160a01b0316815260200188815260200187815250905060008351905060005b818110156139255760008582815181106137ce576137ce615cb0565b602002602001015190506137ea8160000151826020015161253e565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff11127f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031601613843575060208101515b60208083015160a08701519091015281516040517f2b13c58f0000000000000000000000000000000000000000000000000000000081526001600160a01b0390911690632b13c58f90839061389c9089906004016166b6565b6000604051808303818588803b1580156138b557600080fd5b505af11580156138c9573d6000803e3d6000fd5b505050505081600001516001600160a01b03167f54b3744c489f40987dd2726ca12131243334e8292f567389f761c5a432d813e486846020015133604051613913939291906166c9565b60405180910390a250506001016137b2565b505050505b50811561393c5761393c308684611c9b565b87816000015182602001517f2be10f2a0203c77d0fcaa9fd6484a8a1d6904de31cd820587f60c1c8c338c8148c898c888b8b3360405161398297969594939291906161d9565b60405180910390a450979650505050505050565b6040516001600160a01b0380851660248301528316604482015260648101829052612ad39085907f23b872dd00000000000000000000000000000000000000000000000000000000906084015b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909316929092179091526144f9565b6040516001600160a01b038316602482015260448101829052611ce09084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064016139e3565b6040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b0383811660248301526000919085169063dd62ed3e90604401602060405180830381865afa158015613af9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613b1d9190615c01565b9050612ad3847f095ea7b30000000000000000000000000000000000000000000000000000000085613b4f86866162e8565b6040516001600160a01b03909216602483015260448201526064016139e3565b6040517f86202650000000000000000000000000000000000000000000000000000000008152600160048201526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116602483015260009182917f00000000000000000000000000000000000000000000000000000000000000001690638620265090604401602060405180830381865afa158015613c1a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613c3e9190615be4565b6001600160a01b031603613c575750633b9aca00919050565b6003546001600160a01b031615613d05576003546040517f77695896000000000000000000000000000000000000000000000000000000008152600481018490526001600160a01b0390911690637769589690602401602060405180830381865afa925050508015613ce6575060408051601f3d908101601f19168201909252613ce391810190615c01565b60015b613cf257506000919050565b633b9aca008111613d035792915050565b505b506000919050565b6040517f69e11cc50000000000000000000000000000000000000000000000000000000081526004810186905260248101859052604481018490528290600090633b9aca009082907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906369e11cc590606401600060405180830381865afa158015613da6573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052613dce91908101906166dc565b905060005b8151811015613ec1576000828281518110613df057613df0615cb0565b60200260200101519050600084826040015114613e1f57613e1a898360400151633b9aca0061314b565b613e21565b865b9050816040015185613e339190615bd1565b94506000613e44838e8d858d6145fb565b90508015801590613e555750818114155b15613e6757613e6482886162e8565b96505b8115613e735781880397505b8a8c8e7f0d31ab573f6daa4b1edba8d31973b4ba9f98fbfecc47010c1533eeefd2a1225a86868633604051613eab94939291906167e6565b60405180910390a4836001019350505050613dd3565b5050509550959350505050565b6000613edd8460025484612ad9565b610100860151909150604f1c60019081160361403157600086815260016020818152604080842081516080810183528981526002805463ffffffff9081168387019081528a82168487019081526001600160a01b03808e16606087019081528754808c018955978c5298909a209451958402909401948555519390960180549251955190971668010000000000000000027fffffffff0000000000000000000000000000000000000000ffffffffffffffff958716640100000000027fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000909316939096169290921717929092169290921790925590549051859088907f77813be0661650ddc1a5193ff2837df4162b251cb432651e2c060c3fc39756be90614024908790899033909283526001600160a01b03918216602084015216604082015260600190565b60405180910390a4614085565b61403c818488612b1f565b604080516001600160a01b0385168152336020820152600091839189917fcf0c92a2c6d7c42f488326b0cb900104b99984b6b218db81cd29371364a35251910160405180910390a45b95945050505050565b6125726001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168383614f71565b600082815260016020908152604080832080548251818502810185019093528083528493849084015b8282101561415d57600084815260209081902060408051608081018252600286029092018054835260019081015463ffffffff8082168587015264010000000082041692840192909252680100000000000000009091046001600160a01b0316606083015290835290920191016140eb565b505050600086815260016020526040812092935061417c929150615412565b8051839060005b818110156144b1578260000361427357600087815260016020526040902084518590839081106141b5576141b5615cb0565b60209081029190910181015182546001818101855560009485529383902082516002909202019081559181015191909201805460408401516060909401516001600160a01b031668010000000000000000027fffffffff0000000000000000000000000000000000000000ffffffffffffffff63ffffffff958616640100000000027fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000909316959094169490941717919091169190911790556144a9565b83818151811061428557614285615cb0565b6020026020010151600001518310614319578381815181106142a9576142a9615cb0565b602002602001015160000151830392506143108482815181106142ce576142ce615cb0565b6020026020010151600001518583815181106142ec576142ec615cb0565b60200260200101516020015163ffffffff1686848151811061139757611397615cb0565b850194506144a9565b6001600088815260200190815260200160002060405180608001604052808587858151811061434a5761434a615cb0565b60200260200101516000015103815260200186848151811061436e5761436e615cb0565b60200260200101516020015163ffffffff16815260200186848151811061439757614397615cb0565b60200260200101516040015163ffffffff1681526020018684815181106143c0576143c0615cb0565b6020908102919091018101516060908101516001600160a01b039081169093528454600181810187556000968752958390208551600290920201908155918401519190940180546040850151949095015190921668010000000000000000027fffffffff0000000000000000000000000000000000000000ffffffffffffffff63ffffffff948516640100000000027fffffffffffffffffffffffffffffffffffffffffffffffff00000000000000009096169490921693909317939093179290921617905583516144a09084908690849081106142ec576142ec615cb0565b85019450600092505b600101614183565b50604080518381523360208201528591879189917f59860d79d97c1fce2be7f987915c631471f4b08f671200463cc40a3380194ffb910160405180910390a450505092915050565b600061454e826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166150da9092919063ffffffff16565b905080516000148061456f57508080602001905181019061456f9190615b85565b611ce0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401611ada565b60c08501516000906001600160a01b0316156149fc57633b9aca0082148061463f575060c08601516001600160a01b031660009081526004602052604090205460ff165b1561464b57508161465d565b6146588360025484612ad9565b830390505b61466b8660c001518261253e565b60006040518060c001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031681526020018381526020017f00000000000000000000000000000000000000000000000000000000000000008152602001878152602001868152602001888152509050600060606147178960c001517f9d740bfa000000000000000000000000000000000000000000000000000000006150e9565b156148a0578860c001516001600160a01b0316639d740bfa61eeee6001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614614771576000614773565b855b604080517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815287516001600160a01b0390811660048301526020808a01516024840152838a015160448401526060808b015160648501526080808c0151608486015260a0808d01518051151560a488015293840151151560c48701529583015160e48601529082015161010485015281015182166101248401529283015161014483015260c090920151909116610164820152610184016000604051808303818588803b15801561484a57600080fd5b505af19350505050801561485c575060015b61489b573d80801561488a576040519150601f19603f3d011682016040523d82523d6000602084013e61488f565b606091505b506001925090506148a5565b6148a5565b600291505b81156149f4576148b98960c001518561408e565b6040517fe7c8e3e30000000000000000000000000000000000000000000000000000000081526004810189905260248101879052600094507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063e7c8e3e390604401600060405180830381600087803b15801561493f57600080fd5b505af1158015614953573d6000803e3d6000fd5b50505050877f290b5df59e172593762964e4f8ed2b4a9192d3197bfd2be4bae123908f8007968a88856001146149d8576040516020016149c4906020808252600c908201527f49455243313635206661696c0000000000000000000000000000000000000000604082015260600190565b6040516020818303038152906040526149da565b845b336040516149eb949392919061686d565b60405180910390a25b505050614085565b606086015115614f145760608601516040517f862026500000000000000000000000000000000000000000000000000000000081526000916001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001691638620265091614aa5917f0000000000000000000000000000000000000000000000000000000000000000906004019182526001600160a01b0316602082015260400190565b602060405180830381865afa158015614ac2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614ae69190615be4565b90506001600160a01b038116614b28576040517f6921234300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600160a01b038116301480614b425750633b9aca0083145b80614b6557506001600160a01b03811660009081526004602052604090205460ff165b15614b7257839150614b84565b614b7f8460025485612ad9565b840391505b614b8e818361253e565b60408051602080825281830190925260009160208201818036833701905050905086604051602001614bc291815260200190565b6040516020818303038152906040529050876020015115614dc757816001600160a01b0316630cf8e85861eeee6001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614614c2e576000614c30565b845b8a60600151867f0000000000000000000000000000000000000000000000000000000000000000866040518663ffffffff1660e01b8152600401614c779493929190615c6a565b6000604051808303818588803b158015614c9057600080fd5b505af193505050508015614ca2575060015b614dc2573d808015614cd0576040519150601f19603f3d011682016040523d82523d6000602084013e614cd5565b606091505b50614ce0838561408e565b6040517fe7c8e3e30000000000000000000000000000000000000000000000000000000081526004810189905260248101879052600094507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063e7c8e3e390604401600060405180830381600087803b158015614d6657600080fd5b505af1158015614d7a573d6000803e3d6000fd5b50505050877f290b5df59e172593762964e4f8ed2b4a9192d3197bfd2be4bae123908f8007968a888433604051614db4949392919061686d565b60405180910390a250614f0d565b614f0d565b816001600160a01b0316631ebc263f61eeee6001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614614e18576000614e1a565b845b60608b015160808c015187907f0000000000000000000000000000000000000000000000000000000000000000906001600160a01b0316614e5b5733614e61565b8d608001515b8e516040517fffffffff0000000000000000000000000000000000000000000000000000000060e089901b168152614ea495949392916000918b906004016162fb565b60206040518083038185885af193505050508015614edf575060408051601f3d908101601f19168201909252614edc91810190615c01565b60015b6149f4573d808015614cd0576040519150601f19603f3d011682016040523d82523d6000602084013e614cd5565b5050614085565b60808601516000906001600160a01b0316614f2f5733614f35565b86608001515b9050633b9aca008303614f4a57839150614f5c565b614f578460025485612ad9565b840391505b614f67308284611c9b565b5095945050505050565b6040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b0383811660248301526000919085169063dd62ed3e90604401602060405180830381865afa158015614fda573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614ffe9190615c01565b905081811015615090576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f5361666545524332303a2064656372656173656420616c6c6f77616e6365206260448201527f656c6f77207a65726f00000000000000000000000000000000000000000000006064820152608401611ada565b6040516001600160a01b03841660248201528282036044820152612ad39085907f095ea7b300000000000000000000000000000000000000000000000000000000906064016139e3565b60606118378484600085615105565b60006150f483615211565b8015612b185750612b188383615275565b606082471015615197576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401611ada565b600080866001600160a01b031685876040516151b39190616903565b60006040518083038185875af1925050503d80600081146151f0576040519150601f19603f3d011682016040523d82523d6000602084013e6151f5565b606091505b509150915061520687838387615340565b979650505050505050565b600061523d827f01ffc9a700000000000000000000000000000000000000000000000000000000615275565b801561094a575061526e827fffffffff00000000000000000000000000000000000000000000000000000000615275565b1592915050565b604080517fffffffff000000000000000000000000000000000000000000000000000000008316602480830191909152825180830390910181526044909101909152602080820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f01ffc9a700000000000000000000000000000000000000000000000000000000178152825160009392849283928392918391908a617530fa92503d9150600051905082801561532d575060208210155b8015615206575015159695505050505050565b606083156153c95782516000036153c2576001600160a01b0385163b6153c2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401611ada565b5081611837565b61183783838151156153de5781518083602001fd5b806040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ada919061691f565b5080546000825560020290600052602060002090810190611aec91905b8082111561546d57600081556001810180547fffffffff0000000000000000000000000000000000000000000000000000000016905560020161542f565b5090565b60006020828403121561548357600080fd5b81357fffffffff0000000000000000000000000000000000000000000000000000000081168114612b1857600080fd5b6001600160a01b0381168114611aec57600080fd5b60008083601f8401126154da57600080fd5b50813567ffffffffffffffff8111156154f257600080fd5b60208301915083602082850101111561550a57600080fd5b9250929050565b600080600080600080600060a0888a03121561552c57600080fd5b87359650602088013595506040880135615545816154b3565b9450606088013567ffffffffffffffff8082111561556257600080fd5b61556e8b838c016154c8565b909650945060808a013591508082111561558757600080fd5b506155948a828b016154c8565b989b979a50959850939692959293505050565b6000602082840312156155b957600080fd5b8135612b18816154b3565b8015158114611aec57600080fd5b6000806000806000806000806000806101008b8d0312156155f257600080fd5b8a35995060208b0135985060408b013561560b816154b3565b975060608b013561561b816154b3565b965060808b0135955060a08b0135615632816155c4565b945060c08b013567ffffffffffffffff8082111561564f57600080fd5b61565b8e838f016154c8565b909650945060e08d013591508082111561567457600080fd5b506156818d828e016154c8565b915080935050809150509295989b9194979a5092959850565b600080604083850312156156ad57600080fd5b8235915060208301356156bf816154b3565b809150509250929050565b600080600080600080600060c0888a0312156156e557600080fd5b8735965060208801359550604088013594506060880135615705816154b3565b93506080880135925060a088013567ffffffffffffffff81111561572857600080fd5b6155948a828b016154c8565b60006020828403121561574657600080fd5b5035919050565b6000806040838503121561576057600080fd5b823561576b816154b3565b915060208301356156bf816155c4565b602080825282518282018190526000919060409081850190868401855b828110156157e4578151805185528681015163ffffffff908116888701528682015116868601526060908101516001600160a01b03169085015260809093019290850190600101615798565b5091979650505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051610120810167ffffffffffffffff81118282101715615844576158446157f1565b60405290565b6040805190810167ffffffffffffffff81118282101715615844576158446157f1565b60405160e0810167ffffffffffffffff81118282101715615844576158446157f1565b604051601f8201601f1916810167ffffffffffffffff811182821017156158b9576158b96157f1565b604052919050565b600067ffffffffffffffff8211156158db576158db6157f1565b50601f01601f191660200190565b600082601f8301126158fa57600080fd5b813561590d615908826158c1565b615890565b81815284602083860101111561592257600080fd5b816020850160208301376000918101602001919091529392505050565b60008060008060008060008060006101008a8c03121561595e57600080fd5b8935985060208a0135975060408a0135965060608a013561597e816154b3565b955060808a0135945060a08a0135615995816154b3565b935060c08a013567ffffffffffffffff808211156159b257600080fd5b6159be8d838e016158e9565b945060e08c01359150808211156159d457600080fd5b506159e18c828d016154c8565b915080935050809150509295985092959850929598565b60008060008060008060008060c0898b031215615a1457600080fd5b88359750602089013596506040890135615a2d816154b3565b95506060890135615a3d816155c4565b9450608089013567ffffffffffffffff80821115615a5a57600080fd5b615a668c838d016154c8565b909650945060a08b0135915080821115615a7f57600080fd5b50615a8c8b828c016154c8565b999c989b5096995094979396929594505050565b60008060408385031215615ab357600080fd5b8235615abe816154b3565b946020939093013593505050565b600080600080600080600080610100898b031215615ae957600080fd5b8835615af4816154b3565b975060208901359650604089013595506060890135615b12816154b3565b94506080890135935060a0890135615b29816154b3565b925060c089013567ffffffffffffffff80821115615b4657600080fd5b615b528c838d016158e9565b935060e08b0135915080821115615b6857600080fd5b50615b758b828c016158e9565b9150509295985092959890939650565b600060208284031215615b9757600080fd5b8151612b18816155c4565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8181038181111561094a5761094a615ba2565b600060208284031215615bf657600080fd5b8151612b18816154b3565b600060208284031215615c1357600080fd5b5051919050565b60005b83811015615c35578181015183820152602001615c1d565b50506000910152565b60008151808452615c56816020860160208601615c1a565b601f01601f19169290920160200192915050565b8481528360208201526001600160a01b038316604082015260a06060820152600060a082015260c060808201526000615ca660c0830184615c3e565b9695505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600181815b80851115615d3857817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115615d1e57615d1e615ba2565b80851615615d2b57918102915b93841c9390800290615ce4565b509250929050565b600082615d4f5750600161094a565b81615d5c5750600061094a565b8160018114615d725760028114615d7c57615d98565b600191505061094a565b60ff841115615d8d57615d8d615ba2565b50506001821b61094a565b5060208310610133831016604e8410600b8410161715615dbb575081810a61094a565b615dc58383615cdf565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115615df757615df7615ba2565b029392505050565b6000612b188383615d40565b60006101406001600160a01b03808b168452615e54602085018b6001600160a01b0381511682526020810151602083015260408101516040830152606081015160608301525050565b8860a08501528760c085015280871660e08501525080610100840152615e7c81840186615c3e565b9050828103610120840152615e918185615c3e565b9a9950505050505050505050565b8051615eaa816154b3565b919050565b60006101208284031215615ec257600080fd5b615eca615820565b9050815181526020820151602082015260408201516040820152606082015160608201526080820151608082015260a082015160a082015260c082015160c0820152615f1860e08301615e9f565b60e082015261010080830151818301525092915050565b600067ffffffffffffffff821115615f4957615f496157f1565b5060051b60200190565b600082601f830112615f6457600080fd5b8151615f72615908826158c1565b818152846020838601011115615f8757600080fd5b611837826020830160208701615c1a565b6000806000806101808587031215615faf57600080fd5b615fb98686615eaf565b9350610120850151925061014085015167ffffffffffffffff80821115615fdf57600080fd5b818701915087601f830112615ff357600080fd5b8151602061600361590883615f2f565b82815260069290921b8401810191818101908b84111561602257600080fd5b948201945b8386101561606e576040868d0312156160405760008081fd5b61604861584a565b8651616053816154b3565b81528684015184820152825260409095019490820190616027565b6101608b015190975094505050508082111561608957600080fd5b5061609687828801615f53565b91505092959194509250565b80516001600160a01b031682526000610200602083810151858201526040808501518187015260608086015180516001600160a01b0316828901529283015160808801529082015160a087015281015160c086015250608083015180516001600160a01b031660e08601526020810151610100860152604081015161012086015260608101516101408601525060a083015161016085015260c08301516001600160a01b0381166101808601525060e08301518015156101a086015250610100830151816101c086015261617882860182615c3e565b9150506101208301518482036101e08601526140858282615c3e565b602081526000612b1860208301846160a2565b6060815260006161ba60608301866160a2565b90508360208301526001600160a01b0383166040830152949350505050565b60006001600160a01b03808a168352808916602084015287604084015286606084015260e0608084015261621060e0840187615c3e565b83810360a08501526162228187615c3e565b92505080841660c08401525098975050505050505050565b600080610140838503121561624e57600080fd5b6162588484615eaf565b915061012083015190509250929050565b818352818160208501375060006020828401015260006020601f19601f840116840101905092915050565b60006001600160a01b03808b16835289602084015288604084015287606084015286608084015260e060a08401526162d060e084018688616269565b915080841660c0840152509998505050505050505050565b8082018082111561094a5761094a615ba2565b60006101008983528860208401526001600160a01b03808916604085015280881660608501525085608084015284151560a08401528060c0840152600081840152506101208060e0840152615e9181840185615c3e565b83815260606020820152600061636b6060830185615c3e565b90506001600160a01b0383166040830152949350505050565b60006001600160a01b03808b16835289602084015288604084015287606084015260e060808401526163b960e0840188615c3e565b83810360a08501526163cc818789616269565b92505080841660c0840152509998505050505050505050565b808202811582820484141761094a5761094a615ba2565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600082616461577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b85815284602082015260a06040820152600061648560a0830186615c3e565b82810360608401526164978186615c3e565b9150506001600160a01b03831660808301529695505050505050565b6001600160a01b038616815284602082015283604082015260a0606082015260006164e160a0830185615c3e565b8281036080840152610ffb8185615c3e565b600080600080610180858703121561650a57600080fd5b6165148686615eaf565b9350610120850151925061014085015167ffffffffffffffff8082111561653a57600080fd5b818701915087601f83011261654e57600080fd5b8151602061655e61590883615f2f565b82815260069290921b8401810191818101908b84111561657d57600080fd5b948201945b8386101561606e576040868d03121561659b5760008081fd5b6165a361584a565b86516165ae816154b3565b81528684015184820152825260409095019490820190616582565b80516001600160a01b0316825260006101e0602083015160208501526040830151604085015260608301516060850152608083015161663560808601826001600160a01b0381511682526020810151602083015260408101516040830152606081015160608301525050565b5060a083015180516001600160a01b03908116610100878101919091526020830151610120880152604083015161014088015260609092015161016087015260c08501511661018086015260e08401516101a086018390529061669a83870183615c3e565b9250808501519150508482036101c08601526140858282615c3e565b602081526000612b1860208301846165c9565b6060815260006161ba60608301866165c9565b600060208083850312156166ef57600080fd5b825167ffffffffffffffff81111561670657600080fd5b8301601f8101851361671757600080fd5b805161672561590882615f2f565b81815260e0918202830184019184820191908884111561674457600080fd5b938501935b838510156167da5780858a0312156167615760008081fd5b61676961586d565b8551616774816155c4565b815285870151616783816155c4565b8188015260408681015190820152606080870151908201526080808701516167aa816154b3565b9082015260a0868101519082015260c0808701516167c7816154b3565b9082015283529384019391850191616749565b50979650505050505050565b61014081016168478287805115158252602081015115156020830152604081015160408301526060810151606083015260808101516001600160a01b03808216608085015260a083015160a08501528060c08401511660c085015250505050565b8460e0830152836101008301526001600160a01b03831661012083015295945050505050565b60006101406168ce8388805115158252602081015115156020830152604081015160408301526060810151606083015260808101516001600160a01b03808216608085015260a083015160a08501528060c08401511660c085015250505050565b8560e0840152806101008401526168e781840186615c3e565b9150506001600160a01b03831661012083015295945050505050565b60008251616915818460208701615c1a565b9190910192915050565b602081526000612b186020830184615c3e56fea2646970667358221220632f118e9f45e614b342e0ab636b912ea8cf3276042a123beb2616e076b33b0864736f6c63430008110033',
    sourceMap:
      '518:4018:21:-:0;;;5811:10:35;5781:40;;2246:687:21;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2649:6;2664;-1:-1:-1;;;;;2664:15:21;;:17;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;-1:-1:-1;;;;;4069:14:36;;;;;10685:795:35;;;;;4089:20:36;;;;4115;;;;2730:30:33;;;;;4115:20:36;2706:19:21;2733:18;2730:30:33;2781:9:21;2798:10;2816:12;2836:7;2851:6;2865;936:32:101;719:10:128;936:18:101;:32::i;:::-;11231:40:35::2;::::0;;;11277:38:::2;::::0;;;-1:-1:-1;;;;;11321:20:35;;::::2;;::::0;11347:22;;::::2;;::::0;11375:26;;::::2;;::::0;11407:16;;::::2;;::::0;11429:14;::::2;;::::0;11450:25:::2;11468:6:::0;11450:17:::2;:25::i;:::-;10685:795:::0;;;;;;;;;;;;2246:687:21;;;;;;;;;;;518:4018;;2426:187:101;2499:16;2518:6;;-1:-1:-1;;;;;2534:17:101;;;-1:-1:-1;;;;;;2534:17:101;;;;;;2566:40;;2518:6;;;;;;;2566:40;;2499:16;2566:40;2489:124;2426:187;:::o;2074:198::-;1094:13;:11;:13::i;:::-;-1:-1:-1;;;;;2162:22:101;::::1;2154:73;;;::::0;-1:-1:-1;;;2154:73:101;;2341:2:153;2154:73:101::1;::::0;::::1;2323:21:153::0;2380:2;2360:18;;;2353:30;2419:34;2399:18;;;2392:62;-1:-1:-1;;;2470:18:153;;;2463:36;2516:19;;2154:73:101::1;;;;;;;;;2237:28;2256:8:::0;2237:18:::1;:28::i;:::-;2074:198:::0;:::o;1359:130::-;1247:7;1273:6;-1:-1:-1;;;;;1273:6:101;719:10:128;1422:23:101;1414:68;;;;-1:-1:-1;;;1414:68:101;;2748:2:153;1414:68:101;;;2730:21:153;;;2767:18;;;2760:30;2826:34;2806:18;;;2799:62;2878:18;;1414:68:101;2546:356:153;1414:68:101;1359:130::o;14:147:153:-;-1:-1:-1;;;;;105:31:153;;95:42;;85:70;;151:1;148;141:12;166:1690;506:6;514;522;530;538;546;554;562;570;578;586:7;640:3;628:9;619:7;615:23;611:33;608:53;;;657:1;654;647:12;608:53;689:9;683:16;708:47;749:5;708:47;:::i;:::-;774:5;764:15;;;819:2;808:9;804:18;798:25;788:35;;863:2;852:9;848:18;842:25;832:35;;907:2;896:9;892:18;886:25;876:35;;956:3;945:9;941:19;935:26;970:49;1011:7;970:49;:::i;:::-;1090:3;1075:19;;1069:26;1038:7;;-1:-1:-1;1104:49:153;1069:26;1104:49;:::i;:::-;1224:3;1209:19;;1203:26;1172:7;;-1:-1:-1;1238:49:153;1203:26;1238:49;:::i;:::-;1358:3;1343:19;;1337:26;1306:7;;-1:-1:-1;1372:49:153;1337:26;1372:49;:::i;:::-;1492:3;1477:19;;1471:26;1440:7;;-1:-1:-1;1506:49:153;1471:26;1506:49;:::i;:::-;1626:3;1611:19;;1605:26;1574:7;;-1:-1:-1;1640:49:153;1605:26;1640:49;:::i;:::-;1760:3;1745:19;;1739:26;1708:7;;-1:-1:-1;1774:49:153;1739:26;1774:49;:::i;:::-;1843:7;1832:18;;;166:1690;;;;;;;;;;;;;;:::o;1861:273::-;1929:6;1982:2;1970:9;1961:7;1957:23;1953:32;1950:52;;;1998:1;1995;1988:12;1950:52;2030:9;2024:16;2080:4;2073:5;2069:16;2062:5;2059:27;2049:55;;2100:1;2097;2090:12;2049:55;2123:5;1861:273;-1:-1:-1;;;1861:273:153:o;2546:356::-;518:4018:21;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',
    linkReferences: {},
  },
  deployedBytecode: {
    object:
      '0x6080604052600436106102195760003560e01c80638da5cb5b1161011d578063c715967a116100b0578063df21a7dd1161007f578063f2fde38b11610064578063f2fde38b14610750578063fc0c546a14610770578063fe663f0f146107a457600080fd5b8063df21a7dd146106ce578063e5a6b10f1461071c57600080fd5b8063c715967a14610651578063d3419bf314610664578063d6dacc5314610698578063ddca3f43146106b857600080fd5b8063ad007d63116100ec578063ad007d6314610579578063b631b500146105ad578063b7bad1b1146105dd578063c41c2f241461061d57600080fd5b80638da5cb5b146104e7578063975057e714610505578063a02f801c14610539578063a32e1e961461055957600080fd5b80634a4305c0116101b0578063715018a61161017f57806389701db51161016457806389701db5146104665780638af56094146104865780638b79543c146104b357600080fd5b8063715018a6146104315780637258002c1461044657600080fd5b80634a4305c01461039d578063637913ac146103bd57806366248b86146103dd57806369fe0e2d1461041157600080fd5b80632bdfe004116101ec5780632bdfe004146102c95780632d1a590314610315578063313ce56714610349578063405b84fa1461037d57600080fd5b806301ffc9a71461021e5780630cf8e858146102535780631982d679146102685780631ebc263f146102b6575b600080fd5b34801561022a57600080fd5b5061023e610239366004615471565b6107c4565b60405190151581526020015b60405180910390f35b610266610261366004615511565b610950565b005b34801561027457600080fd5b506102a86102833660046155a7565b507f000000000000000000000000000000000000000000000000000000000000000090565b60405190815260200161024a565b6102a86102c43660046155d2565b610a4b565b3480156102d557600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161024a565b34801561032157600080fd5b506102a87f000000000000000000000000000000000000000000000000000000000000000081565b34801561035557600080fd5b506102a87f000000000000000000000000000000000000000000000000000000000000000081565b34801561038957600080fd5b506102a861039836600461569a565b610c68565b3480156103a957600080fd5b506102a86103b83660046156ca565b610feb565b3480156103c957600080fd5b506102666103d83660046155a7565b611007565b3480156103e957600080fd5b506102a87f000000000000000000000000000000000000000000000000000000000000000081565b34801561041d57600080fd5b5061026661042c366004615734565b61107b565b34801561043d57600080fd5b50610266611101565b34801561045257600080fd5b5061026661046136600461574d565b611115565b34801561047257600080fd5b50610266610481366004615734565b61119d565b34801561049257600080fd5b506104a66104a1366004615734565b611452565b60405161024a919061577b565b3480156104bf57600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b3480156104f357600080fd5b506000546001600160a01b03166102fd565b34801561051157600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b34801561054557600080fd5b506102a861055436600461593f565b611504565b34801561056557600080fd5b506102a8610574366004615734565b6115d8565b34801561058557600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b3480156105b957600080fd5b5061023e6105c83660046155a7565b60046020526000908152604090205460ff1681565b3480156105e957600080fd5b506102a86105f83660046155a7565b507f000000000000000000000000000000000000000000000000000000000000000090565b34801561062957600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b61026661065f3660046159f8565b61183f565b34801561067057600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b3480156106a457600080fd5b506003546102fd906001600160a01b031681565b3480156106c457600080fd5b506102a860025481565b3480156106da57600080fd5b5061023e6106e9366004615aa0565b507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0390811691161490565b34801561072857600080fd5b506102a87f000000000000000000000000000000000000000000000000000000000000000081565b34801561075c57600080fd5b5061026661076b3660046155a7565b611a40565b34801561077c57600080fd5b506102fd7f000000000000000000000000000000000000000000000000000000000000000081565b3480156107b057600080fd5b506102a86107bf366004615acc565b611aef565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fedb527eb00000000000000000000000000000000000000000000000000000000148061085757507fffffffff0000000000000000000000000000000000000000000000000000000082167f4a4305c000000000000000000000000000000000000000000000000000000000145b806108a357507fffffffff0000000000000000000000000000000000000000000000000000000082167fa02f801c00000000000000000000000000000000000000000000000000000000145b806108ef57507fffffffff0000000000000000000000000000000000000000000000000000000082167ffe663f0f00000000000000000000000000000000000000000000000000000000145b8061093b57507fffffffff0000000000000000000000000000000000000000000000000000000082167fad007d6300000000000000000000000000000000000000000000000000000000145b8061094a575061094a82611b0f565b92915050565b6040517f6e49181f0000000000000000000000000000000000000000000000000000000081526004810188905230602482015287907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636e49181f90604401602060405180830381865afa1580156109d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109fa9190615b85565b610a30576040517fd8ead2c800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610a4188888860008989898961183f565b5050505050505050565b6040517f6e49181f000000000000000000000000000000000000000000000000000000008152600481018b90523060248201526000908b906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690636e49181f90604401602060405180830381865afa158015610ad4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610af89190615b85565b610b2e576040517fd8ead2c800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661eeee14610bca573415610b98576040517fbcfd35be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000610ba2611bf2565b9050610baf33308e611c9b565b80610bb8611bf2565b610bc29190615bd1565b9b5050610bce565b349a505b610c588b338e8c8c8c8c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050508b8b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611d1992505050565b9c9b505050505050505050505050565b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018390526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa158015610ce9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d0d9190615be4565b836004610d1b83838361237a565b6040517fdf21a7dd0000000000000000000000000000000000000000000000000000000081526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301526024820188905286169063df21a7dd90604401602060405180830381865afa158015610da1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc59190615b85565b610dfb576040517f581010ed00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f6bb6a5ad000000000000000000000000000000000000000000000000000000008152600481018790527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636bb6a5ad906024016020604051808303816000875af1158015610e7b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e9f9190615c01565b93508315610f9d57610eb1858561253e565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661eeee14610eec576000610eee565b845b604080516020810182526000815290517f0cf8e8580000000000000000000000000000000000000000000000000000000081529192506001600160a01b03881691630cf8e858918491610f69918c918b917f000000000000000000000000000000000000000000000000000000000000000091600401615c6a565b6000604051808303818588803b158015610f8257600080fd5b505af1158015610f96573d6000803e3d6000fd5b5050505050505b604080518581523360208201526001600160a01b0387169188917fa7519e5f94697b7f53e97c5eb46a0c730a296ab686ab8fd333835c5f735784eb910160405180910390a350505092915050565b6000610ffb888888878787612576565b98975050505050505050565b61100f612829565b600380547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0383169081179091556040513381527f0a9a80fe9716605b3e52abb3d792d6a4e7816d6afc02a5a4ef023081feaf9f609060200160405180910390a250565b611083612829565b6302faf0808111156110c1576040517f45fbd9c100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002819055604080518281523360208201527fd7414e590e1cb532989ab2a34c8f4c2c17f7ab6f006efeeaef2e87cd5008c202910160405180910390a150565b611109612829565b611113600061289d565b565b61111d612829565b6001600160a01b03821660008181526004602090815260409182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001685151590811790915591513381529192917fa2653e25a502c023a5830d0de847ef6f458387865b1f4f575d7594f9f2c0d71e910160405180910390a35050565b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa15801561121b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061123f9190615be4565b8160056112546000546001600160a01b031690565b6001600160a01b0316336001600160a01b03161461127484848484612905565b600085815260016020908152604080832080548251818502810185019093528083529192909190849084015b8282101561131257600084815260209081902060408051608081018252600286029092018054835260019081015463ffffffff8082168587015264010000000082041692840192909252680100000000000000009091046001600160a01b0316606083015290835290920191016112a0565b5050506000888152600160205260408120929350611331929150615412565b805160005b81811015610a415760006113ae84838151811061135557611355615cb0565b60200260200101516000015185848151811061137357611373615cb0565b60200260200101516020015163ffffffff1686858151811061139757611397615cb0565b60200260200101516040015163ffffffff16612ad9565b90506113d8818584815181106113c6576113c6615cb0565b6020026020010151606001518b612b1f565b60011515818a7fcf0c92a2c6d7c42f488326b0cb900104b99984b6b218db81cd29371364a3525187868151811061141157611411615cb0565b602002602001015160600151336040516114419291906001600160a01b0392831681529116602082015260400190565b60405180910390a450600101611336565b606060016000838152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156114f957600084815260209081902060408051608081018252600286029092018054835260019081015463ffffffff8082168587015264010000000082041692840192909252680100000000000000009091046001600160a01b031660608301529083529092019101611487565b505050509050919050565b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018a90526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa158015611585573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115a99190615be4565b8a60116115b783838361237a565b6115c78d8d8d8c8c8c8c8c612e77565b9d9c50505050505050505050505050565b6040517fd49031c00000000000000000000000000000000000000000000000000000000081523060048201526024810182905260009081906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063d49031c090604401602060405180830381865afa158015611661573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116859190615c01565b905060007f00000000000000000000000000000000000000000000000000000000000000006012146116e2576116dd827f000000000000000000000000000000000000000000000000000000000000000060126130ee565b6116e4565b815b905060017f000000000000000000000000000000000000000000000000000000000000000014611835576118308161173d7f0000000000000000000000000000000000000000000000000000000000000000600a615dff565b6040517fa4d0caf20000000000000000000000000000000000000000000000000000000081527f00000000000000000000000000000000000000000000000000000000000000006004820152600160248201527f000000000000000000000000000000000000000000000000000000000000000060448201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063a4d0caf290606401602060405180830381865afa158015611807573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061182b9190615c01565b61314b565b611837565b805b949350505050565b6040517f6e49181f0000000000000000000000000000000000000000000000000000000081526004810189905230602482015288907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636e49181f90604401602060405180830381865afa1580156118c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118e99190615b85565b61191f576040517fd8ead2c800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661eeee146119bb573415611989576040517fbcfd35be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000611993611bf2565b90506119a033308b611c9b565b806119a9611bf2565b6119b39190615bd1565b9850506119bf565b3497505b611a3589898888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8c018190048102820181019092528a815292508a915089908190840183828082843760009201919091525061324f92505050565b505050505050505050565b611a48612829565b6001600160a01b038116611ae3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b611aec8161289d565b50565b600088886002611b0083838361237a565b610c588c8c8c8b8b8b8b613359565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fc07370e4000000000000000000000000000000000000000000000000000000001480611ba257507fffffffff0000000000000000000000000000000000000000000000000000000082167f2896000200000000000000000000000000000000000000000000000000000000145b8061094a57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff0000000000000000000000000000000000000000000000000000000083161461094a565b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015611c72573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c969190615c01565b905090565b6001600160a01b0383163014611ce557611ce06001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016848484613996565b505050565b611ce06001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168383613a47565b60006001600160a01b038616611d5b576040517fa762251300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b611db36040518061012001604052806000815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b03168152602001600081525090565b606060008060405180608001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031681526020018e81526020017f000000000000000000000000000000000000000000000000000000000000000081526020017f000000000000000000000000000000000000000000000000000000000000000081525090507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632fa1b3918d838e7f00000000000000000000000000000000000000000000000000000000000000008f8d8d6040518863ffffffff1660e01b8152600401611ebc9796959493929190615e0b565b6000604051808303816000875af1158015611edb573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611f039190810190615f98565b99509195509093509150811561206a576040517f5dd8f6aa000000000000000000000000000000000000000000000000000000008152600481018c90527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690635dd8f6aa90602401602060405180830381865afa158015611f91573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611fb59190615be4565b6040517f8ae9c07b000000000000000000000000000000000000000000000000000000008152600481018d9052602481018490526001600160a01b038c8116604483015260c06064830152600060c48301528a15156084830152600160a48301529190911690638ae9c07b9060e4016020604051808303816000875af1158015612043573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120679190615c01565b94505b888510156120a4576040517f7b94612600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b82511561231c57600060405180608001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031681526020018f81526020017f000000000000000000000000000000000000000000000000000000000000000081526020017f0000000000000000000000000000000000000000000000000000000000000000815250905060006040518061014001604052808f6001600160a01b031681526020018e8152602001876020015181526020018481526020018381526020018881526020018d6001600160a01b031681526020018b151581526020018a815260200189815250905060008551905060005b818110156123175760008782815181106121c0576121c0615cb0565b602002602001015190506121dc8160000151826020015161253e565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff11127f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031601612235575060208101515b60208083015160808701519091015281516040517fda9ee8b70000000000000000000000000000000000000000000000000000000081526001600160a01b039091169063da9ee8b790839061228e908990600401616194565b6000604051808303818588803b1580156122a757600080fd5b505af11580156122bb573d6000803e3d6000fd5b505050505081600001516001600160a01b03167f16112c26e14efc4be6c690149aa5a1ba75160de245f60d2273e28adb277b9e1286846020015133604051612305939291906161a7565b60405180910390a250506001016121a4565b505050505b50505087816000015182602001517f133161f1c9161488f777ab9a26aae91d47c0d9a3fafb398960f138db02c737978c8b8f888b8b3360405161236597969594939291906161d9565b60405180910390a45098975050505050505050565b336001600160a01b0384161480159061244757506040517fc161c93f0000000000000000000000000000000000000000000000000000000081523360048201526001600160a01b03848116602483015260448201849052606482018390527f0000000000000000000000000000000000000000000000000000000000000000169063c161c93f90608401602060405180830381865afa158015612421573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124459190615b85565b155b801561250757506040517fc161c93f0000000000000000000000000000000000000000000000000000000081523360048201526001600160a01b03848116602483015260006044830152606482018390527f0000000000000000000000000000000000000000000000000000000000000000169063c161c93f90608401602060405180830381865afa1580156124e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125059190615b85565b155b15611ce0576040517f075fd2b100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6125726001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168383613a90565b5050565b6040517fc6644597000000000000000000000000000000000000000000000000000000008152600481018790526024810186905260448101859052600090819081906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063c664459790606401610140604051808303816000875af115801561260c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612630919061623a565b915091508581101561266e576040517fb01493c100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018a90526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa1580156126ef573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127139190615be4565b90506000806002546000146127305761272b8c613b6f565b612736565b633b9aca005b905060008061276c8e88602001517f00000000000000000000000000000000000000000000000000000000000000008987613d0d565b92509050633b9aca00831461278057908101905b8160000361278f57600061279c565b61279c8e88848887613ece565b935080156127c8576127b18160025485612ad9565b6127bb9082615bd1565b97506127c830868a611c9b565b5050508a846000015185602001517fc41a8d26c70cfcf1b9ea10f82482ac947b8be5bea2750bc729af844bbfde1e28858e88878c8f8f33604051612813989796959493929190616294565b60405180910390a4505050509695505050505050565b6000546001600160a01b03163314611113576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401611ada565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b8015801561291c5750336001600160a01b03851614155b80156129dc57506040517fc161c93f0000000000000000000000000000000000000000000000000000000081523360048201526001600160a01b03858116602483015260448201859052606482018490527f0000000000000000000000000000000000000000000000000000000000000000169063c161c93f90608401602060405180830381865afa1580156129b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129da9190615b85565b155b8015612a9c57506040517fc161c93f0000000000000000000000000000000000000000000000000000000081523360048201526001600160a01b03858116602483015260006044830152606482018490527f0000000000000000000000000000000000000000000000000000000000000000169063c161c93f90608401602060405180830381865afa158015612a76573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a9a9190615b85565b155b15612ad3576040517f075fd2b100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505050565b600080612aeb8484633b9aca0061314b565b612af59085615bd1565b9050612b0a85633b9aca0061182b81856162e8565b612b149086615bd1565b9150505b9392505050565b6040517f86202650000000000000000000000000000000000000000000000000000000008152600160048201526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660248301526000917f000000000000000000000000000000000000000000000000000000000000000090911690638620265090604401602060405180830381865afa158015612bca573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612bee9190615be4565b905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661eeee14612c2b576000612c2d565b845b6040805160208082528183019092529192506000919060208201818036833701905050905083604051602001612c6591815260200190565b60408051601f1981840301815291905290506001600160a01b0383163014612c9157612c91838761253e565b6040517f1ebc263f0000000000000000000000000000000000000000000000000000000081526001600160a01b03841690631ebc263f908490612d06906001908b907f0000000000000000000000000000000000000000000000000000000000000000908c9060009081908b906004016162fb565b60206040518083038185885af193505050508015612d41575060408051601f3d908101601f19168201909252612d3e91810190615c01565b60015b612e6d573d808015612d6f576040519150601f19603f3d011682016040523d82523d6000602084013e612d74565b606091505b506001600160a01b0384163014612d8f57612d8f848861408e565b6040517fe7c8e3e300000000000000000000000000000000000000000000000000000000815260048101869052602481018890527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063e7c8e3e390604401600060405180830381600087803b158015612e1157600080fd5b505af1158015612e25573d6000803e3d6000fd5b505050506001857f80a889d08f0d59eb962335b57fb1d5b29e86e3d23f15087b5541fddf15422bbe898433604051612e5f93929190616352565b60405180910390a350612e6f565b505b505050505050565b6040517f25386715000000000000000000000000000000000000000000000000000000008152600481018990526024810188905260448101879052600090819081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690632538671590606401610140604051808303816000875af1158015612f0d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f31919061623a565b9150915087811015612f6f576040517fb01493c100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f6352211e000000000000000000000000000000000000000000000000000000008152600481018c905260009081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690636352211e90602401602060405180830381865afa158015612ff2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906130169190615be4565b905060006002546000148061303a57503360009081526004602052604090205460ff165b61304c576130478e613b6f565b613052565b633b9aca005b9050633b9aca0081146130715761306c8e86868585613ece565b613074565b60005b8085039650925083831461308d5761308d308b88611c9b565b5050508a826000015183602001517f2eeee47c6d8d31c3523c3aa07b4c3e3795db36be4c04546ef3e30a5102f568e18a8e86898d8d8d336040516130d8989796959493929190616384565b60405180910390a4505098975050505050505050565b60008282036130fe575082612b18565b8282111561312c576131108383615bd1565b61311b90600a615dff565b61312590856163e5565b9050612b18565b6131368284615bd1565b61314190600a615dff565b613125908561642b565b600080807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff858709858702925082811083820303915050806000036131a357838281613199576131996163fc565b0492505050612b18565b8381106131e6576040517f773cc18c0000000000000000000000000000000000000000000000000000000081526004810182905260248101859052604401611ada565b60008486880960026001871981018816978890046003810283188082028403028082028403028082028403028082028403028082028403029081029092039091026000889003889004909101858311909403939093029303949094049190911702949350505050565b60008361325d576000613267565b61326786866140c2565b90506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001663e7c8e3e3876132a384896162e8565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815260048101929092526024820152604401600060405180830381600087803b1580156132f957600080fd5b505af115801561330d573d6000803e3d6000fd5b50505050857f9ecaf7fc3dfffd6867c175d6e684b1f1e3aef019398ba8db2c1ffab4a09db2538683868633604051613349959493929190616466565b60405180910390a2505050505050565b60006001600160a01b03841661339b576040517ff74a1b6600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6133f36040518061012001604052806000815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b03168152602001600081525090565b6040517fa2df1f950000000000000000000000000000000000000000000000000000000081526060906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063a2df1f9590613463908d908d908d908b908b906004016164b3565b6000604051808303816000875af1158015613482573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526134aa91908101906164f3565b97509094509092509050868310156134ee576040517ff896960b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8715613630576040517f5dd8f6aa000000000000000000000000000000000000000000000000000000008152600481018a90527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690635dd8f6aa90602401602060405180830381865afa158015613572573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906135969190615be4565b6040517f1665bc0f0000000000000000000000000000000000000000000000000000000081526001600160a01b038c81166004830152602482018c9052604482018b905260a06064830152600060a4830181905260848301529190911690631665bc0f9060c401600060405180830381600087803b15801561361757600080fd5b505af115801561362b573d6000803e3d6000fd5b505050505b80511561392a57600060405180608001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602001600081526020017f000000000000000000000000000000000000000000000000000000000000000081526020017f0000000000000000000000000000000000000000000000000000000000000000815250905060006040518061012001604052808d6001600160a01b031681526020018c8152602001856020015181526020018b815260200160405180608001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031681526020018881526020017f000000000000000000000000000000000000000000000000000000000000000081526020017f00000000000000000000000000000000000000000000000000000000000000008152508152602001838152602001896001600160a01b0316815260200188815260200187815250905060008351905060005b818110156139255760008582815181106137ce576137ce615cb0565b602002602001015190506137ea8160000151826020015161253e565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff11127f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031601613843575060208101515b60208083015160a08701519091015281516040517f2b13c58f0000000000000000000000000000000000000000000000000000000081526001600160a01b0390911690632b13c58f90839061389c9089906004016166b6565b6000604051808303818588803b1580156138b557600080fd5b505af11580156138c9573d6000803e3d6000fd5b505050505081600001516001600160a01b03167f54b3744c489f40987dd2726ca12131243334e8292f567389f761c5a432d813e486846020015133604051613913939291906166c9565b60405180910390a250506001016137b2565b505050505b50811561393c5761393c308684611c9b565b87816000015182602001517f2be10f2a0203c77d0fcaa9fd6484a8a1d6904de31cd820587f60c1c8c338c8148c898c888b8b3360405161398297969594939291906161d9565b60405180910390a450979650505050505050565b6040516001600160a01b0380851660248301528316604482015260648101829052612ad39085907f23b872dd00000000000000000000000000000000000000000000000000000000906084015b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909316929092179091526144f9565b6040516001600160a01b038316602482015260448101829052611ce09084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064016139e3565b6040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b0383811660248301526000919085169063dd62ed3e90604401602060405180830381865afa158015613af9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613b1d9190615c01565b9050612ad3847f095ea7b30000000000000000000000000000000000000000000000000000000085613b4f86866162e8565b6040516001600160a01b03909216602483015260448201526064016139e3565b6040517f86202650000000000000000000000000000000000000000000000000000000008152600160048201526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116602483015260009182917f00000000000000000000000000000000000000000000000000000000000000001690638620265090604401602060405180830381865afa158015613c1a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613c3e9190615be4565b6001600160a01b031603613c575750633b9aca00919050565b6003546001600160a01b031615613d05576003546040517f77695896000000000000000000000000000000000000000000000000000000008152600481018490526001600160a01b0390911690637769589690602401602060405180830381865afa925050508015613ce6575060408051601f3d908101601f19168201909252613ce391810190615c01565b60015b613cf257506000919050565b633b9aca008111613d035792915050565b505b506000919050565b6040517f69e11cc50000000000000000000000000000000000000000000000000000000081526004810186905260248101859052604481018490528290600090633b9aca009082907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906369e11cc590606401600060405180830381865afa158015613da6573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052613dce91908101906166dc565b905060005b8151811015613ec1576000828281518110613df057613df0615cb0565b60200260200101519050600084826040015114613e1f57613e1a898360400151633b9aca0061314b565b613e21565b865b9050816040015185613e339190615bd1565b94506000613e44838e8d858d6145fb565b90508015801590613e555750818114155b15613e6757613e6482886162e8565b96505b8115613e735781880397505b8a8c8e7f0d31ab573f6daa4b1edba8d31973b4ba9f98fbfecc47010c1533eeefd2a1225a86868633604051613eab94939291906167e6565b60405180910390a4836001019350505050613dd3565b5050509550959350505050565b6000613edd8460025484612ad9565b610100860151909150604f1c60019081160361403157600086815260016020818152604080842081516080810183528981526002805463ffffffff9081168387019081528a82168487019081526001600160a01b03808e16606087019081528754808c018955978c5298909a209451958402909401948555519390960180549251955190971668010000000000000000027fffffffff0000000000000000000000000000000000000000ffffffffffffffff958716640100000000027fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000909316939096169290921717929092169290921790925590549051859088907f77813be0661650ddc1a5193ff2837df4162b251cb432651e2c060c3fc39756be90614024908790899033909283526001600160a01b03918216602084015216604082015260600190565b60405180910390a4614085565b61403c818488612b1f565b604080516001600160a01b0385168152336020820152600091839189917fcf0c92a2c6d7c42f488326b0cb900104b99984b6b218db81cd29371364a35251910160405180910390a45b95945050505050565b6125726001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168383614f71565b600082815260016020908152604080832080548251818502810185019093528083528493849084015b8282101561415d57600084815260209081902060408051608081018252600286029092018054835260019081015463ffffffff8082168587015264010000000082041692840192909252680100000000000000009091046001600160a01b0316606083015290835290920191016140eb565b505050600086815260016020526040812092935061417c929150615412565b8051839060005b818110156144b1578260000361427357600087815260016020526040902084518590839081106141b5576141b5615cb0565b60209081029190910181015182546001818101855560009485529383902082516002909202019081559181015191909201805460408401516060909401516001600160a01b031668010000000000000000027fffffffff0000000000000000000000000000000000000000ffffffffffffffff63ffffffff958616640100000000027fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000909316959094169490941717919091169190911790556144a9565b83818151811061428557614285615cb0565b6020026020010151600001518310614319578381815181106142a9576142a9615cb0565b602002602001015160000151830392506143108482815181106142ce576142ce615cb0565b6020026020010151600001518583815181106142ec576142ec615cb0565b60200260200101516020015163ffffffff1686848151811061139757611397615cb0565b850194506144a9565b6001600088815260200190815260200160002060405180608001604052808587858151811061434a5761434a615cb0565b60200260200101516000015103815260200186848151811061436e5761436e615cb0565b60200260200101516020015163ffffffff16815260200186848151811061439757614397615cb0565b60200260200101516040015163ffffffff1681526020018684815181106143c0576143c0615cb0565b6020908102919091018101516060908101516001600160a01b039081169093528454600181810187556000968752958390208551600290920201908155918401519190940180546040850151949095015190921668010000000000000000027fffffffff0000000000000000000000000000000000000000ffffffffffffffff63ffffffff948516640100000000027fffffffffffffffffffffffffffffffffffffffffffffffff00000000000000009096169490921693909317939093179290921617905583516144a09084908690849081106142ec576142ec615cb0565b85019450600092505b600101614183565b50604080518381523360208201528591879189917f59860d79d97c1fce2be7f987915c631471f4b08f671200463cc40a3380194ffb910160405180910390a450505092915050565b600061454e826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166150da9092919063ffffffff16565b905080516000148061456f57508080602001905181019061456f9190615b85565b611ce0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401611ada565b60c08501516000906001600160a01b0316156149fc57633b9aca0082148061463f575060c08601516001600160a01b031660009081526004602052604090205460ff165b1561464b57508161465d565b6146588360025484612ad9565b830390505b61466b8660c001518261253e565b60006040518060c001604052807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031681526020018381526020017f00000000000000000000000000000000000000000000000000000000000000008152602001878152602001868152602001888152509050600060606147178960c001517f9d740bfa000000000000000000000000000000000000000000000000000000006150e9565b156148a0578860c001516001600160a01b0316639d740bfa61eeee6001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614614771576000614773565b855b604080517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815287516001600160a01b0390811660048301526020808a01516024840152838a015160448401526060808b015160648501526080808c0151608486015260a0808d01518051151560a488015293840151151560c48701529583015160e48601529082015161010485015281015182166101248401529283015161014483015260c090920151909116610164820152610184016000604051808303818588803b15801561484a57600080fd5b505af19350505050801561485c575060015b61489b573d80801561488a576040519150601f19603f3d011682016040523d82523d6000602084013e61488f565b606091505b506001925090506148a5565b6148a5565b600291505b81156149f4576148b98960c001518561408e565b6040517fe7c8e3e30000000000000000000000000000000000000000000000000000000081526004810189905260248101879052600094507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063e7c8e3e390604401600060405180830381600087803b15801561493f57600080fd5b505af1158015614953573d6000803e3d6000fd5b50505050877f290b5df59e172593762964e4f8ed2b4a9192d3197bfd2be4bae123908f8007968a88856001146149d8576040516020016149c4906020808252600c908201527f49455243313635206661696c0000000000000000000000000000000000000000604082015260600190565b6040516020818303038152906040526149da565b845b336040516149eb949392919061686d565b60405180910390a25b505050614085565b606086015115614f145760608601516040517f862026500000000000000000000000000000000000000000000000000000000081526000916001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001691638620265091614aa5917f0000000000000000000000000000000000000000000000000000000000000000906004019182526001600160a01b0316602082015260400190565b602060405180830381865afa158015614ac2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614ae69190615be4565b90506001600160a01b038116614b28576040517f6921234300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600160a01b038116301480614b425750633b9aca0083145b80614b6557506001600160a01b03811660009081526004602052604090205460ff165b15614b7257839150614b84565b614b7f8460025485612ad9565b840391505b614b8e818361253e565b60408051602080825281830190925260009160208201818036833701905050905086604051602001614bc291815260200190565b6040516020818303038152906040529050876020015115614dc757816001600160a01b0316630cf8e85861eeee6001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614614c2e576000614c30565b845b8a60600151867f0000000000000000000000000000000000000000000000000000000000000000866040518663ffffffff1660e01b8152600401614c779493929190615c6a565b6000604051808303818588803b158015614c9057600080fd5b505af193505050508015614ca2575060015b614dc2573d808015614cd0576040519150601f19603f3d011682016040523d82523d6000602084013e614cd5565b606091505b50614ce0838561408e565b6040517fe7c8e3e30000000000000000000000000000000000000000000000000000000081526004810189905260248101879052600094507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063e7c8e3e390604401600060405180830381600087803b158015614d6657600080fd5b505af1158015614d7a573d6000803e3d6000fd5b50505050877f290b5df59e172593762964e4f8ed2b4a9192d3197bfd2be4bae123908f8007968a888433604051614db4949392919061686d565b60405180910390a250614f0d565b614f0d565b816001600160a01b0316631ebc263f61eeee6001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614614e18576000614e1a565b845b60608b015160808c015187907f0000000000000000000000000000000000000000000000000000000000000000906001600160a01b0316614e5b5733614e61565b8d608001515b8e516040517fffffffff0000000000000000000000000000000000000000000000000000000060e089901b168152614ea495949392916000918b906004016162fb565b60206040518083038185885af193505050508015614edf575060408051601f3d908101601f19168201909252614edc91810190615c01565b60015b6149f4573d808015614cd0576040519150601f19603f3d011682016040523d82523d6000602084013e614cd5565b5050614085565b60808601516000906001600160a01b0316614f2f5733614f35565b86608001515b9050633b9aca008303614f4a57839150614f5c565b614f578460025485612ad9565b840391505b614f67308284611c9b565b5095945050505050565b6040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b0383811660248301526000919085169063dd62ed3e90604401602060405180830381865afa158015614fda573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614ffe9190615c01565b905081811015615090576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f5361666545524332303a2064656372656173656420616c6c6f77616e6365206260448201527f656c6f77207a65726f00000000000000000000000000000000000000000000006064820152608401611ada565b6040516001600160a01b03841660248201528282036044820152612ad39085907f095ea7b300000000000000000000000000000000000000000000000000000000906064016139e3565b60606118378484600085615105565b60006150f483615211565b8015612b185750612b188383615275565b606082471015615197576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401611ada565b600080866001600160a01b031685876040516151b39190616903565b60006040518083038185875af1925050503d80600081146151f0576040519150601f19603f3d011682016040523d82523d6000602084013e6151f5565b606091505b509150915061520687838387615340565b979650505050505050565b600061523d827f01ffc9a700000000000000000000000000000000000000000000000000000000615275565b801561094a575061526e827fffffffff00000000000000000000000000000000000000000000000000000000615275565b1592915050565b604080517fffffffff000000000000000000000000000000000000000000000000000000008316602480830191909152825180830390910181526044909101909152602080820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f01ffc9a700000000000000000000000000000000000000000000000000000000178152825160009392849283928392918391908a617530fa92503d9150600051905082801561532d575060208210155b8015615206575015159695505050505050565b606083156153c95782516000036153c2576001600160a01b0385163b6153c2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401611ada565b5081611837565b61183783838151156153de5781518083602001fd5b806040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ada919061691f565b5080546000825560020290600052602060002090810190611aec91905b8082111561546d57600081556001810180547fffffffff0000000000000000000000000000000000000000000000000000000016905560020161542f565b5090565b60006020828403121561548357600080fd5b81357fffffffff0000000000000000000000000000000000000000000000000000000081168114612b1857600080fd5b6001600160a01b0381168114611aec57600080fd5b60008083601f8401126154da57600080fd5b50813567ffffffffffffffff8111156154f257600080fd5b60208301915083602082850101111561550a57600080fd5b9250929050565b600080600080600080600060a0888a03121561552c57600080fd5b87359650602088013595506040880135615545816154b3565b9450606088013567ffffffffffffffff8082111561556257600080fd5b61556e8b838c016154c8565b909650945060808a013591508082111561558757600080fd5b506155948a828b016154c8565b989b979a50959850939692959293505050565b6000602082840312156155b957600080fd5b8135612b18816154b3565b8015158114611aec57600080fd5b6000806000806000806000806000806101008b8d0312156155f257600080fd5b8a35995060208b0135985060408b013561560b816154b3565b975060608b013561561b816154b3565b965060808b0135955060a08b0135615632816155c4565b945060c08b013567ffffffffffffffff8082111561564f57600080fd5b61565b8e838f016154c8565b909650945060e08d013591508082111561567457600080fd5b506156818d828e016154c8565b915080935050809150509295989b9194979a5092959850565b600080604083850312156156ad57600080fd5b8235915060208301356156bf816154b3565b809150509250929050565b600080600080600080600060c0888a0312156156e557600080fd5b8735965060208801359550604088013594506060880135615705816154b3565b93506080880135925060a088013567ffffffffffffffff81111561572857600080fd5b6155948a828b016154c8565b60006020828403121561574657600080fd5b5035919050565b6000806040838503121561576057600080fd5b823561576b816154b3565b915060208301356156bf816155c4565b602080825282518282018190526000919060409081850190868401855b828110156157e4578151805185528681015163ffffffff908116888701528682015116868601526060908101516001600160a01b03169085015260809093019290850190600101615798565b5091979650505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051610120810167ffffffffffffffff81118282101715615844576158446157f1565b60405290565b6040805190810167ffffffffffffffff81118282101715615844576158446157f1565b60405160e0810167ffffffffffffffff81118282101715615844576158446157f1565b604051601f8201601f1916810167ffffffffffffffff811182821017156158b9576158b96157f1565b604052919050565b600067ffffffffffffffff8211156158db576158db6157f1565b50601f01601f191660200190565b600082601f8301126158fa57600080fd5b813561590d615908826158c1565b615890565b81815284602083860101111561592257600080fd5b816020850160208301376000918101602001919091529392505050565b60008060008060008060008060006101008a8c03121561595e57600080fd5b8935985060208a0135975060408a0135965060608a013561597e816154b3565b955060808a0135945060a08a0135615995816154b3565b935060c08a013567ffffffffffffffff808211156159b257600080fd5b6159be8d838e016158e9565b945060e08c01359150808211156159d457600080fd5b506159e18c828d016154c8565b915080935050809150509295985092959850929598565b60008060008060008060008060c0898b031215615a1457600080fd5b88359750602089013596506040890135615a2d816154b3565b95506060890135615a3d816155c4565b9450608089013567ffffffffffffffff80821115615a5a57600080fd5b615a668c838d016154c8565b909650945060a08b0135915080821115615a7f57600080fd5b50615a8c8b828c016154c8565b999c989b5096995094979396929594505050565b60008060408385031215615ab357600080fd5b8235615abe816154b3565b946020939093013593505050565b600080600080600080600080610100898b031215615ae957600080fd5b8835615af4816154b3565b975060208901359650604089013595506060890135615b12816154b3565b94506080890135935060a0890135615b29816154b3565b925060c089013567ffffffffffffffff80821115615b4657600080fd5b615b528c838d016158e9565b935060e08b0135915080821115615b6857600080fd5b50615b758b828c016158e9565b9150509295985092959890939650565b600060208284031215615b9757600080fd5b8151612b18816155c4565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8181038181111561094a5761094a615ba2565b600060208284031215615bf657600080fd5b8151612b18816154b3565b600060208284031215615c1357600080fd5b5051919050565b60005b83811015615c35578181015183820152602001615c1d565b50506000910152565b60008151808452615c56816020860160208601615c1a565b601f01601f19169290920160200192915050565b8481528360208201526001600160a01b038316604082015260a06060820152600060a082015260c060808201526000615ca660c0830184615c3e565b9695505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600181815b80851115615d3857817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115615d1e57615d1e615ba2565b80851615615d2b57918102915b93841c9390800290615ce4565b509250929050565b600082615d4f5750600161094a565b81615d5c5750600061094a565b8160018114615d725760028114615d7c57615d98565b600191505061094a565b60ff841115615d8d57615d8d615ba2565b50506001821b61094a565b5060208310610133831016604e8410600b8410161715615dbb575081810a61094a565b615dc58383615cdf565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115615df757615df7615ba2565b029392505050565b6000612b188383615d40565b60006101406001600160a01b03808b168452615e54602085018b6001600160a01b0381511682526020810151602083015260408101516040830152606081015160608301525050565b8860a08501528760c085015280871660e08501525080610100840152615e7c81840186615c3e565b9050828103610120840152615e918185615c3e565b9a9950505050505050505050565b8051615eaa816154b3565b919050565b60006101208284031215615ec257600080fd5b615eca615820565b9050815181526020820151602082015260408201516040820152606082015160608201526080820151608082015260a082015160a082015260c082015160c0820152615f1860e08301615e9f565b60e082015261010080830151818301525092915050565b600067ffffffffffffffff821115615f4957615f496157f1565b5060051b60200190565b600082601f830112615f6457600080fd5b8151615f72615908826158c1565b818152846020838601011115615f8757600080fd5b611837826020830160208701615c1a565b6000806000806101808587031215615faf57600080fd5b615fb98686615eaf565b9350610120850151925061014085015167ffffffffffffffff80821115615fdf57600080fd5b818701915087601f830112615ff357600080fd5b8151602061600361590883615f2f565b82815260069290921b8401810191818101908b84111561602257600080fd5b948201945b8386101561606e576040868d0312156160405760008081fd5b61604861584a565b8651616053816154b3565b81528684015184820152825260409095019490820190616027565b6101608b015190975094505050508082111561608957600080fd5b5061609687828801615f53565b91505092959194509250565b80516001600160a01b031682526000610200602083810151858201526040808501518187015260608086015180516001600160a01b0316828901529283015160808801529082015160a087015281015160c086015250608083015180516001600160a01b031660e08601526020810151610100860152604081015161012086015260608101516101408601525060a083015161016085015260c08301516001600160a01b0381166101808601525060e08301518015156101a086015250610100830151816101c086015261617882860182615c3e565b9150506101208301518482036101e08601526140858282615c3e565b602081526000612b1860208301846160a2565b6060815260006161ba60608301866160a2565b90508360208301526001600160a01b0383166040830152949350505050565b60006001600160a01b03808a168352808916602084015287604084015286606084015260e0608084015261621060e0840187615c3e565b83810360a08501526162228187615c3e565b92505080841660c08401525098975050505050505050565b600080610140838503121561624e57600080fd5b6162588484615eaf565b915061012083015190509250929050565b818352818160208501375060006020828401015260006020601f19601f840116840101905092915050565b60006001600160a01b03808b16835289602084015288604084015287606084015286608084015260e060a08401526162d060e084018688616269565b915080841660c0840152509998505050505050505050565b8082018082111561094a5761094a615ba2565b60006101008983528860208401526001600160a01b03808916604085015280881660608501525085608084015284151560a08401528060c0840152600081840152506101208060e0840152615e9181840185615c3e565b83815260606020820152600061636b6060830185615c3e565b90506001600160a01b0383166040830152949350505050565b60006001600160a01b03808b16835289602084015288604084015287606084015260e060808401526163b960e0840188615c3e565b83810360a08501526163cc818789616269565b92505080841660c0840152509998505050505050505050565b808202811582820484141761094a5761094a615ba2565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600082616461577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b85815284602082015260a06040820152600061648560a0830186615c3e565b82810360608401526164978186615c3e565b9150506001600160a01b03831660808301529695505050505050565b6001600160a01b038616815284602082015283604082015260a0606082015260006164e160a0830185615c3e565b8281036080840152610ffb8185615c3e565b600080600080610180858703121561650a57600080fd5b6165148686615eaf565b9350610120850151925061014085015167ffffffffffffffff8082111561653a57600080fd5b818701915087601f83011261654e57600080fd5b8151602061655e61590883615f2f565b82815260069290921b8401810191818101908b84111561657d57600080fd5b948201945b8386101561606e576040868d03121561659b5760008081fd5b6165a361584a565b86516165ae816154b3565b81528684015184820152825260409095019490820190616582565b80516001600160a01b0316825260006101e0602083015160208501526040830151604085015260608301516060850152608083015161663560808601826001600160a01b0381511682526020810151602083015260408101516040830152606081015160608301525050565b5060a083015180516001600160a01b03908116610100878101919091526020830151610120880152604083015161014088015260609092015161016087015260c08501511661018086015260e08401516101a086018390529061669a83870183615c3e565b9250808501519150508482036101c08601526140858282615c3e565b602081526000612b1860208301846165c9565b6060815260006161ba60608301866165c9565b600060208083850312156166ef57600080fd5b825167ffffffffffffffff81111561670657600080fd5b8301601f8101851361671757600080fd5b805161672561590882615f2f565b81815260e0918202830184019184820191908884111561674457600080fd5b938501935b838510156167da5780858a0312156167615760008081fd5b61676961586d565b8551616774816155c4565b815285870151616783816155c4565b8188015260408681015190820152606080870151908201526080808701516167aa816154b3565b9082015260a0868101519082015260c0808701516167c7816154b3565b9082015283529384019391850191616749565b50979650505050505050565b61014081016168478287805115158252602081015115156020830152604081015160408301526060810151606083015260808101516001600160a01b03808216608085015260a083015160a08501528060c08401511660c085015250505050565b8460e0830152836101008301526001600160a01b03831661012083015295945050505050565b60006101406168ce8388805115158252602081015115156020830152604081015160408301526060810151606083015260808101516001600160a01b03808216608085015260a083015160a08501528060c08401511660c085015250505050565b8560e0840152806101008401526168e781840186615c3e565b9150506001600160a01b03831661012083015295945050505050565b60008251616915818460208701615c1a565b9190910192915050565b602081526000612b186020830184615c3e56fea2646970667358221220632f118e9f45e614b342e0ab636b912ea8cf3276042a123beb2616e076b33b0864736f6c63430008110033',
    sourceMap:
      '518:4018:21:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;8551:548:35;;;;;;;;;;-1:-1:-1;8551:548:35;;;;;:::i;:::-;;:::i;:::-;;;612:14:153;;605:22;587:41;;575:2;560:18;8551:548:35;;;;;;;;22098:331;;;;;;:::i;:::-;;:::i;:::-;;2544:178:36;;;;;;;;;;-1:-1:-1;2544:178:36;;;;;:::i;:::-;-1:-1:-1;2709:8:36;;2544:178;;;;2547:25:153;;;2535:2;2520:18;2544:178:36;2401:177:153;13144:1188:35;;;;;;:::i;:::-;;:::i;4703:52::-;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;4239:55:153;;;4221:74;;4209:2;4194:18;4703:52:35;4051:250:153;5227:52:35;;;;;;;;;;;;;;;1085:42:36;;;;;;;;;;;;;;;20493:1003:35;;;;;;;;;;-1:-1:-1;20493:1003:35;;;;;:::i;:::-;;:::i;17624:419::-;;;;;;;;;;-1:-1:-1;17624:419:35;;;;;:::i;:::-;;:::i;24259:189::-;;;;;;;;;;-1:-1:-1;24259:189:35;;;;;:::i;:::-;;:::i;5385:51::-;;;;;;;;;;;;;;;23833:246;;;;;;;;;;-1:-1:-1;23833:246:35;;;;;:::i;:::-;;:::i;1824:101:101:-;;;;;;;;;;;;;:::i;24835:223:35:-;;;;;;;;;;-1:-1:-1;24835:223:35;;;;;:::i;:::-;;:::i;22691:969::-;;;;;;;;;;-1:-1:-1;22691:969:35;;;;;:::i;:::-;;:::i;7975:129::-;;;;;;;;;;-1:-1:-1;7975:129:35;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;4438:46::-;;;;;;;;;;;;;;;1201:85:101;;;;;;;;;;-1:-1:-1;1247:7:101;1273:6;-1:-1:-1;;;;;1273:6:101;1201:85;;4958:66:35;;;;;;;;;;;;;;;19335:668;;;;;;;;;;-1:-1:-1;19335:668:35;;;;;:::i;:::-;;:::i;7006:732::-;;;;;;;;;;-1:-1:-1;7006:732:35;;;;;:::i;:::-;;:::i;2310:56:33:-;;;;;;;;;;;;;;;6311:57:35;;;;;;;;;;-1:-1:-1;6311:57:35;;;;;:::i;:::-;;;;;;;;;;;;;;;;2184:178:36;;;;;;;;;;-1:-1:-1;2184:178:36;;;;;:::i;:::-;-1:-1:-1;2349:8:36;;2184:178;4573:48:35;;;;;;;;;;;;;;;26005:1123;;;;;;:::i;:::-;;:::i;4826:42::-;;;;;;;;;;;;;;;5930:36;;;;;;;;;;-1:-1:-1;5930:36:35;;;;-1:-1:-1;;;;;5930:36:35;;;5781:40;;;;;;;;;;;;;;;;1755:202:36;;;;;;;;;;-1:-1:-1;1755:202:36;;;;;:::i;:::-;-1:-1:-1;1947:5:36;-1:-1:-1;;;;;1937:15:36;;;;;;;1755:202;1225:42;;;;;;;;;;;;;;;2074:198:101;;;;;;;;;;-1:-1:-1;2074:198:101;;;;;:::i;:::-;;:::i;939:39:36:-;;;;;;;;;;;;;;;15500:635:35;;;;;;;;;;-1:-1:-1;15500:635:35;;;;;:::i;:::-;;:::i;8551:548::-;8696:4;8723:71;;;8739:55;8723:71;;:135;;-1:-1:-1;8804:54:35;;;8820:38;8804:54;8723:135;:202;;;-1:-1:-1;8868:57:35;;;8884:41;8868:57;8723:202;:267;;;-1:-1:-1;8935:55:35;;;8951:39;8935:55;8723:267;:324;;;-1:-1:-1;9000:47:35;;;9016:31;9000:47;8723:324;:371;;;;9057:37;9081:12;9057:23;:37::i;:::-;8710:384;8551:548;-1:-1:-1;;8551:548:35:o;22098:331::-;2970:40;;;;;;;;15377:25:153;;;3005:4:35;15418:18:153;;;15411:83;22295:10:35;;2970:9;-1:-1:-1;;;;;2970:22:35;;;;15350:18:153;;2970:40:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2965:81;;3019:27;;;;;;;;;;;;;;2965:81;22356:68:::1;22371:10;22383:7;22392:6;22400:5;22407;;22414:9;;22356:14;:68::i;:::-;22098:331:::0;;;;;;;;:::o;13144:1188::-;2970:40;;;;;;;;15377:25:153;;;3005:4:35;15418:18:153;;;15411:83;13440:7:35;;13419:10;;-1:-1:-1;;;;;2970:9:35;:22;;;;15350:18:153;;2970:40:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2965:81;;3019:27;;;;;;;;;;;;;;2965:81;13593:5:::1;-1:-1:-1::0;;;;;13593:21:35::1;241:42:79;13593:21:35;13589:535;;13628:9;:13:::0;13624:48:::1;;13650:22;;;;;;;;;;;;;;13624:48;13746:22;13771:10;:8;:10::i;:::-;13746:35;;13853:58;13867:10;13895:4;13903:7;13853:13;:58::i;:::-;14001:14;13988:10;:8;:10::i;:::-;:27;;;;:::i;:::-;13978:37;;13616:406;13589:535;;;14115:9;14105:19;;13589:535;14144:183;14158:7;14175:10;14195;14215:12;14237:18;14265:20;14295:5;;14144:183;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;14310:9;;14144:183;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::::0;::::1;::::0;;;;-1:-1:-1;14144:4:35::1;::::0;-1:-1:-1;;;14144:183:35:i:1;:::-;14131:196:::0;13144:1188;-1:-1:-1;;;;;;;;;;;;13144:1188:35:o;20493:1003::-;20614:28;;;;;;;;2547:25:153;;;20700:15:35;;20614:8;-1:-1:-1;;;;;20614:16:35;;;;2520:18:153;;20614:28:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;20644:10;256:1:77;1318:55:33;1337:8;1347:7;1356:16;1318:18;:55::i;:::-;20813:35:35::1;::::0;;;;-1:-1:-1;;;;;20830:5:35::1;16525:55:153::0;;20813:35:35::1;::::0;::::1;16507:74:153::0;16597:18;;;16590:34;;;20813:16:35;::::1;::::0;::::1;::::0;16480:18:153;;20813:35:35::1;;;;;;;;;;;;;;;;;::::0;::::1;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;20808:79;;20857:30;;;;;;;;;;;;;;20808:79;20946:33;::::0;;;;::::1;::::0;::::1;2547:25:153::0;;;20946:5:35::1;-1:-1:-1::0;;;;;20946:21:35::1;::::0;::::1;::::0;2520:18:153;;20946:33:35::1;;;;;;;;;;;;;;;;;;::::0;::::1;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;20936:43:::0;-1:-1:-1;21029:11:35;;21025:410:::1;;21101:40;21127:3;21133:7;21101:17;:40::i;:::-;21214:21;21238:5;-1:-1:-1::0;;;;;21238:21:35::1;241:42:79;21238:21:35;:35;;21272:1;21238:35;;;21262:7;21238:35;21418:9;::::0;;::::1;::::0;::::1;::::0;;-1:-1:-1;21418:9:35;;21345:83;;;;;21214:59;;-1:-1:-1;;;;;;21345:18:35;::::1;::::0;::::1;::::0;21214:59;;21345:83:::1;::::0;21386:10;;21398:7;;21407:5:::1;::::0;21345:83:::1;;;:::i;:::-;;;;;;;;;;;;;;;;;;::::0;::::1;;;;;;;;;;;;::::0;::::1;;;;;;;;;;21042:393;21025:410;21446:45;::::0;;15377:25:153;;;21480:10:35::1;15433:2:153::0;15418:18;;15411:83;-1:-1:-1;;;;;21446:45:35;::::1;::::0;21454:10;;21446:45:::1;::::0;15350:18:153;21446:45:35::1;;;;;;;20493:1003:::0;;;;;;;:::o;17624:419::-;17838:37;17959:79;17980:10;17992:7;18001:9;18012:18;18032:5;;17959:20;:79::i;:::-;17952:86;17624:419;-1:-1:-1;;;;;;;;17624:419:35:o;24259:189::-;1094:13:101;:11;:13::i;:::-;24377:8:35::1;:20:::0;;;::::1;-1:-1:-1::0;;;;;24377:20:35;::::1;::::0;;::::1;::::0;;;24409:34:::1;::::0;24432:10:::1;4221:74:153::0;;24409:34:35::1;::::0;4209:2:153;4194:18;24409:34:35::1;;;;;;;24259:189:::0;:::o;23833:246::-;1094:13:101;:11;:13::i;:::-;3477:10:35::1;23957:4;:15;23953:42;;;23981:14;;;;;;;;;;;;;;23953:42;24028:3;:10:::0;;;24050:24:::1;::::0;;15377:25:153;;;24063:10:35::1;15433:2:153::0;15418:18;;15411:83;24050:24:35::1;::::0;15350:18:153;24050:24:35::1;;;;;;;23833:246:::0;:::o;1824:101:101:-;1094:13;:11;:13::i;:::-;1888:30:::1;1915:1;1888:18;:30::i;:::-;1824:101::o:0;24835:223:35:-;1094:13:101;:11;:13::i;:::-;-1:-1:-1;;;;;24961:26:35;::::1;;::::0;;;:16:::1;:26;::::0;;;;;;;;:34;;;::::1;::::0;::::1;;::::0;;::::1;::::0;;;25007:46;;25042:10:::1;4221:74:153::0;;24961:34:35;;:26;25007:46:::1;::::0;4194:18:153;25007:46:35::1;;;;;;;24835:223:::0;;:::o;22691:969::-;22815:28;;;;;;;;2547:25:153;;;22815:8:35;-1:-1:-1;;;;;22815:16:35;;;;2520:18:153;;22815:28:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;22851:10;300:1:77;22916:7:35;1247::101;1273:6;-1:-1:-1;;;;;1273:6:101;;1201:85;22916:7:35;-1:-1:-1;;;;;22902:21:35;:10;-1:-1:-1;;;;;22902:21:35;;1913:82:33;1948:8;1958:7;1967:16;1985:9;1913:34;:82::i;:::-;22989:24:35::1;23016:23:::0;;;:11:::1;:23;::::0;;;;;;;22989:50;;;;;;::::1;::::0;;;;;;;;;;;;23016:23;;22989:50;:24;;:50;::::1;;;;;;;;;::::0;;;::::1;::::0;;;;::::1;::::0;;::::1;::::0;::::1;::::0;;::::1;::::0;::::1;::::0;;::::1;::::0;;;;::::1;::::0;;::::1;::::0;::::1;::::0;;::::1;::::0;;::::1;::::0;;;::::1;;::::0;;;;;;;;;;::::1;-1:-1:-1::0;;;;;22989:50:35::1;::::0;;;;;;;;;::::1;::::0;::::1;;;;-1:-1:-1::0;;;23082:23:35::1;::::0;;;:11:::1;:23;::::0;;;;22989:50;;-1:-1:-1;23075:30:35::1;::::0;23082:23;-1:-1:-1;23075:30:35::1;:::i;:::-;23171:16:::0;;23146:22:::1;23219:437;23241:14;23236:2;:19;23219:437;;;23296:15;23314:110;23334:9;23344:2;23334:13;;;;;;;;:::i;:::-;;;;;;;:20;;;23364:9;23374:2;23364:13;;;;;;;;:::i;:::-;;;;;;;:17;;;23314:110;;23391:9;23401:2;23391:13;;;;;;;;:::i;:::-;;;;;;;:25;;;23314:110;;:10;:110::i;:::-;23296:128;;23459:59;23471:7;23480:9;23490:2;23480:13;;;;;;;;:::i;:::-;;;;;;;:25;;;23507:10;23459:11;:59::i;:::-;23564:4;23532:76;;23555:7;23543:10;23532:76;23570:9;23580:2;23570:13;;;;;;;;:::i;:::-;;;;;;;:25;;;23597:10;23532:76;;;;;;-1:-1:-1::0;;;;;18824:15:153;;;18806:34;;18876:15;;18871:2;18856:18;;18849:43;18733:2;18718:18;;18571:327;23532:76:35::1;;;;;;;;-1:-1:-1::0;23637:4:35::1;;23219:437;;7975:129:::0;8047:14;8076:11;:23;8088:10;8076:23;;;;;;;;;;;8069:30;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;8069:30:35;;;;;;;;;;;;;;;;;;;;;;7975:129;;;:::o;19335:668::-;19632:28;;;;;;;;2547:25:153;;;19715:28:35;;19632:8;-1:-1:-1;;;;;19632:16:35;;;;2520:18:153;;19632:28:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;19662:10;827:2:77;1318:55:33;1337:8;1347:7;1356:16;1318:18;:55::i;:::-;19835:163:35::1;19860:10;19880:7;19897:9;19916:18;19944:12;19966:5;19981:9;;19835:15;:163::i;:::-;19822:176:::0;19335:668;-1:-1:-1;;;;;;;;;;;;;19335:668:35:o;7006:732::-;7198:41;;;;;7222:4;7198:41;;;16507:74:153;16597:18;;;16590:34;;;7116:7:35;;;;-1:-1:-1;;;;;7198:5:35;:23;;;;16480:18:153;;7198:41:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;7178:61;;7330:25;7359:8;7371:2;7359:14;7358:101;;7401:58;7435:9;7446:8;7456:2;7401:33;:58::i;:::-;7358:101;;;7383:9;7358:101;7330:129;;112:1:73;7523:8:35;:28;7522:211;;7591:142;7617:17;7646:12;7650:8;7646:2;:12;:::i;:::-;7670:53;;;;;7686:8;7670:53;;;20947:25:153;112:1:73;20988:18:153;;;20981:34;7714:8:35;21031:18:153;;;21024:34;7670:6:35;-1:-1:-1;;;;;7670:15:35;;;;20920:18:153;;7670:53:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;7591:14;:142::i;:::-;7522:211;;;7563:17;7522:211;7509:224;7006:732;-1:-1:-1;;;;7006:732:35:o;26005:1123::-;2970:40;;;;;;;;15377:25:153;;;3005:4:35;15418:18:153;;;15411:83;26232:10:35;;2970:9;-1:-1:-1;;;;;2970:22:35;;;;15350:18:153;;2970:40:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2965:81;;3019:27;;;;;;;;;;;;;;2965:81;26444:5:::1;-1:-1:-1::0;;;;;26444:21:35::1;241:42:79;26444:21:35;26440:576;;26519:9;:13:::0;26515:48:::1;;26541:22;;;;;;;;;;;;;;26515:48;26637:22;26662:10;:8;:10::i;:::-;26637:35;;26744:58;26758:10;26786:4;26794:7;26744:13;:58::i;:::-;26892:14;26879:10;:8;:10::i;:::-;:27;;;;:::i;:::-;26869:37;;26467:446;26440:576;;;27007:9;26997:19;;26440:576;27046:77;27062:10;27074:7;27083:21;27106:5;;27046:77;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::::0;::::1;::::0;;;;-1:-1:-1;;27046:77:35::1;::::0;;::::1;;::::0;::::1;::::0;;::::1;::::0;::::1;::::0;;;;;;;;;;;-1:-1:-1;27113:9:35;;-1:-1:-1;27113:9:35;;;;27046:77;::::1;27113:9:::0;;;;27046:77;::::1;;::::0;::::1;::::0;;;;-1:-1:-1;27046:15:35::1;::::0;-1:-1:-1;;;27046:77:35:i:1;:::-;26005:1123:::0;;;;;;;;;:::o;2074:198:101:-;1094:13;:11;:13::i;:::-;-1:-1:-1;;;;;2162:22:101;::::1;2154:73;;;::::0;::::1;::::0;;21271:2:153;2154:73:101::1;::::0;::::1;21253:21:153::0;21310:2;21290:18;;;21283:30;21349:34;21329:18;;;21322:62;21420:8;21400:18;;;21393:36;21446:19;;2154:73:101::1;;;;;;;;;2237:28;2256:8;2237:18;:28::i;:::-;2074:198:::0;:::o;15500:635:35:-;15852:21;15797:7;15806:10;158:1:77;1318:55:33;1337:8;1347:7;1356:16;1318:18;:55::i;:::-;15965:165:35::1;15990:7;16007:10;16027:11;16048:18;16076:12;16098:5;16113:9;15965:15;:165::i;3169:327:36:-:0;3292:4;3319:52;;;3335:36;3319:52;;:125;;-1:-1:-1;3381:63:36;;;3397:47;3381:63;3319:125;:172;;;-1:-1:-1;952:25:135;937:40;;;;3454:37:36;829:155:135;1044:117:21;1118:38;;;;;1150:4;1118:38;;;4221:74:153;1096:7:21;;1125:5;-1:-1:-1;;;;;1118:23:21;;;;4194:18:153;;1118:38:21;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;1111:45;;1044:117;:::o;3466:252::-;-1:-1:-1;;;;;3582:22:21;;3599:4;3582:22;:131;;3662:51;-1:-1:-1;;;;;3669:5:21;3662:30;3693:5;3700:3;3705:7;3662:30;:51::i;:::-;3466:252;;;:::o;3582:131::-;3613:40;-1:-1:-1;;;;;3620:5:21;3613:26;3640:3;3645:7;3613:26;:40::i;55338:3889:35:-;55581:29;-1:-1:-1;;;;;55667:26:35;;55663:60;;55702:21;;;;;;;;;;;;;;55663:60;55893:35;-1:-1:-1;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;55893:35:35;56055:53;56116:19;56205:35;56243:49;;;;;;;;56257:5;-1:-1:-1;;;;;56243:49:35;;;;;56264:7;56243:49;;;;56273:8;56243:49;;;;56283:8;56243:49;;;56205:87;;56390:5;-1:-1:-1;;;;;56390:23:35;;56423:6;56439:14;56463:10;56483:18;56511:12;56533:5;56548:9;56390:175;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;56390:175:35;;;;;;;;;;;;:::i;:::-;56330:235;-1:-1:-1;56330:235:35;;-1:-1:-1;56330:235:35;;-1:-1:-1;56330:235:35;-1:-1:-1;56614:15:35;;56610:366;;56787:34;;;;;;;;2547:25:153;;;56787:9:35;-1:-1:-1;;;;;56787:22:35;;;;2520:18:153;;56787:34:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;56773:203;;;;;;;;26378:25:153;;;26419:18;;;26412:34;;;-1:-1:-1;;;;;26482:55:153;;;26462:18;;;26455:83;26574:3;26554:18;;;26547:31;-1:-1:-1;26594:19:153;;;26587:30;26697:14;;26690:22;26669:19;;;26662:51;56962:4:35;26729:19:153;;;26722:51;56773:62:35;;;;;;;26634:19:153;;56773:203:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;56749:227;;56610:366;57113:18;57089:21;:42;57085:79;;;57140:24;;;;;;;;;;;;;;57085:79;57259:27;;:32;57255:1734;;57384:37;57424:49;;;;;;;;57438:5;-1:-1:-1;;;;;57424:49:35;;;;;57445:7;57424:49;;;;57454:8;57424:49;;;;57464:8;57424:49;;;57384:89;;57484:25;57512:282;;;;;;;;57536:6;-1:-1:-1;;;;;57512:282:35;;;;;57554:10;57512:282;;;;57576:13;:27;;;57512:282;;;;57615:14;57512:282;;;;57641:16;57512:282;;;;57669:21;57512:282;;;;57702:12;-1:-1:-1;;;;;57512:282:35;;;;;57726:20;57512:282;;;;;;57758:5;57512:282;;;;57775:9;57512:282;;;57484:310;;57875:21;57899:20;:27;57875:51;;57942:10;57937:1044;57959:13;57954:2;:18;57937:1044;;;58052:50;58105:20;58126:2;58105:24;;;;;;;;:::i;:::-;;;;;;;58052:77;;58197:84;58223:19;:28;;;58254:19;:26;;;58197:17;:84::i;:::-;58363:21;58469;:5;-1:-1:-1;;;;;58469:21:35;;58465:69;;-1:-1:-1;58508:26:35;;;;58465:69;58645:26;;;;;58615:21;;;;:27;;;:56;58684:28;;:64;;;;;-1:-1:-1;;;;;58684:35:35;;;;;;58727:13;;58684:64;;58615:5;;58684:64;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;58794:19;:28;;;-1:-1:-1;;;;;58766:151:35;;58836:5;58855:19;:26;;;58895:10;58766:151;;;;;;;;:::i;:::-;;;;;;;;-1:-1:-1;;58954:4:35;;57937:1044;;;;57293:1696;;;57255:1734;56047:2948;;;59080:10;59052:13;:20;;;59017:13;:27;;;59006:216;59098:6;59112:12;59132:7;59147:21;59176:5;59189:9;59206:10;59006:216;;;;;;;;;;;;:::i;:::-;;;;;;;;55612:3615;55338:3889;;;;;;;;;;:::o;3361:359:33:-;3497:10;-1:-1:-1;;;;;3497:22:33;;;;;;:109;;-1:-1:-1;3530:76:33;;;;;3558:10;3530:76;;;29769:34:153;-1:-1:-1;;;;;29839:15:153;;;29819:18;;;29812:43;29871:18;;;29864:34;;;29914:18;;;29907:34;;;3530:13:33;:27;;;;29680:19:153;;3530:76:33;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;3529:77;3497:109;:190;;;;-1:-1:-1;3617:70:33;;;;;3645:10;3617:70;;;29769:34:153;-1:-1:-1;;;;;29839:15:153;;;29819:18;;;29812:43;3667:1:33;29871:18:153;;;29864:34;29914:18;;;29907:34;;;3617:13:33;:27;;;;29680:19:153;;3617:70:33;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;3616:71;3497:190;3486:229;;;3701:14;;;;;;;;;;;;;;4001:135:21;4082:49;-1:-1:-1;;;;;4089:5:21;4082:35;4118:3;4123:7;4082:35;:49::i;:::-;4001:135;;:::o;34915:3440:35:-;35242:83;;;;;;;;20947:25:153;;;20988:18;;;20981:34;;;21031:18;;;21024:34;;;35097:37:35;;;;;;-1:-1:-1;;;;;35242:5:35;:27;;;;20920:18:153;;35242:83:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;35174:151;;;;35435:18;35414;:39;35410:84;;;35462:32;;;;;;;;;;;;;;35410:84;35722:28;;;;;;;;2547:25:153;;;35682:29:35;;35722:8;-1:-1:-1;;;;;35722:16:35;;;;2520:18:153;;35722:28:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;35682:69;;35893:12;36224:20;36247:3;;36254:1;36247:8;:89;;36305:31;36325:10;36305:19;:31::i;:::-;36247:89;;;478:13:72;36247:89:35;36224:112;;36414:38;36524:35;36851:169;36888:10;36908:13;:27;;;36945:17;36972:18;37000:12;36851:27;:169::i;:::-;36787:233;-1:-1:-1;36787:233:35;-1:-1:-1;478:13:72;37033:44:35;;37029:293;;37242:61;;;;37029:293;37360:30;37394:1;37360:35;:218;;37577:1;37360:218;;;37406:160;37430:10;37452:13;37477:30;37519:13;37544:12;37406;:160::i;:::-;37353:225;-1:-1:-1;37694:32:35;;37690:393;;37878:58;37889:27;37918:3;;37923:12;37878:10;:58::i;:::-;37838:98;;:27;:98;:::i;:::-;37796:140;;38000:74;38022:4;38029:13;38044:29;38000:13;:74::i;:::-;36067:2022;;;38188:10;38160:13;:20;;;38125:13;:27;;;38100:250;38206:13;38227:7;38242:18;38268:4;38280:29;38317:9;;38334:10;38100:250;;;;;;;;;;;;;:::i;:::-;;;;;;;;35136:3219;;;;34915:3440;;;;;;;;:::o;1359:130:101:-;1247:7;1273:6;-1:-1:-1;;;;;1273:6:101;719:10:128;1422:23:101;1414:68;;;;;;;32066:2:153;1414:68:101;;;32048:21:153;;;32085:18;;;32078:30;32144:34;32124:18;;;32117:62;32196:18;;1414:68:101;31864:356:153;2426:187:101;2499:16;2518:6;;-1:-1:-1;;;;;2534:17:101;;;;;;;;;;2566:40;;2518:6;;;;;;;2566:40;;2499:16;2566:40;2489:124;2426:187;:::o;4165:415:33:-;4338:9;4337:10;:42;;;;-1:-1:-1;4357:10:33;-1:-1:-1;;;;;4357:22:33;;;;4337:42;:129;;;;-1:-1:-1;4390:76:33;;;;;4418:10;4390:76;;;29769:34:153;-1:-1:-1;;;;;29839:15:153;;;29819:18;;;29812:43;29871:18;;;29864:34;;;29914:18;;;29907:34;;;4390:13:33;:27;;;;29680:19:153;;4390:76:33;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;4389:77;4337:129;:210;;;;-1:-1:-1;4477:70:33;;;;;4505:10;4477:70;;;29769:34:153;-1:-1:-1;;;;;29839:15:153;;;29819:18;;;29812:43;4527:1:33;29871:18:153;;;29864:34;29914:18;;;29907:34;;;4477:13:33;:27;;;;29680:19:153;;4477:70:33;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;4476:71;4337:210;4326:249;;;4561:14;;;;;;;;;;;;;;4326:249;4165:415;;;;:::o;62884:447:35:-;62996:7;63048:22;63086:64;63101:4;63107:12;478:13:72;63086:14:35;:64::i;:::-;63073:77;;:4;:77;:::i;:::-;63048:102;-1:-1:-1;63244:82:35;63259:7;418:13:72;63289:36:35;418:13:72;63048:102:35;63289:36;:::i;63244:82::-;63234:92;;:7;:92;:::i;:::-;63221:105;;;62884:447;;;;;;:::o;52563:1378::-;52750:63;;;;;3686:1;52750:63;;;15377:25:153;-1:-1:-1;;;;;52807:5:35;15438:55:153;;15418:18;;;15411:83;-1:-1:-1;;52750:9:35;:27;;;;;;15350:18:153;;52750:63:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;52719:94;-1:-1:-1;52882:21:35;52906:5;-1:-1:-1;;;;;52906:21:35;241:42:79;52906:21:35;:35;;52940:1;52906:35;;;52930:7;52906:35;53023:13;;;53033:2;53023:13;;;;;;;;;52882:59;;-1:-1:-1;52991:29:35;;53023:13;;;;;;;;;;;-1:-1:-1;53023:13:35;52991:45;;53084:5;53067:23;;;;;;32768:19:153;;32812:2;32803:12;;32639:182;53067:23:35;;;;-1:-1:-1;;53067:23:35;;;;;;;;;;-1:-1:-1;;;;;;53180:35:35;;53210:4;53180:35;53176:87;;53217:46;53243:9;53255:7;53217:17;:46::i;:::-;53303:198;;;;;-1:-1:-1;;;;;53303:13:35;;;;;53324;;53303:198;;3686:1;;53385:7;;53402:5;;53417:12;;53439:1;;;;53477:16;;53303:198;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;53303:198:35;;;;;;;;-1:-1:-1;;53303:198:35;;;;;;;;;;;;:::i;:::-;;;53270:667;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;;53653:35:35;;53683:4;53653:35;53649:87;;53690:46;53716:9;53728:7;53690:17;:46::i;:::-;53796:43;;;;;;;;33971:25:153;;;34012:18;;;34005:34;;;53796:5:35;-1:-1:-1;;;;;53796:27:35;;;;33944:18:153;;53796:43:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3686:1;53865:5;53853:77;53901:7;53910:6;53919:10;53853:77;;;;;;;;:::i;:::-;;;;;;;;53509:428;53270:667;;;;;52663:1278;;;52563:1378;;;:::o;39530:2192::-;39910:83;;;;;;;;20947:25:153;;;20988:18;;;20981:34;;;21031:18;;;21024:34;;;39766:28:35;;;;;;-1:-1:-1;;;;;39910:5:35;:27;;;;20920:18:153;;39910:83:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;39842:151;;;;40101:18;40080;:39;40076:84;;;40128:32;;;;;;;;;;;;;;40076:84;40511:28;;;;;;;;2547:25:153;;;40363:12:35;;;;-1:-1:-1;;;;;40511:8:35;:16;;;;2520:18:153;;40511:28:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;40487:52;;40763:20;40786:3;;40793:1;40786:8;:40;;;-1:-1:-1;40815:10:35;40798:28;;;;:16;:28;;;;;;;;40786:40;:121;;40876:31;40896:10;40876:19;:31::i;:::-;40786:121;;;478:13:72;40786:121:35;40763:144;;478:13:72;40985:12:35;:44;:155;;41052:88;41065:10;41077:13;41092:18;41112:13;41127:12;41052;:88::i;:::-;40985:155;;;41040:1;40985:155;41259:25;;;;-1:-1:-1;40978:162:35;-1:-1:-1;41365:24:35;;;41361:102;;41399:64;41421:4;41428:12;41442:20;41399:13;:64::i;:::-;40296:1174;;;41564:10;41536:13;:20;;;41501:13;:27;;;41481:236;41582:12;41602:7;41617:18;41643:20;41671:5;41684:9;;41701:10;41481:236;;;;;;;;;;;;;:::i;:::-;;;;;;;;39796:1926;;39530:2192;;;;;;;;;;:::o;89:461:74:-;212:7;368:9;349:15;:28;345:200;;-1:-1:-1;386:6:74;379:13;;345:200;425:9;407:15;:27;403:142;;;457:27;475:9;457:15;:27;:::i;:::-;452:33;;:2;:33;:::i;:::-;443:42;;:6;:42;:::i;:::-;436:49;;;;403:142;517:27;529:15;517:9;:27;:::i;:::-;512:33;;:2;:33;:::i;:::-;503:42;;:6;:42;:::i;15079:3983:98:-;15191:14;;;15683:6;15680:1;15677;15670:20;15719:1;15716;15712:9;15703:18;;15770:5;15766:2;15763:13;15755:5;15751:2;15747:14;15743:34;15734:43;;;15860:5;15869:1;15860:10;15856:138;;15931:11;15923:5;:19;;;;;:::i;:::-;;15914:28;;15970:13;;;;15856:138;16101:11;16092:5;:20;16088:101;;16135:43;;;;;;;;33971:25:153;;;34012:18;;;34005:34;;;33944:18;;16135:43:98;33797:248:153;16088:101:98;16424:17;16547:11;16544:1;16541;16534:25;17956:1;17093;17078:12;;:16;;17063:32;;17201:25;;;;17937:1;:15;;17936:21;;18189;;;18185:25;;18174:36;18258:21;;;18254:25;;18243:36;18328:21;;;18324:25;;18313:36;18398:21;;;18394:25;;18383:36;18468:21;;;18464:25;;18453:36;18539:21;;;18535:25;;;18524:36;;;17045:15;17467;;;17463:29;;;17459:37;;;16653:20;;;16642:32;;;17585:15;;;;16696:21;;17305:19;;;;17576:24;;;;19003:15;;;-1:-1:-1;;;;15079:3983:98:o;59832:598:35:-;60122:21;60146;:64;;60209:1;60146:64;;;60170:36;60186:10;60198:7;60170:15;:36::i;:::-;60122:88;-1:-1:-1;;;;;;60271:5:35;:27;;60299:10;60311:23;60122:88;60311:7;:23;:::i;:::-;60271:64;;;;;;;;;;;;;33971:25:153;;;;34012:18;;;34005:34;33944:18;;60271:64:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;60360:10;60347:78;60372:7;60381:13;60396:5;60403:9;60414:10;60347:78;;;;;;;;;;:::i;:::-;;;;;;;;60000:430;59832:598;;;;;:::o;30001:3538::-;30237:21;-1:-1:-1;;;;;30325:26:35;;30321:63;;30360:24;;;;;;;;;;;;;;30321:63;30557:35;-1:-1:-1;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;30557:35:35;30864:125;;;;;30701:60;;-1:-1:-1;;;;;30864:5:35;:25;;;;:125;;30899:7;;30916:10;;30936:11;;30957:5;;30972:9;;30864:125;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;30864:125:35;;;;;;;;;;;;:::i;:::-;30802:187;-1:-1:-1;30802:187:35;;-1:-1:-1;30802:187:35;;-1:-1:-1;30802:187:35;-1:-1:-1;31080:34:35;;;31076:74;;;31123:27;;;;;;;;;;;;;;31076:74;31197:15;;31193:196;;31236:34;;;;;;;;2547:25:153;;;31236:9:35;-1:-1:-1;;;;;31236:22:35;;;;2520:18:153;;31236:34:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;31222:167;;;;;-1:-1:-1;;;;;39310:55:153;;;31222:167:35;;;39292:74:153;39382:18;;;39375:34;;;39425:18;;;39418:34;;;39488:3;39468:18;;;39461:31;31374:5:35;39508:19:153;;;39501:30;;;39583:19;;;39576:51;31222:62:35;;;;;;;39548:19:153;;31222:167:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;31193:196;31484:27;;:32;31480:1676;;31609:37;31649:43;;;;;;;;31663:5;-1:-1:-1;;;;;31649:43:35;;;;;31670:1;31649:43;;;;31673:8;31649:43;;;;31683:8;31649:43;;;31609:83;;31703:28;31734:285;;;;;;;;31761:7;-1:-1:-1;;;;;31734:285:35;;;;;31780:10;31734:285;;;;31802:13;:27;;;31734:285;;;;31841:11;31734:285;;;;31864:55;;;;;;;;31878:5;-1:-1:-1;;;;;31864:55:35;;;;;31885:13;31864:55;;;;31900:8;31864:55;;;;31910:8;31864:55;;;31734:285;;;;31931:16;31734:285;;;;31959:12;-1:-1:-1;;;;;31734:285:35;;;;;31983:5;31734:285;;;;32000:9;31734:285;;;31703:316;;32030:21;32054:20;:27;32030:51;;32097:10;32092:1056;32114:13;32109:2;:18;32092:1056;;;32207:57;32267:20;32288:2;32267:24;;;;;;;;:::i;:::-;;;;;;;32207:84;;32359;32385:19;:28;;;32416:19;:26;;;32359:17;:84::i;:::-;32525:21;32631;:5;-1:-1:-1;;;;;32631:21:35;;32627:69;;-1:-1:-1;32670:26:35;;;;32627:69;32807:26;;;;;32777:21;;;;:27;;;:56;32846:28;;:67;;;;;-1:-1:-1;;;;;32846:38:35;;;;;;32892:13;;32846:67;;32777:5;;32846:67;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;32962:19;:28;;;-1:-1:-1;;;;;32931:154:35;;33004:5;33023:19;:26;;;33063:10;32931:154;;;;;;;;:::i;:::-;;;;;;;;-1:-1:-1;;33121:4:35;;32092:1056;;;;31518:1638;;;31480:1676;-1:-1:-1;33224:17:35;;33220:80;;33243:57;33265:4;33272:12;33286:13;33243;:57::i;:::-;33395:10;33367:13;:20;;;33332:13;:27;;;33312:222;33413:7;33428:12;33448:11;33467:13;33488:5;33501:9;33518:10;33312:222;;;;;;;;;;;;:::i;:::-;;;;;;;;30260:3279;30001:3538;;;;;;;;;:::o;1355:203:118:-;1482:68;;-1:-1:-1;;;;;42544:15:153;;;1482:68:118;;;42526:34:153;42596:15;;42576:18;;;42569:43;42628:18;;;42621:34;;;1455:96:118;;1475:5;;1505:27;;42438:18:153;;1482:68:118;;;;-1:-1:-1;;1482:68:118;;;;;;;;;;;;;;;;;;;;;;;;;;;1455:19;:96::i;941:175::-;1050:58;;-1:-1:-1;;;;;16525:55:153;;1050:58:118;;;16507:74:153;16597:18;;;16590:34;;;1023:86:118;;1043:5;;1073:23;;16480:18:153;;1050:58:118;16333:297:153;2582:280:118;2701:39;;;;;2725:4;2701:39;;;18806:34:153;-1:-1:-1;;;;;18876:15:153;;;18856:18;;;18849:43;2678:20:118;;2701:15;;;;;;18718:18:153;;2701:39:118;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2678:62;-1:-1:-1;2750:105:118;2770:5;2800:22;2824:7;2833:20;2848:5;2678:62;2833:20;:::i;:::-;2777:77;;-1:-1:-1;;;;;16525:55:153;;;2777:77:118;;;16507:74:153;16597:18;;;16590:34;16480:18;;2777:77:118;16333:297:153;63615:764:35;63809:63;;;;;3686:1;63809:63;;;15377:25:153;-1:-1:-1;;;;;63866:5:35;15438:55:153;;15418:18;;;15411:83;-1:-1:-1;;;;63809:9:35;:27;;;;15350:18:153;;63809:63:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;-1:-1:-1;;;;;63809:103:35;;63798:156;;-1:-1:-1;478:13:72;;63615:764:35;-1:-1:-1;63615:764:35:o;63798:156::-;63994:8;;-1:-1:-1;;;;;63994:8:35;:35;63990:370;;64096:8;;:39;;;;;;;;2547:25:153;;;-1:-1:-1;;;;;64096:8:35;;;;:27;;2520:18:153;;64096:39:35;;;;;;;;;;;;;;;;;;-1:-1:-1;64096:39:35;;;;;;;;-1:-1:-1;;64096:39:35;;;;;;;;;;;;:::i;:::-;;;64092:268;;-1:-1:-1;64350:1:35;;63615:764;-1:-1:-1;63615:764:35:o;64092:268::-;478:13:72;64260:8:35;:40;64256:61;;64309:8;63615:764;-1:-1:-1;;63615:764:35:o;64256:61::-;64136:190;64092:268;-1:-1:-1;64373:1:35;;63615:764;-1:-1:-1;63615:764:35:o;42484:1956::-;43005:49;;;;;;;;20947:25:153;;;20988:18;;;20981:34;;;21031:18;;;21024:34;;;42795:7:35;;42655:22;;367:13:72;;42655:22:35;;43005:11;-1:-1:-1;;;;;43005:20:35;;;;20920:18:153;;43005:49:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;43005:49:35;;;;;;;;;;;;:::i;:::-;42978:76;;43102:10;43097:1339;43119:7;:14;43114:2;:19;43097:1339;;;43202:21;43226:7;43234:2;43226:11;;;;;;;;:::i;:::-;;;;;;;43202:35;;43293:21;43335:18;43317:6;:14;;;:36;:145;;43389:73;43404:7;43413:6;:14;;;367:13:72;43389:14:35;:73::i;:::-;43317:145;;;43364:14;43317:145;43293:169;;43537:6;:14;;;43515:36;;;;;:::i;:::-;;;43630:24;43657:129;43691:6;43707:10;43727:6;43743:13;43766:12;43657:24;:129::i;:::-;43630:156;-1:-1:-1;43895:21:35;;;;;:58;;;43940:13;43920:16;:33;;43895:58;43891:118;;;43963:46;43996:13;43963:46;;:::i;:::-;;;43891:118;44022:17;;44018:188;;44174:13;44157:14;:30;44140:47;;44018:188;44289:6;44272:7;44252:10;44219:169;44305:6;44321:13;44344:16;44370:10;44219:169;;;;;;;;;:::i;:::-;;;;;;;;44417:4;;;;;43137:1299;;;43097:1339;;;;42718:1722;;42484:1956;;;;;;;;:::o;51561:720::-;51743:17;51780:38;51791:7;51800:3;;51805:12;51780:10;:38::i;:::-;2611:22:75;;;;51768:50:35;;-1:-1:-1;2637:2:75;2611:28;2643:1;2610:34;;;2609:41;51825:452:35;;51898:23;;;;:11;:23;;;;;;;;51927:63;;;;;;;;;;51949:3;;;51927:63;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;51927:63:35;;;;;;;;;51898:93;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;52034:3;;52005:73;;51933:7;;51910:10;;52005:73;;;;51962:12;;51977;;52067:10;;45926:25:153;;;-1:-1:-1;;;;;46048:15:153;;;46043:2;46028:18;;46021:43;46100:15;46095:2;46080:18;;46073:43;45914:2;45899:18;;45724:398;52005:73:35;;;;;;;;51825:452;;;52125:48;52137:9;52148:12;52162:10;52125:11;:48::i;:::-;52204:66;;;-1:-1:-1;;;;;18824:15:153;;18806:34;;52259:10:35;18871:2:153;18856:18;;18849:43;52238:5:35;;52227:9;;52215:10;;52204:66;;18718:18:153;52204:66:35;;;;;;;51825:452;51561:720;;;;;;;:::o;4399:135:21:-;4480:49;-1:-1:-1;;;;;4487:5:21;4480:35;4516:3;4521:7;4480:35;:49::i;60831:1519:35:-;60919:20;61027:23;;;:11;:23;;;;;;;;61000:50;;;;;;;;;;;;;;;;;60919:20;;;;61000:50;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;61000:50:35;;;;;;;;;;;;;;;;-1:-1:-1;;;61101:23:35;;;;:11;:23;;;;;61000:50;;-1:-1:-1;61094:30:35;;61101:23;-1:-1:-1;61094:30:35;:::i;:::-;61303:16;;61235:7;;61210:22;61351:906;61373:15;61368:2;:20;61351:906;;;61404:14;61422:1;61404:19;61400:810;;61425:23;;;;:11;:23;;;;;61454:13;;:9;;61464:2;;61454:13;;;;;;:::i;:::-;;;;;;;;;;;;61425:43;;;;;;;;-1:-1:-1;61425:43:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;61425:43:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;61400:810;;;61503:9;61513:2;61503:13;;;;;;;;:::i;:::-;;;;;;;:20;;;61485:14;:38;61481:729;;61591:9;61601:2;61591:13;;;;;;;;:::i;:::-;;;;;;;:20;;;61574:14;:37;61557:54;;61639:126;61663:9;61673:2;61663:13;;;;;;;;:::i;:::-;;;;;;;:20;;;61697:9;61707:2;61697:13;;;;;;;;:::i;:::-;;;;;;;:17;;;61639:126;;61728:9;61738:2;61728:13;;;;;;;;:::i;61639:126::-;61623:142;;;;61481:729;;;61822:11;:23;61834:10;61822:23;;;;;;;;;;;61864:187;;;;;;;;61908:14;61885:9;61895:2;61885:13;;;;;;;;:::i;:::-;;;;;;;:20;;;:37;61864:187;;;;61938:9;61948:2;61938:13;;;;;;;;:::i;:::-;;;;;;;:17;;;61864:187;;;;;;61971:9;61981:2;61971:13;;;;;;;;:::i;:::-;;;;;;;:25;;;61864:187;;;;;;62012:9;62022:2;62012:13;;;;;;;;:::i;:::-;;;;;;;;;;;;:25;;;;;-1:-1:-1;;;;;61864:187:35;;;;;;61822:241;;;;;;;;-1:-1:-1;61822:241:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;62118:13;;62091:72;;62102:14;;62118:9;;62128:2;;62118:13;;;;;;:::i;62091:72::-;62075:88;;;;62200:1;62183:18;;61481:729;62238:4;;61351:906;;;-1:-1:-1;62268:77:35;;;15377:25:153;;;62334:10:35;15433:2:153;15418:18;;15411:83;62304:12:35;;62295:7;;62283:10;;62268:77;;15350:18:153;62268:77:35;;;;;;;60943:1407;;;60831:1519;;;;:::o;5173:642:118:-;5592:23;5618:69;5646:4;5618:69;;;;;;;;;;;;;;;;;5626:5;-1:-1:-1;;;;;5618:27:118;;;:69;;;;;:::i;:::-;5592:95;;5705:10;:17;5726:1;5705:22;:56;;;;5742:10;5731:30;;;;;;;;;;;;:::i;:::-;5697:111;;;;;;;46329:2:153;5697:111:118;;;46311:21:153;46368:2;46348:18;;;46341:30;46407:34;46387:18;;;46380:62;46478:12;46458:18;;;46451:40;46508:19;;5697:111:118;46127:406:153;44903:6084:35;45185:16;;;;45077:23;;-1:-1:-1;;;;;45185:49:35;;45181:5802;;478:13:72;45353:12:35;:44;:91;;;-1:-1:-1;45426:16:35;;;;-1:-1:-1;;;;;45401:43:35;;;;;:16;:43;;;;;;;;45353:91;45340:412;;;-1:-1:-1;45479:7:35;45340:412;;;45695:38;45706:7;45715:3;;45720:12;45695:10;:38::i;:::-;45685:7;:48;45667:66;;45340:412;45811:61;45837:6;:16;;;45856:15;45811:17;:61::i;:::-;45932:34;45969:139;;;;;;;;46000:5;-1:-1:-1;;;;;45969:139:35;;;;;46015:15;45969:139;;;;46040:8;45969:139;;;;46058:10;45969:139;;;;46078:6;45969:139;;;;46094:6;45969:139;;;45932:176;;46171:14;46193:20;46235:125;46286:6;:16;;;46315:35;46235:31;:125::i;:::-;46222:434;;;46447:6;:16;;;-1:-1:-1;;;;;46447:25:35;;241:42:79;-1:-1:-1;;;;;46480:21:35;:5;-1:-1:-1;;;;;46480:21:35;;:43;;46522:1;46480:43;;;46504:15;46480:43;46447:84;;;;;;;;;;;46787:13:153;;-1:-1:-1;;;;;46783:62:153;;;46447:84:35;;;46765:81:153;46902:4;46890:17;;;46884:24;46862:20;;;46855:54;46953:17;;;46947:24;46925:20;;;46918:54;47028:4;47016:17;;;47010:24;46988:20;;;46981:54;47091:4;47079:17;;;47073:24;47051:20;;;47044:54;47145:4;47133:17;;;47127:24;44707:12;;44700:20;44693:28;47200:20;;;44681:41;44774:16;;;44768:23;44761:31;44754:39;44738:14;;;44731:63;44832:16;;;44826:23;44810:14;;;44803:47;44888:16;;;44882:23;44866:14;;;44859:47;44941:16;;44935:23;45051:21;;45035:14;;;45028:45;45111:16;;;45105:23;45089:14;;;45082:47;44738:14;45171:16;;;45165:23;45161:32;;;45145:14;;;45138:56;46737:19;;46447:84:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;46443:191;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;46622:1:35;;-1:-1:-1;46595:6:35;-1:-1:-1;46222:434:35;;46443:191;46222:434;;;46655:1;46646:10;;46222:434;46670:11;;46666:505;;46759:61;46785:6;:16;;;46804:15;46759:17;:61::i;:::-;46991:48;;;;;;;;33971:25:153;;;34012:18;;;34005:34;;;46916:1:35;;-1:-1:-1;46991:5:35;-1:-1:-1;;;;;46991:27:35;;;;33944:18:153;;46991:48:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;47070:10;47055:107;47082:6;47090:7;47099:6;47109:1;47099:11;:50;;47123:26;;;;;;47434:2:153;47416:21;;;47473:2;47453:18;;;47446:30;47512:14;47507:2;47492:18;;47485:42;47559:2;47544:18;;47232:336;47123:26:35;;;;;;;;;;;;;47099:50;;;47113:7;47099:50;47151:10;47055:107;;;;;;;;;:::i;:::-;;;;;;;;46666:505;45236:2011;;;45181:5802;;;47257:16;;;;:21;47253:3730;;47409:16;;;;47381:52;;;;;47350:28;;-1:-1:-1;;;;;47381:9:35;:27;;;;:52;;47427:5;;47381:52;;15377:25:153;;;-1:-1:-1;;;;;15438:55:153;15433:2;15418:18;;15411:83;15365:2;15350:18;;15157:343;47381:52:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;47350:83;-1:-1:-1;;;;;;47506:43:35;;47502:88;;47558:32;;;;;;;;;;;;;;47502:88;-1:-1:-1;;;;;47701:17:35;;47714:4;47701:17;;:73;;;478:13:72;47730:12:35;:44;47701:73;:121;;;-1:-1:-1;;;;;;47786:36:35;;;;;;:16;:36;;;;;;;;47701:121;47688:441;;;47857:7;47839:25;;47688:441;;;48072:38;48083:7;48092:3;;48097:12;48072:10;:38::i;:::-;48062:7;:48;48044:66;;47688:441;48188:54;48214:9;48226:15;48188:17;:54::i;:::-;48328:13;;;48338:2;48328:13;;;;;;;;;48296:29;;48328:13;;;;;;;;;;-1:-1:-1;48328:13:35;48296:45;;48391:10;48374:28;;;;;;32768:19:153;;32812:2;32803:12;;32639:182;48374:28:35;;;;;;;;;;;;;48349:54;;48453:6;:25;;;48449:1615;;;48502:9;-1:-1:-1;;;;;48502:24:35;;241:42:79;-1:-1:-1;;;;;48534:21:35;:5;-1:-1:-1;;;;;48534:21:35;;:43;;48576:1;48534:43;;;48558:15;48534:43;48592:6;:16;;;48622:15;48651:5;48686:16;48502:212;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;48488:719;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;48834:54;48860:9;48872:15;48834:17;:54::i;:::-;49067:48;;;;;;;;33971:25:153;;;34012:18;;;34005:34;;;48988:1:35;;-1:-1:-1;49067:5:35;-1:-1:-1;;;;;49067:27:35;;;;33944:18:153;;49067:48:35;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;49148:10;49133:63;49160:6;49168:7;49177:6;49185:10;49133:63;;;;;;;;;:::i;:::-;;;;;;;;48726:481;48449:1615;;48488:719;48449:1615;;;49241:9;-1:-1:-1;;;;;49241:13:35;;241:42:79;-1:-1:-1;;;;;49262:21:35;:5;-1:-1:-1;;;;;49262:21:35;;:43;;49304:1;49262:43;;;49286:15;49262:43;49320:16;;;;49398:18;;;;49350:15;;49379:5;;-1:-1:-1;;;;;49398:32:35;:66;;49454:10;49398:66;;;49433:6;:18;;;49398:66;49493:20;;49241:330;;;;;;;;;;;;;;;;49478:1;;49543:16;;49241:330;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;49241:330:35;;;;;;;;-1:-1:-1;;49241:330:35;;;;;;;;;;;;:::i;:::-;;;49227:837;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;47280:2790;;47253:3730;;;50161:18;;;;50130:28;;-1:-1:-1;;;;;50161:32:35;:91;;50241:10;50161:91;;;50204:6;:18;;;50161:91;50130:122;;478:13:72;50449:12:35;:44;50445:351;;50521:7;50503:25;;50445:351;;;50739:38;50750:7;50759:3;;50764:12;50739:10;:38::i;:::-;50729:7;:48;50711:66;;50445:351;50917:59;50939:4;50946:12;50960:15;50917:13;:59::i;:::-;50076:907;44903:6084;;;;;;;:::o;3053:407:118:-;3196:39;;;;;3220:4;3196:39;;;18806:34:153;-1:-1:-1;;;;;18876:15:153;;;18856:18;;;18849:43;3173:20:118;;3196:15;;;;;;18718:18:153;;3196:39:118;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;3173:62;;3273:5;3257:12;:21;;3249:75;;;;;;;48355:2:153;3249:75:118;;;48337:21:153;48394:2;48374:18;;;48367:30;48433:34;48413:18;;;48406:62;48504:11;48484:18;;;48477:39;48533:19;;3249:75:118;48153:405:153;3249:75:118;3365:77;;-1:-1:-1;;;;;16525:55:153;;3365:77:118;;;16507:74:153;3421:20:118;;;16597:18:153;;;16590:34;3338:105:118;;3358:5;;3388:22;;16480:18:153;;3365:77:118;16333:297:153;4109:223:126;4242:12;4273:52;4295:6;4303:4;4309:1;4312:12;4273:21;:52::i;1349:282:136:-;1436:4;1543:23;1558:7;1543:14;:23::i;:::-;:81;;;;;1570:54;1603:7;1612:11;1570:32;:54::i;5166:446:126:-;5331:12;5388:5;5363:21;:30;;5355:81;;;;;;;48765:2:153;5355:81:126;;;48747:21:153;48804:2;48784:18;;;48777:30;48843:34;48823:18;;;48816:62;48914:8;48894:18;;;48887:36;48940:19;;5355:81:126;48563:402:153;5355:81:126;5447:12;5461:23;5488:6;-1:-1:-1;;;;;5488:11:126;5507:5;5514:4;5488:31;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;5446:73;;;;5536:69;5563:6;5571:7;5580:10;5592:12;5536:26;:69::i;:::-;5529:76;5166:446;-1:-1:-1;;;;;;;5166:446:126:o;704:427:136:-;768:4;975:68;1008:7;1017:25;975:32;:68::i;:::-;:149;;;;-1:-1:-1;1060:64:136;1093:7;1102:21;1060:32;:64::i;:::-;1059:65;956:168;704:427;-1:-1:-1;;704:427:136:o;4421:647::-;4592:71;;;49436:66:153;49424:79;;4592:71:136;;;;49406:98:153;;;;4592:71:136;;;;;;;;;;49379:18:153;;;;4592:71:136;;;;;;;;;;;4615:34;4592:71;;;4871:20;;4523:4;;4592:71;4523:4;;;;;;4592:71;4523:4;;4871:20;4836:7;4829:5;4818:86;4807:97;;4931:16;4917:30;;4981:4;4975:11;4960:26;;5013:7;:29;;;;;5038:4;5024:10;:18;;5013:29;:48;;;;-1:-1:-1;5046:15:136;;;5006:55;-1:-1:-1;;;;;;4421:647:136:o;7672:628:126:-;7852:12;7880:7;7876:418;;;7907:10;:17;7928:1;7907:22;7903:286;;-1:-1:-1;;;;;1702:19:126;;;8114:60;;;;;;;49717:2:153;8114:60:126;;;49699:21:153;49756:2;49736:18;;;49729:30;49795:31;49775:18;;;49768:59;49844:18;;8114:60:126;49515:353:153;8114:60:126;-1:-1:-1;8209:10:126;8202:17;;7876:418;8250:33;8258:10;8270:12;8981:17;;:21;8977:379;;9209:10;9203:17;9265:15;9252:10;9248:2;9244:19;9237:44;8977:379;9332:12;9325:20;;;;;;;;;;;:::i;-1:-1:-1:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;14:332:153:-;72:6;125:2;113:9;104:7;100:23;96:32;93:52;;;141:1;138;131:12;93:52;180:9;167:23;230:66;223:5;219:78;212:5;209:89;199:117;;312:1;309;302:12;639:154;-1:-1:-1;;;;;718:5:153;714:54;707:5;704:65;694:93;;783:1;780;773:12;798:348;850:8;860:6;914:3;907:4;899:6;895:17;891:27;881:55;;932:1;929;922:12;881:55;-1:-1:-1;955:20:153;;998:18;987:30;;984:50;;;1030:1;1027;1020:12;984:50;1067:4;1059:6;1055:17;1043:29;;1119:3;1112:4;1103:6;1095;1091:19;1087:30;1084:39;1081:59;;;1136:1;1133;1126:12;1081:59;798:348;;;;;:::o;1151:993::-;1269:6;1277;1285;1293;1301;1309;1317;1370:3;1358:9;1349:7;1345:23;1341:33;1338:53;;;1387:1;1384;1377:12;1338:53;1423:9;1410:23;1400:33;;1480:2;1469:9;1465:18;1452:32;1442:42;;1534:2;1523:9;1519:18;1506:32;1547:31;1572:5;1547:31;:::i;:::-;1597:5;-1:-1:-1;1653:2:153;1638:18;;1625:32;1676:18;1706:14;;;1703:34;;;1733:1;1730;1723:12;1703:34;1772:59;1823:7;1814:6;1803:9;1799:22;1772:59;:::i;:::-;1850:8;;-1:-1:-1;1746:85:153;-1:-1:-1;1938:3:153;1923:19;;1910:33;;-1:-1:-1;1955:16:153;;;1952:36;;;1984:1;1981;1974:12;1952:36;;2023:61;2076:7;2065:8;2054:9;2050:24;2023:61;:::i;:::-;1151:993;;;;-1:-1:-1;1151:993:153;;-1:-1:-1;1151:993:153;;;;1997:87;;-1:-1:-1;;;1151:993:153:o;2149:247::-;2208:6;2261:2;2249:9;2240:7;2236:23;2232:32;2229:52;;;2277:1;2274;2267:12;2229:52;2316:9;2303:23;2335:31;2360:5;2335:31;:::i;2583:118::-;2669:5;2662:13;2655:21;2648:5;2645:32;2635:60;;2691:1;2688;2681:12;2706:1340;2848:6;2856;2864;2872;2880;2888;2896;2904;2912;2920;2973:3;2961:9;2952:7;2948:23;2944:33;2941:53;;;2990:1;2987;2980:12;2941:53;3026:9;3013:23;3003:33;;3083:2;3072:9;3068:18;3055:32;3045:42;;3137:2;3126:9;3122:18;3109:32;3150:31;3175:5;3150:31;:::i;:::-;3200:5;-1:-1:-1;3257:2:153;3242:18;;3229:32;3270:33;3229:32;3270:33;:::i;:::-;3322:7;-1:-1:-1;3376:3:153;3361:19;;3348:33;;-1:-1:-1;3433:3:153;3418:19;;3405:33;3447:30;3405:33;3447:30;:::i;:::-;3496:7;-1:-1:-1;3554:3:153;3539:19;;3526:33;3578:18;3608:14;;;3605:34;;;3635:1;3632;3625:12;3605:34;3674:59;3725:7;3716:6;3705:9;3701:22;3674:59;:::i;:::-;3752:8;;-1:-1:-1;3648:85:153;-1:-1:-1;3840:3:153;3825:19;;3812:33;;-1:-1:-1;3857:16:153;;;3854:36;;;3886:1;3883;3876:12;3854:36;;3925:61;3978:7;3967:8;3956:9;3952:24;3925:61;:::i;:::-;3899:87;;4005:8;3995:18;;;4032:8;4022:18;;;2706:1340;;;;;;;;;;;;;:::o;4306:343::-;4402:6;4410;4463:2;4451:9;4442:7;4438:23;4434:32;4431:52;;;4479:1;4476;4469:12;4431:52;4515:9;4502:23;4492:33;;4575:2;4564:9;4560:18;4547:32;4588:31;4613:5;4588:31;:::i;:::-;4638:5;4628:15;;;4306:343;;;;;:::o;4654:820::-;4769:6;4777;4785;4793;4801;4809;4817;4870:3;4858:9;4849:7;4845:23;4841:33;4838:53;;;4887:1;4884;4877:12;4838:53;4923:9;4910:23;4900:33;;4980:2;4969:9;4965:18;4952:32;4942:42;;5031:2;5020:9;5016:18;5003:32;4993:42;;5085:2;5074:9;5070:18;5057:32;5098:31;5123:5;5098:31;:::i;:::-;5148:5;-1:-1:-1;5200:3:153;5185:19;;5172:33;;-1:-1:-1;5256:3:153;5241:19;;5228:33;5284:18;5273:30;;5270:50;;;5316:1;5313;5306:12;5270:50;5355:59;5406:7;5397:6;5386:9;5382:22;5355:59;:::i;5752:180::-;5811:6;5864:2;5852:9;5843:7;5839:23;5835:32;5832:52;;;5880:1;5877;5870:12;5832:52;-1:-1:-1;5903:23:153;;5752:180;-1:-1:-1;5752:180:153:o;5937:382::-;6002:6;6010;6063:2;6051:9;6042:7;6038:23;6034:32;6031:52;;;6079:1;6076;6069:12;6031:52;6118:9;6105:23;6137:31;6162:5;6137:31;:::i;:::-;6187:5;-1:-1:-1;6244:2:153;6229:18;;6216:32;6257:30;6216:32;6257:30;:::i;6456:1066::-;6675:2;6727:21;;;6797:13;;6700:18;;;6819:22;;;6646:4;;6675:2;6860;;6878:18;;;;6919:15;;;6646:4;6962:534;6976:6;6973:1;6970:13;6962:534;;;7035:13;;7073:9;;7061:22;;7122:11;;;7116:18;7157:10;7201:21;;;7187:12;;;7180:43;7267:11;;;7261:18;7257:27;7243:12;;;7236:49;7308:4;7356:11;;;7350:18;-1:-1:-1;;;;;7346:67:153;7332:12;;;7325:89;7443:4;7434:14;;;;7471:15;;;;6998:1;6991:9;6962:534;;;-1:-1:-1;7513:3:153;;6456:1066;-1:-1:-1;;;;;;;6456:1066:153:o;8285:184::-;8337:77;8334:1;8327:88;8434:4;8431:1;8424:15;8458:4;8455:1;8448:15;8474:255;8546:2;8540:9;8588:6;8576:19;;8625:18;8610:34;;8646:22;;;8607:62;8604:88;;;8672:18;;:::i;:::-;8708:2;8701:22;8474:255;:::o;8734:257::-;8806:4;8800:11;;;8838:17;;8885:18;8870:34;;8906:22;;;8867:62;8864:88;;;8932:18;;:::i;8996:253::-;9068:2;9062:9;9110:4;9098:17;;9145:18;9130:34;;9166:22;;;9127:62;9124:88;;;9192:18;;:::i;9254:334::-;9325:2;9319:9;9381:2;9371:13;;-1:-1:-1;;9367:86:153;9355:99;;9484:18;9469:34;;9505:22;;;9466:62;9463:88;;;9531:18;;:::i;:::-;9567:2;9560:22;9254:334;;-1:-1:-1;9254:334:153:o;9593:246::-;9642:4;9675:18;9667:6;9664:30;9661:56;;;9697:18;;:::i;:::-;-1:-1:-1;9754:2:153;9742:15;-1:-1:-1;;9738:88:153;9828:4;9734:99;;9593:246::o;9844:464::-;9887:5;9940:3;9933:4;9925:6;9921:17;9917:27;9907:55;;9958:1;9955;9948:12;9907:55;9994:6;9981:20;10025:49;10041:32;10070:2;10041:32;:::i;:::-;10025:49;:::i;:::-;10099:2;10090:7;10083:19;10145:3;10138:4;10133:2;10125:6;10121:15;10117:26;10114:35;10111:55;;;10162:1;10159;10152:12;10111:55;10227:2;10220:4;10212:6;10208:17;10201:4;10192:7;10188:18;10175:55;10275:1;10250:16;;;10268:4;10246:27;10239:38;;;;10254:7;9844:464;-1:-1:-1;;;9844:464:153:o;10313:1192::-;10464:6;10472;10480;10488;10496;10504;10512;10520;10528;10581:3;10569:9;10560:7;10556:23;10552:33;10549:53;;;10598:1;10595;10588:12;10549:53;10634:9;10621:23;10611:33;;10691:2;10680:9;10676:18;10663:32;10653:42;;10742:2;10731:9;10727:18;10714:32;10704:42;;10796:2;10785:9;10781:18;10768:32;10809:31;10834:5;10809:31;:::i;:::-;10859:5;-1:-1:-1;10911:3:153;10896:19;;10883:33;;-1:-1:-1;10968:3:153;10953:19;;10940:33;10982;10940;10982;:::i;:::-;11034:7;-1:-1:-1;11092:3:153;11077:19;;11064:33;11116:18;11146:14;;;11143:34;;;11173:1;11170;11163:12;11143:34;11196:50;11238:7;11229:6;11218:9;11214:22;11196:50;:::i;:::-;11186:60;;11299:3;11288:9;11284:19;11271:33;11255:49;;11329:2;11319:8;11316:16;11313:36;;;11345:1;11342;11335:12;11313:36;;11384:61;11437:7;11426:8;11415:9;11411:24;11384:61;:::i;:::-;11358:87;;11464:8;11454:18;;;11491:8;11481:18;;;10313:1192;;;;;;;;;;;:::o;12020:1129::-;12144:6;12152;12160;12168;12176;12184;12192;12200;12253:3;12241:9;12232:7;12228:23;12224:33;12221:53;;;12270:1;12267;12260:12;12221:53;12306:9;12293:23;12283:33;;12363:2;12352:9;12348:18;12335:32;12325:42;;12417:2;12406:9;12402:18;12389:32;12430:31;12455:5;12430:31;:::i;:::-;12480:5;-1:-1:-1;12537:2:153;12522:18;;12509:32;12550:30;12509:32;12550:30;:::i;:::-;12599:7;-1:-1:-1;12657:3:153;12642:19;;12629:33;12681:18;12711:14;;;12708:34;;;12738:1;12735;12728:12;12708:34;12777:59;12828:7;12819:6;12808:9;12804:22;12777:59;:::i;:::-;12855:8;;-1:-1:-1;12751:85:153;-1:-1:-1;12943:3:153;12928:19;;12915:33;;-1:-1:-1;12960:16:153;;;12957:36;;;12989:1;12986;12979:12;12957:36;;13028:61;13081:7;13070:8;13059:9;13055:24;13028:61;:::i;:::-;12020:1129;;;;-1:-1:-1;12020:1129:153;;-1:-1:-1;12020:1129:153;;;;;;13108:8;-1:-1:-1;;;12020:1129:153:o;13656:315::-;13724:6;13732;13785:2;13773:9;13764:7;13760:23;13756:32;13753:52;;;13801:1;13798;13791:12;13753:52;13840:9;13827:23;13859:31;13884:5;13859:31;:::i;:::-;13909:5;13961:2;13946:18;;;;13933:32;;-1:-1:-1;;;13656:315:153:o;13976:1176::-;14125:6;14133;14141;14149;14157;14165;14173;14181;14234:3;14222:9;14213:7;14209:23;14205:33;14202:53;;;14251:1;14248;14241:12;14202:53;14290:9;14277:23;14309:31;14334:5;14309:31;:::i;:::-;14359:5;-1:-1:-1;14411:2:153;14396:18;;14383:32;;-1:-1:-1;14462:2:153;14447:18;;14434:32;;-1:-1:-1;14518:2:153;14503:18;;14490:32;14531:33;14490:32;14531:33;:::i;:::-;14583:7;-1:-1:-1;14637:3:153;14622:19;;14609:33;;-1:-1:-1;14694:3:153;14679:19;;14666:33;14708;14666;14708;:::i;:::-;14760:7;-1:-1:-1;14818:3:153;14803:19;;14790:33;14842:18;14872:14;;;14869:34;;;14899:1;14896;14889:12;14869:34;14922:50;14964:7;14955:6;14944:9;14940:22;14922:50;:::i;:::-;14912:60;;15025:3;15014:9;15010:19;14997:33;14981:49;;15055:2;15045:8;15042:16;15039:36;;;15071:1;15068;15061:12;15039:36;;15094:52;15138:7;15127:8;15116:9;15112:24;15094:52;:::i;:::-;15084:62;;;13976:1176;;;;;;;;;;;:::o;15505:245::-;15572:6;15625:2;15613:9;15604:7;15600:23;15596:32;15593:52;;;15641:1;15638;15631:12;15593:52;15673:9;15667:16;15692:28;15714:5;15692:28;:::i;15755:184::-;15807:77;15804:1;15797:88;15904:4;15901:1;15894:15;15928:4;15925:1;15918:15;15944:128;16011:9;;;16032:11;;;16029:37;;;16046:18;;:::i;16077:251::-;16147:6;16200:2;16188:9;16179:7;16175:23;16171:32;16168:52;;;16216:1;16213;16206:12;16168:52;16248:9;16242:16;16267:31;16292:5;16267:31;:::i;16635:184::-;16705:6;16758:2;16746:9;16737:7;16733:23;16729:32;16726:52;;;16774:1;16771;16764:12;16726:52;-1:-1:-1;16797:16:153;;16635:184;-1:-1:-1;16635:184:153:o;16824:250::-;16909:1;16919:113;16933:6;16930:1;16927:13;16919:113;;;17009:11;;;17003:18;16990:11;;;16983:39;16955:2;16948:10;16919:113;;;-1:-1:-1;;17066:1:153;17048:16;;17041:27;16824:250::o;17079:329::-;17120:3;17158:5;17152:12;17185:6;17180:3;17173:19;17201:76;17270:6;17263:4;17258:3;17254:14;17247:4;17240:5;17236:16;17201:76;:::i;:::-;17322:2;17310:15;-1:-1:-1;;17306:88:153;17297:98;;;;17397:4;17293:109;;17079:329;-1:-1:-1;;17079:329:153:o;17413:662::-;17745:6;17734:9;17727:25;17788:6;17783:2;17772:9;17768:18;17761:34;-1:-1:-1;;;;;17835:6:153;17831:55;17826:2;17815:9;17811:18;17804:83;17923:3;17918:2;17907:9;17903:18;17896:31;17964:1;17958:3;17947:9;17943:19;17936:30;18003:3;17997;17986:9;17982:19;17975:32;17708:4;18024:45;18064:3;18053:9;18049:19;18041:6;18024:45;:::i;:::-;18016:53;17413:662;-1:-1:-1;;;;;;17413:662:153:o;18382:184::-;18434:77;18431:1;18424:88;18531:4;18528:1;18521:15;18555:4;18552:1;18545:15;19251:482;19340:1;19383:5;19340:1;19397:330;19418:7;19408:8;19405:21;19397:330;;;19537:4;19469:66;19465:77;19459:4;19456:87;19453:113;;;19546:18;;:::i;:::-;19596:7;19586:8;19582:22;19579:55;;;19616:16;;;;19579:55;19695:22;;;;19655:15;;;;19397:330;;;19401:3;19251:482;;;;;:::o;19738:866::-;19787:5;19817:8;19807:80;;-1:-1:-1;19858:1:153;19872:5;;19807:80;19906:4;19896:76;;-1:-1:-1;19943:1:153;19957:5;;19896:76;19988:4;20006:1;20001:59;;;;20074:1;20069:130;;;;19981:218;;20001:59;20031:1;20022:10;;20045:5;;;20069:130;20106:3;20096:8;20093:17;20090:43;;;20113:18;;:::i;:::-;-1:-1:-1;;20169:1:153;20155:16;;20184:5;;19981:218;;20283:2;20273:8;20270:16;20264:3;20258:4;20255:13;20251:36;20245:2;20235:8;20232:16;20227:2;20221:4;20218:12;20214:35;20211:77;20208:159;;;-1:-1:-1;20320:19:153;;;20352:5;;20208:159;20399:34;20424:8;20418:4;20399:34;:::i;:::-;20529:6;20461:66;20457:79;20448:7;20445:92;20442:118;;;20540:18;;:::i;:::-;20578:20;;19738:866;-1:-1:-1;;;19738:866:153:o;20609:131::-;20669:5;20698:36;20725:8;20719:4;20698:36;:::i;21796:929::-;22158:4;22187:3;-1:-1:-1;;;;;22290:2:153;22282:6;22278:15;22267:9;22260:34;22303:59;22358:2;22347:9;22343:18;22335:6;-1:-1:-1;;;;;21565:5:153;21559:12;21555:61;21550:3;21543:74;21666:4;21659:5;21655:16;21649:23;21642:4;21637:3;21633:14;21626:47;21722:4;21715:5;21711:16;21705:23;21698:4;21693:3;21689:14;21682:47;21778:4;21771:5;21767:16;21761:23;21754:4;21749:3;21745:14;21738:47;;;21476:315;22303:59;22399:6;22393:3;22382:9;22378:19;22371:35;22443:6;22437:3;22426:9;22422:19;22415:35;22499:2;22491:6;22487:15;22481:3;22470:9;22466:19;22459:44;;22540:2;22534:3;22523:9;22519:19;22512:31;22566:44;22606:2;22595:9;22591:18;22583:6;22566:44;:::i;:::-;22552:58;;22659:9;22651:6;22647:22;22641:3;22630:9;22626:19;22619:51;22687:32;22712:6;22704;22687:32;:::i;:::-;22679:40;21796:929;-1:-1:-1;;;;;;;;;;21796:929:153:o;22730:161::-;22832:13;;22854:31;22832:13;22854:31;:::i;:::-;22730:161;;;:::o;22896:771::-;22968:5;23016:6;23004:9;22999:3;22995:19;22991:32;22988:52;;;23036:1;23033;23026:12;22988:52;23058:22;;:::i;:::-;23049:31;;23109:9;23103:16;23096:5;23089:31;23173:2;23162:9;23158:18;23152:25;23147:2;23140:5;23136:14;23129:49;23231:2;23220:9;23216:18;23210:25;23205:2;23198:5;23194:14;23187:49;23289:2;23278:9;23274:18;23268:25;23263:2;23256:5;23252:14;23245:49;23348:3;23337:9;23333:19;23327:26;23321:3;23314:5;23310:15;23303:51;23408:3;23397:9;23393:19;23387:26;23381:3;23374:5;23370:15;23363:51;23468:3;23457:9;23453:19;23447:26;23441:3;23434:5;23430:15;23423:51;23507:73;23575:3;23564:9;23560:19;23507:73;:::i;:::-;23501:3;23494:5;23490:15;23483:98;23600:3;23656:2;23645:9;23641:18;23635:25;23630:2;23623:5;23619:14;23612:49;;22896:771;;;;:::o;23672:206::-;23755:4;23788:18;23780:6;23777:30;23774:56;;;23810:18;;:::i;:::-;-1:-1:-1;23855:1:153;23851:14;23867:4;23847:25;;23672:206::o;23883:443::-;23937:5;23990:3;23983:4;23975:6;23971:17;23967:27;23957:55;;24008:1;24005;23998:12;23957:55;24037:6;24031:13;24068:49;24084:32;24113:2;24084:32;:::i;24068:49::-;24142:2;24133:7;24126:19;24188:3;24181:4;24176:2;24168:6;24164:15;24160:26;24157:35;24154:55;;;24205:1;24202;24195:12;24154:55;24218:77;24292:2;24285:4;24276:7;24272:18;24265:4;24257:6;24253:17;24218:77;:::i;24331:1730::-;24538:6;24546;24554;24562;24615:3;24603:9;24594:7;24590:23;24586:33;24583:53;;;24632:1;24629;24622:12;24583:53;24655:63;24710:7;24699:9;24655:63;:::i;:::-;24645:73;;24758:3;24747:9;24743:19;24737:26;24727:36;;24807:3;24796:9;24792:19;24786:26;24831:18;24872:2;24864:6;24861:14;24858:34;;;24888:1;24885;24878:12;24858:34;24926:6;24915:9;24911:22;24901:32;;24971:7;24964:4;24960:2;24956:13;24952:27;24942:55;;24993:1;24990;24983:12;24942:55;25022:2;25016:9;25044:4;25068:83;25084:66;25147:2;25084:66;:::i;25068:83::-;25185:15;;;25267:1;25263:10;;;;25255:19;;25251:28;;;25216:12;;;;25291:19;;;25288:39;;;25323:1;25320;25313:12;25288:39;25347:11;;;;25367:486;25383:6;25378:3;25375:15;25367:486;;;25465:4;25459:3;25450:7;25446:17;25442:28;25439:118;;;25511:1;25540:2;25536;25529:14;25439:118;25583:22;;:::i;:::-;25639:3;25633:10;25656:33;25681:7;25656:33;:::i;:::-;25702:22;;25766:12;;;25760:19;25744:14;;;25737:43;25793:18;;25409:4;25400:14;;;;25831:12;;;;25367:486;;;25923:3;25908:19;;25902:26;25872:5;;-1:-1:-1;25902:26:153;-1:-1:-1;;;;25940:16:153;;;25937:36;;;25969:1;25966;25959:12;25937:36;;25992:63;26047:7;26036:8;26025:9;26021:24;25992:63;:::i;:::-;25982:73;;;24331:1730;;;;;;;:::o;26784:1105::-;26901:12;;-1:-1:-1;;;;;6390:54:153;6378:67;;26839:3;26867:6;26968:4;26957:16;;;26951:23;26935:14;;;26928:47;27024:4;27013:16;;;27007:23;26991:14;;;26984:47;27077:4;27066:16;;;27060:23;21559:12;;-1:-1:-1;;;;;21555:61:153;27138:14;;;21543:74;21655:16;;;21649:23;21633:14;;;21626:47;21711:16;;;21705:23;21689:14;;;21682:47;21767:16;;21761:23;21745:14;;;21738:47;-1:-1:-1;27201:4:153;27190:16;;27184:23;21559:12;;-1:-1:-1;;;;;21555:61:153;27273:4;27264:14;;21543:74;21666:4;21655:16;;21649:23;21633:14;;;21626:47;21722:4;21711:16;;21705:23;21689:14;;;21682:47;21778:4;21767:16;;21761:23;21745:14;;;21738:47;-1:-1:-1;27330:4:153;27319:16;;27313:23;27304:6;27295:16;;27288:49;27385:4;27374:16;;27368:23;-1:-1:-1;;;;;6390:54:153;;27444:6;27435:16;;6378:67;-1:-1:-1;27500:4:153;27489:16;;27483:23;421:13;;414:21;27556:6;27547:16;;402:34;27515:49;27612:6;27605:5;27601:18;27595:25;27654:2;27645:6;27640:3;27636:16;27629:28;27678:46;27720:2;27715:3;27711:12;27695:14;27678:46;:::i;:::-;27666:58;;;27772:6;27765:5;27761:18;27755:25;27824:3;27818:4;27814:14;27805:6;27800:3;27796:16;27789:40;27845:38;27878:4;27862:14;27845:38;:::i;27894:275::-;28085:2;28074:9;28067:21;28048:4;28105:58;28159:2;28148:9;28144:18;28136:6;28105:58;:::i;28174:466::-;28421:2;28410:9;28403:21;28384:4;28441:58;28495:2;28484:9;28480:18;28472:6;28441:58;:::i;:::-;28433:66;;28535:6;28530:2;28519:9;28515:18;28508:34;-1:-1:-1;;;;;28582:6:153;28578:55;28573:2;28562:9;28558:18;28551:83;28174:466;;;;;;:::o;28645:827::-;28943:4;-1:-1:-1;;;;;29053:2:153;29045:6;29041:15;29030:9;29023:34;29105:2;29097:6;29093:15;29088:2;29077:9;29073:18;29066:43;29145:6;29140:2;29129:9;29125:18;29118:34;29188:6;29183:2;29172:9;29168:18;29161:34;29232:3;29226;29215:9;29211:19;29204:32;29259:45;29299:3;29288:9;29284:19;29276:6;29259:45;:::i;:::-;29353:9;29345:6;29341:22;29335:3;29324:9;29320:19;29313:51;29381:32;29406:6;29398;29381:32;:::i;:::-;29373:40;;;29462:2;29454:6;29450:15;29444:3;29433:9;29429:19;29422:44;;28645:827;;;;;;;;;;:::o;30435:327::-;30547:6;30555;30608:3;30596:9;30587:7;30583:23;30579:33;30576:53;;;30625:1;30622;30615:12;30576:53;30648:63;30703:7;30692:9;30648:63;:::i;:::-;30638:73;;30751:3;30740:9;30736:19;30730:26;30720:36;;30435:327;;;;;:::o;30767:325::-;30855:6;30850:3;30843:19;30907:6;30900:5;30893:4;30888:3;30884:14;30871:43;;30959:1;30952:4;30943:6;30938:3;30934:16;30930:27;30923:38;30825:3;31081:4;-1:-1:-1;;31006:2:153;30998:6;30994:15;30990:88;30985:3;30981:98;30977:109;30970:116;;30767:325;;;;:::o;31097:762::-;31393:4;-1:-1:-1;;;;;31503:2:153;31495:6;31491:15;31480:9;31473:34;31543:6;31538:2;31527:9;31523:18;31516:34;31586:6;31581:2;31570:9;31566:18;31559:34;31629:6;31624:2;31613:9;31609:18;31602:34;31673:6;31667:3;31656:9;31652:19;31645:35;31717:3;31711;31700:9;31696:19;31689:32;31738:62;31795:3;31784:9;31780:19;31772:6;31764;31738:62;:::i;:::-;31730:70;;31849:2;31841:6;31837:15;31831:3;31820:9;31816:19;31809:44;;31097:762;;;;;;;;;;;:::o;32225:125::-;32290:9;;;32311:10;;;32308:36;;;32324:18;;:::i;32826:966::-;33207:4;33236:3;33266:6;33255:9;33248:25;33309:6;33304:2;33293:9;33289:18;33282:34;-1:-1:-1;;;;;33425:2:153;33417:6;33413:15;33408:2;33397:9;33393:18;33386:43;33477:2;33469:6;33465:15;33460:2;33449:9;33445:18;33438:43;;33518:6;33512:3;33501:9;33497:19;33490:35;33576:6;33569:14;33562:22;33556:3;33545:9;33541:19;33534:51;33622:2;33616:3;33605:9;33601:19;33594:31;33661:1;33656:2;33645:9;33641:18;33634:29;;33682:3;33722:2;33716:3;33705:9;33701:19;33694:31;33742:44;33782:2;33771:9;33767:18;33759:6;33742:44;:::i;34050:408::-;34253:6;34242:9;34235:25;34296:2;34291;34280:9;34276:18;34269:30;34216:4;34316:44;34356:2;34345:9;34341:18;34333:6;34316:44;:::i;:::-;34308:52;;-1:-1:-1;;;;;34400:6:153;34396:55;34391:2;34380:9;34376:18;34369:83;34050:408;;;;;;:::o;34463:853::-;34779:4;-1:-1:-1;;;;;34889:2:153;34881:6;34877:15;34866:9;34859:34;34929:6;34924:2;34913:9;34909:18;34902:34;34972:6;34967:2;34956:9;34952:18;34945:34;35015:6;35010:2;34999:9;34995:18;34988:34;35059:3;35053;35042:9;35038:19;35031:32;35086:45;35126:3;35115:9;35111:19;35103:6;35086:45;:::i;:::-;35180:9;35172:6;35168:22;35162:3;35151:9;35147:19;35140:51;35208:49;35250:6;35242;35234;35208:49;:::i;:::-;35200:57;;;35306:2;35298:6;35294:15;35288:3;35277:9;35273:19;35266:44;;34463:853;;;;;;;;;;;:::o;35321:168::-;35394:9;;;35425;;35442:15;;;35436:22;;35422:37;35412:71;;35463:18;;:::i;35494:184::-;35546:77;35543:1;35536:88;35643:4;35640:1;35633:15;35667:4;35664:1;35657:15;35683:274;35723:1;35749;35739:189;;35784:77;35781:1;35774:88;35885:4;35882:1;35875:15;35913:4;35910:1;35903:15;35739:189;-1:-1:-1;35942:9:153;;35683:274::o;35962:644::-;36241:6;36230:9;36223:25;36284:6;36279:2;36268:9;36264:18;36257:34;36327:3;36322:2;36311:9;36307:18;36300:31;36204:4;36354:45;36394:3;36383:9;36379:19;36371:6;36354:45;:::i;:::-;36447:9;36439:6;36435:22;36430:2;36419:9;36415:18;36408:50;36475:32;36500:6;36492;36475:32;:::i;:::-;36467:40;;;-1:-1:-1;;;;;36548:6:153;36544:55;36538:3;36527:9;36523:19;36516:84;35962:644;;;;;;;;:::o;36611:::-;-1:-1:-1;;;;;36894:6:153;36890:55;36879:9;36872:74;36982:6;36977:2;36966:9;36962:18;36955:34;37025:6;37020:2;37009:9;37005:18;36998:34;37068:3;37063:2;37052:9;37048:18;37041:31;36853:4;37095:45;37135:3;37124:9;37120:19;37112:6;37095:45;:::i;:::-;37189:9;37181:6;37177:22;37171:3;37160:9;37156:19;37149:51;37217:32;37242:6;37234;37217:32;:::i;37260:1737::-;37474:6;37482;37490;37498;37551:3;37539:9;37530:7;37526:23;37522:33;37519:53;;;37568:1;37565;37558:12;37519:53;37591:63;37646:7;37635:9;37591:63;:::i;:::-;37581:73;;37694:3;37683:9;37679:19;37673:26;37663:36;;37743:3;37732:9;37728:19;37722:26;37767:18;37808:2;37800:6;37797:14;37794:34;;;37824:1;37821;37814:12;37794:34;37862:6;37851:9;37847:22;37837:32;;37907:7;37900:4;37896:2;37892:13;37888:27;37878:55;;37929:1;37926;37919:12;37878:55;37958:2;37952:9;37980:4;38004:83;38020:66;38083:2;38020:66;:::i;38004:83::-;38121:15;;;38203:1;38199:10;;;;38191:19;;38187:28;;;38152:12;;;;38227:19;;;38224:39;;;38259:1;38256;38249:12;38224:39;38283:11;;;;38303:486;38319:6;38314:3;38311:15;38303:486;;;38401:4;38395:3;38386:7;38382:17;38378:28;38375:118;;;38447:1;38476:2;38472;38465:14;38375:118;38519:22;;:::i;:::-;38575:3;38569:10;38592:33;38617:7;38592:33;:::i;:::-;38638:22;;38702:12;;;38696:19;38680:14;;;38673:43;38729:18;;38345:4;38336:14;;;;38767:12;;;;38303:486;;39638:1011;39758:12;;-1:-1:-1;;;;;6390:54:153;6378:67;;39696:3;39724:6;39825:4;39818:5;39814:16;39808:23;39801:4;39796:3;39792:14;39785:47;39881:4;39874:5;39870:16;39864:23;39857:4;39852:3;39848:14;39841:47;39937:4;39930:5;39926:16;39920:23;39913:4;39908:3;39904:14;39897:47;39990:4;39983:5;39979:16;39973:23;40005:61;40060:4;40055:3;40051:14;40037:12;-1:-1:-1;;;;;21565:5:153;21559:12;21555:61;21550:3;21543:74;21666:4;21659:5;21655:16;21649:23;21642:4;21637:3;21633:14;21626:47;21722:4;21715:5;21711:16;21705:23;21698:4;21693:3;21689:14;21682:47;21778:4;21771:5;21767:16;21761:23;21754:4;21749:3;21745:14;21738:47;;;21476:315;40005:61;-1:-1:-1;40114:4:153;40103:16;;40097:23;21559:12;;-1:-1:-1;;;;;21555:61:153;;;40139:6;40202:12;;;21543:74;;;;21666:4;21655:16;;21649:23;21633:14;;;21626:47;21722:4;21711:16;;21705:23;21689:14;;;21682:47;21778:4;21767:16;;;21761:23;21745:14;;;21738:47;40263:4;40252:16;;40246:23;6390:54;40322:6;40313:16;;6378:67;40378:4;40367:16;;40361:23;40409:6;40400:16;;40393:28;;;40361:23;40442:46;40475:12;;;40361:23;40442:46;:::i;:::-;40430:58;;40536:2;40529:5;40525:14;40519:21;40497:43;;;40584:3;40578:4;40574:14;40565:6;40560:3;40556:16;40549:40;40605:38;40638:4;40622:14;40605:38;:::i;40654:284::-;40851:2;40840:9;40833:21;40814:4;40871:61;40928:2;40917:9;40913:18;40905:6;40871:61;:::i;40943:475::-;41196:2;41185:9;41178:21;41159:4;41216:61;41273:2;41262:9;41258:18;41250:6;41216:61;:::i;42666:1949::-;42787:6;42818:2;42861;42849:9;42840:7;42836:23;42832:32;42829:52;;;42877:1;42874;42867:12;42829:52;42910:9;42904:16;42943:18;42935:6;42932:30;42929:50;;;42975:1;42972;42965:12;42929:50;42998:22;;43051:4;43043:13;;43039:27;-1:-1:-1;43029:55:153;;43080:1;43077;43070:12;43029:55;43109:2;43103:9;43132:83;43148:66;43211:2;43148:66;:::i;43132:83::-;43249:15;;;43311:4;43350:11;;;43342:20;;43338:29;;;43280:12;;;;43237:3;43379:19;;;43376:39;;;43411:1;43408;43401:12;43376:39;43435:11;;;;43455:1130;43471:6;43466:3;43463:15;43455:1130;;;43551:2;43545:3;43536:7;43532:17;43528:26;43525:116;;;43595:1;43624:2;43620;43613:14;43525:116;43667:22;;:::i;:::-;43723:3;43717:10;43740:30;43762:7;43740:30;:::i;:::-;43783:22;;43839:12;;;43833:19;43865:30;43833:19;43865:30;:::i;:::-;43915:14;;;43908:31;43962:2;44006:12;;;44000:19;43984:14;;;43977:43;44043:2;44087:12;;;44081:19;44065:14;;;44058:43;44124:3;44161:12;;;44155:19;44187:33;44155:19;44187:33;:::i;:::-;44240:14;;;44233:31;44287:3;44332:12;;;44326:19;44310:14;;;44303:43;44370:3;44407:13;;;44401:20;44434:33;44401:20;44434:33;:::i;:::-;44487:15;;;44480:32;44525:18;;43488:12;;;;44563;;;;43455:1130;;;-1:-1:-1;44604:5:153;42666:1949;-1:-1:-1;;;;;;;42666:1949:153:o;45205:514::-;45475:3;45460:19;;45488:44;45464:9;45514:6;44713:5;44707:12;44700:20;44693:28;44688:3;44681:41;44785:4;44778:5;44774:16;44768:23;44761:31;44754:39;44747:4;44742:3;44738:14;44731:63;44843:4;44836:5;44832:16;44826:23;44819:4;44814:3;44810:14;44803:47;44899:4;44892:5;44888:16;44882:23;44875:4;44870:3;44866:14;44859:47;44952:4;44945:5;44941:16;44935:23;-1:-1:-1;;;;;45069:2:153;45055:12;45051:21;45044:4;45039:3;45035:14;45028:45;45122:4;45115:5;45111:16;45105:23;45098:4;45093:3;45089:14;45082:47;45190:2;45182:4;45175:5;45171:16;45165:23;45161:32;45154:4;45149:3;45145:14;45138:56;;;44620:580;;;45488:44;45569:6;45563:3;45552:9;45548:19;45541:35;45613:6;45607:3;45596:9;45592:19;45585:35;-1:-1:-1;;;;;45661:6:153;45657:55;45651:3;45640:9;45636:19;45629:84;45205:514;;;;;;;:::o;47573:575::-;47819:4;47848:3;47860:44;47894:9;47886:6;44713:5;44707:12;44700:20;44693:28;44688:3;44681:41;44785:4;44778:5;44774:16;44768:23;44761:31;44754:39;44747:4;44742:3;44738:14;44731:63;44843:4;44836:5;44832:16;44826:23;44819:4;44814:3;44810:14;44803:47;44899:4;44892:5;44888:16;44882:23;44875:4;44870:3;44866:14;44859:47;44952:4;44945:5;44941:16;44935:23;-1:-1:-1;;;;;45069:2:153;45055:12;45051:21;45044:4;45039:3;45035:14;45028:45;45122:4;45115:5;45111:16;45105:23;45098:4;45093:3;45089:14;45082:47;45190:2;45182:4;45175:5;45171:16;45165:23;45161:32;45154:4;45149:3;45145:14;45138:56;;;44620:580;;;47860:44;47941:6;47935:3;47924:9;47920:19;47913:35;47985:2;47979:3;47968:9;47964:19;47957:31;48005:44;48045:2;48034:9;48030:18;48022:6;48005:44;:::i;:::-;47997:52;;;-1:-1:-1;;;;;48090:6:153;48086:55;48080:3;48069:9;48065:19;48058:84;47573:575;;;;;;;:::o;48970:287::-;49099:3;49137:6;49131:13;49153:66;49212:6;49207:3;49200:4;49192:6;49188:17;49153:66;:::i;:::-;49235:16;;;;;48970:287;-1:-1:-1;;48970:287:153:o;49873:219::-;50022:2;50011:9;50004:21;49985:4;50042:44;50082:2;50071:9;50067:18;50059:6;50042:44;:::i',
    linkReferences: {},
    immutableReferences: {
      '21042': [
        {
          start: 1419,
          length: 32,
        },
        {
          start: 9178,
          length: 32,
        },
        {
          start: 9370,
          length: 32,
        },
        {
          start: 10607,
          length: 32,
        },
        {
          start: 10799,
          length: 32,
        },
      ],
      '23714': [
        {
          start: 1221,
          length: 32,
        },
        {
          start: 3226,
          length: 32,
        },
        {
          start: 4556,
          length: 32,
        },
        {
          start: 5430,
          length: 32,
        },
        {
          start: 9888,
          length: 32,
        },
        {
          start: 12203,
          length: 32,
        },
      ],
      '23719': [
        {
          start: 1583,
          length: 32,
        },
        {
          start: 2439,
          length: 32,
        },
        {
          start: 2701,
          length: 32,
        },
        {
          start: 6262,
          length: 32,
        },
        {
          start: 8002,
          length: 32,
        },
        {
          start: 11137,
          length: 32,
        },
        {
          start: 13603,
          length: 32,
        },
        {
          start: 15315,
          length: 32,
        },
        {
          start: 19006,
          length: 32,
        },
      ],
      '23724': [
        {
          start: 731,
          length: 32,
        },
        {
          start: 15703,
          length: 32,
        },
      ],
      '23729': [
        {
          start: 1654,
          length: 32,
        },
        {
          start: 6072,
          length: 32,
        },
      ],
      '23734': [
        {
          start: 1303,
          length: 32,
        },
        {
          start: 3626,
          length: 32,
        },
        {
          start: 5658,
          length: 32,
        },
        {
          start: 7750,
          length: 32,
        },
        {
          start: 9666,
          length: 32,
        },
        {
          start: 11717,
          length: 32,
        },
        {
          start: 11971,
          length: 32,
        },
        {
          start: 12915,
          length: 32,
        },
        {
          start: 13350,
          length: 32,
        },
        {
          start: 18675,
          length: 32,
        },
        {
          start: 19738,
          length: 32,
        },
      ],
      '23738': [
        {
          start: 807,
          length: 32,
        },
        {
          start: 7800,
          length: 32,
        },
      ],
      '23742': [
        {
          start: 1007,
          length: 32,
        },
        {
          start: 10054,
          length: 32,
        },
      ],
      '26332': [
        {
          start: 1772,
          length: 32,
        },
        {
          start: 1922,
          length: 32,
        },
        {
          start: 2864,
          length: 32,
        },
        {
          start: 3403,
          length: 32,
        },
        {
          start: 3765,
          length: 32,
        },
        {
          start: 3905,
          length: 32,
        },
        {
          start: 6433,
          length: 32,
        },
        {
          start: 7203,
          length: 32,
        },
        {
          start: 7352,
          length: 32,
        },
        {
          start: 7410,
          length: 32,
        },
        {
          start: 7621,
          length: 32,
        },
        {
          start: 8378,
          length: 32,
        },
        {
          start: 8705,
          length: 32,
        },
        {
          start: 9547,
          length: 32,
        },
        {
          start: 11094,
          length: 32,
        },
        {
          start: 11252,
          length: 32,
        },
        {
          start: 11477,
          length: 32,
        },
        {
          start: 13894,
          length: 32,
        },
        {
          start: 14086,
          length: 32,
        },
        {
          start: 14351,
          length: 32,
        },
        {
          start: 15270,
          length: 32,
        },
        {
          start: 16539,
          length: 32,
        },
        {
          start: 18042,
          length: 32,
        },
        {
          start: 18237,
          length: 32,
        },
        {
          start: 19051,
          length: 32,
        },
        {
          start: 19450,
          length: 32,
        },
        {
          start: 19512,
          length: 32,
        },
        {
          start: 19940,
          length: 32,
        },
        {
          start: 20008,
          length: 32,
        },
      ],
      '26336': [
        {
          start: 859,
          length: 32,
        },
        {
          start: 1531,
          length: 32,
        },
        {
          start: 5771,
          length: 32,
        },
        {
          start: 5815,
          length: 32,
        },
        {
          start: 5911,
          length: 32,
        },
        {
          start: 6034,
          length: 32,
        },
        {
          start: 7674,
          length: 32,
        },
        {
          start: 8431,
          length: 32,
        },
        {
          start: 13948,
          length: 32,
        },
        {
          start: 14139,
          length: 32,
        },
        {
          start: 18095,
          length: 32,
        },
      ],
      '26340': [
        {
          start: 646,
          length: 32,
        },
        {
          start: 1838,
          length: 32,
        },
        {
          start: 5866,
          length: 32,
        },
        {
          start: 5989,
          length: 32,
        },
        {
          start: 7712,
          length: 32,
        },
        {
          start: 8469,
          length: 32,
        },
        {
          start: 13986,
          length: 32,
        },
        {
          start: 14177,
          length: 32,
        },
      ],
    },
  },
  methodIdentifiers: {
    'acceptsToken(address,uint256)': 'df21a7dd',
    'addToBalanceOf(uint256,uint256,address,bool,string,bytes)': 'c715967a',
    'addToBalanceOf(uint256,uint256,address,string,bytes)': '0cf8e858',
    'baseWeightCurrency()': '2d1a5903',
    'currency()': 'e5a6b10f',
    'currencyForToken(address)': '1982d679',
    'currentEthOverflowOf(uint256)': 'a32e1e96',
    'decimals()': '313ce567',
    'decimalsForToken(address)': 'b7bad1b1',
    'directory()': 'c41c2f24',
    'distributePayoutsOf(uint256,uint256,uint256,address,uint256,bytes)':
      '4a4305c0',
    'fee()': 'ddca3f43',
    'feeGauge()': 'd6dacc53',
    'heldFeesOf(uint256)': '8af56094',
    'isFeelessAddress(address)': 'b631b500',
    'migrate(uint256,address)': '405b84fa',
    'operatorStore()': 'ad007d63',
    'owner()': '8da5cb5b',
    'pay(uint256,uint256,address,address,uint256,bool,string,bytes)':
      '1ebc263f',
    'payoutSplitsGroup()': '66248b86',
    'prices()': 'd3419bf3',
    'processFees(uint256)': '89701db5',
    'projects()': '8b79543c',
    'redeemTokensOf(address,uint256,uint256,address,uint256,address,string,bytes)':
      'fe663f0f',
    'renounceOwnership()': '715018a6',
    'setFee(uint256)': '69fe0e2d',
    'setFeeGauge(address)': '637913ac',
    'setFeelessAddress(address,bool)': '7258002c',
    'splitsStore()': '2bdfe004',
    'store()': '975057e7',
    'supportsInterface(bytes4)': '01ffc9a7',
    'token()': 'fc0c546a',
    'transferOwnership(address)': 'f2fde38b',
    'useAllowanceOf(uint256,uint256,uint256,address,uint256,address,string,bytes)':
      'a02f801c',
  },
  rawMetadata:
    '{"compiler":{"version":"0.8.17+commit.8df45f5f"},"language":"Solidity","output":{"abi":[{"inputs":[{"internalType":"contract IERC20Metadata","name":"_token","type":"address"},{"internalType":"uint256","name":"_currency","type":"uint256"},{"internalType":"uint256","name":"_baseWeightCurrency","type":"uint256"},{"internalType":"uint256","name":"_payoutSplitsGroup","type":"uint256"},{"internalType":"contract IJBOperatorStore","name":"_operatorStore","type":"address"},{"internalType":"contract IJBProjects","name":"_projects","type":"address"},{"internalType":"contract IJBDirectory","name":"_directory","type":"address"},{"internalType":"contract IJBSplitsStore","name":"_splitsStore","type":"address"},{"internalType":"contract IJBPrices","name":"_prices","type":"address"},{"internalType":"contract IJBSingleTokenPaymentTerminalStore","name":"_store","type":"address"},{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FEE_TOO_HIGH","type":"error"},{"inputs":[],"name":"INADEQUATE_DISTRIBUTION_AMOUNT","type":"error"},{"inputs":[],"name":"INADEQUATE_RECLAIM_AMOUNT","type":"error"},{"inputs":[],"name":"INADEQUATE_TOKEN_COUNT","type":"error"},{"inputs":[],"name":"NO_MSG_VALUE_ALLOWED","type":"error"},{"inputs":[],"name":"PAY_TO_ZERO_ADDRESS","type":"error"},{"inputs":[{"internalType":"uint256","name":"prod1","type":"uint256"},{"internalType":"uint256","name":"denominator","type":"uint256"}],"name":"PRBMath__MulDivOverflow","type":"error"},{"inputs":[],"name":"PROJECT_TERMINAL_MISMATCH","type":"error"},{"inputs":[],"name":"REDEEM_TO_ZERO_ADDRESS","type":"error"},{"inputs":[],"name":"TERMINAL_IN_SPLIT_ZERO_ADDRESS","type":"error"},{"inputs":[],"name":"TERMINAL_TOKENS_INCOMPATIBLE","type":"error"},{"inputs":[],"name":"UNAUTHORIZED","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"refundedFees","type":"uint256"},{"indexed":false,"internalType":"string","name":"memo","type":"string"},{"indexed":false,"internalType":"bytes","name":"metadata","type":"bytes"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"AddToBalance","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IJBPayDelegate","name":"delegate","type":"address"},{"components":[{"internalType":"address","name":"payer","type":"address"},{"internalType":"uint256","name":"projectId","type":"uint256"},{"internalType":"uint256","name":"currentFundingCycleConfiguration","type":"uint256"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"uint256","name":"currency","type":"uint256"}],"internalType":"struct JBTokenAmount","name":"amount","type":"tuple"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"uint256","name":"currency","type":"uint256"}],"internalType":"struct JBTokenAmount","name":"forwardedAmount","type":"tuple"},{"internalType":"uint256","name":"projectTokenCount","type":"uint256"},{"internalType":"address","name":"beneficiary","type":"address"},{"internalType":"bool","name":"preferClaimedTokens","type":"bool"},{"internalType":"string","name":"memo","type":"string"},{"internalType":"bytes","name":"metadata","type":"bytes"}],"indexed":false,"internalType":"struct JBDidPayData","name":"data","type":"tuple"},{"indexed":false,"internalType":"uint256","name":"delegatedAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"DelegateDidPay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IJBRedemptionDelegate","name":"delegate","type":"address"},{"components":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"uint256","name":"projectId","type":"uint256"},{"internalType":"uint256","name":"currentFundingCycleConfiguration","type":"uint256"},{"internalType":"uint256","name":"projectTokenCount","type":"uint256"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"uint256","name":"currency","type":"uint256"}],"internalType":"struct JBTokenAmount","name":"reclaimedAmount","type":"tuple"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"uint256","name":"currency","type":"uint256"}],"internalType":"struct JBTokenAmount","name":"forwardedAmount","type":"tuple"},{"internalType":"address payable","name":"beneficiary","type":"address"},{"internalType":"string","name":"memo","type":"string"},{"internalType":"bytes","name":"metadata","type":"bytes"}],"indexed":false,"internalType":"struct JBDidRedeemData","name":"data","type":"tuple"},{"indexed":false,"internalType":"uint256","name":"delegatedAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"DelegateDidRedeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"fundingCycleConfiguration","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"fundingCycleNumber","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":false,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"distributedAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"beneficiaryDistributionAmount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"metadata","type":"bytes"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"DistributePayouts","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"domain","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"group","type":"uint256"},{"components":[{"internalType":"bool","name":"preferClaimed","type":"bool"},{"internalType":"bool","name":"preferAddToBalance","type":"bool"},{"internalType":"uint256","name":"percent","type":"uint256"},{"internalType":"uint256","name":"projectId","type":"uint256"},{"internalType":"address payable","name":"beneficiary","type":"address"},{"internalType":"uint256","name":"lockedUntil","type":"uint256"},{"internalType":"contract IJBSplitAllocator","name":"allocator","type":"address"}],"indexed":false,"internalType":"struct JBSplit","name":"split","type":"tuple"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"netAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"DistributeToPayoutSplit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"feeProjectId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"reason","type":"bytes"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"FeeReverted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"feeDiscount","type":"uint256"},{"indexed":false,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"HoldFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":true,"internalType":"contract IJBPaymentTerminal","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"Migrate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"fundingCycleConfiguration","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"fundingCycleNumber","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"beneficiaryTokenCount","type":"uint256"},{"indexed":false,"internalType":"string","name":"memo","type":"string"},{"indexed":false,"internalType":"bytes","name":"metadata","type":"bytes"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"Pay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"components":[{"internalType":"bool","name":"preferClaimed","type":"bool"},{"internalType":"bool","name":"preferAddToBalance","type":"bool"},{"internalType":"uint256","name":"percent","type":"uint256"},{"internalType":"uint256","name":"projectId","type":"uint256"},{"internalType":"address payable","name":"beneficiary","type":"address"},{"internalType":"uint256","name":"lockedUntil","type":"uint256"},{"internalType":"contract IJBSplitAllocator","name":"allocator","type":"address"}],"indexed":false,"internalType":"struct JBSplit","name":"split","type":"tuple"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"reason","type":"bytes"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"PayoutReverted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"bool","name":"wasHeld","type":"bool"},{"indexed":false,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"ProcessFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"fundingCycleConfiguration","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"fundingCycleNumber","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":false,"internalType":"address","name":"holder","type":"address"},{"indexed":false,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"reclaimedAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"memo","type":"string"},{"indexed":false,"internalType":"bytes","name":"metadata","type":"bytes"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"RedeemTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"refundedFees","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"leftoverAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"RefundHeldFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"SetFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IJBFeeGauge","name":"feeGauge","type":"address"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"SetFeeGauge","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addrs","type":"address"},{"indexed":true,"internalType":"bool","name":"flag","type":"bool"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"SetFeelessAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"fundingCycleConfiguration","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"fundingCycleNumber","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"projectId","type":"uint256"},{"indexed":false,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"distributedAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"netDistributedamount","type":"uint256"},{"indexed":false,"internalType":"string","name":"memo","type":"string"},{"indexed":false,"internalType":"bytes","name":"metadata","type":"bytes"},{"indexed":false,"internalType":"address","name":"caller","type":"address"}],"name":"UseAllowance","type":"event"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"acceptsToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"string","name":"_memo","type":"string"},{"internalType":"bytes","name":"_metadata","type":"bytes"}],"name":"addToBalanceOf","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"bool","name":"_shouldRefundHeldFees","type":"bool"},{"internalType":"string","name":"_memo","type":"string"},{"internalType":"bytes","name":"_metadata","type":"bytes"}],"name":"addToBalanceOf","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"baseWeightCurrency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"currencyForToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"currentEthOverflowOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"decimalsForToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"directory","outputs":[{"internalType":"contract IJBDirectory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_currency","type":"uint256"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_minReturnedTokens","type":"uint256"},{"internalType":"bytes","name":"_memo","type":"bytes"}],"name":"distributePayoutsOf","outputs":[{"internalType":"uint256","name":"netLeftoverDistributionAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeGauge","outputs":[{"internalType":"contract IJBFeeGauge","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"heldFeesOf","outputs":[{"components":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint32","name":"fee","type":"uint32"},{"internalType":"uint32","name":"feeDiscount","type":"uint32"},{"internalType":"address","name":"beneficiary","type":"address"}],"internalType":"struct JBFee[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isFeelessAddress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"contract IJBPaymentTerminal","name":"_to","type":"address"}],"name":"migrate","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"operatorStore","outputs":[{"internalType":"contract IJBOperatorStore","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_beneficiary","type":"address"},{"internalType":"uint256","name":"_minReturnedTokens","type":"uint256"},{"internalType":"bool","name":"_preferClaimedTokens","type":"bool"},{"internalType":"string","name":"_memo","type":"string"},{"internalType":"bytes","name":"_metadata","type":"bytes"}],"name":"pay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"payoutSplitsGroup","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"prices","outputs":[{"internalType":"contract IJBPrices","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"processFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"projects","outputs":[{"internalType":"contract IJBProjects","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"},{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_tokenCount","type":"uint256"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_minReturnedTokens","type":"uint256"},{"internalType":"address payable","name":"_beneficiary","type":"address"},{"internalType":"string","name":"_memo","type":"string"},{"internalType":"bytes","name":"_metadata","type":"bytes"}],"name":"redeemTokensOf","outputs":[{"internalType":"uint256","name":"reclaimAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IJBFeeGauge","name":"_feeGauge","type":"address"}],"name":"setFeeGauge","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"_flag","type":"bool"}],"name":"setFeelessAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"splitsStore","outputs":[{"internalType":"contract IJBSplitsStore","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"store","outputs":[{"internalType":"contract IJBSingleTokenPaymentTerminalStore","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_currency","type":"uint256"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_minReturnedTokens","type":"uint256"},{"internalType":"address payable","name":"_beneficiary","type":"address"},{"internalType":"string","name":"_memo","type":"string"},{"internalType":"bytes","name":"_metadata","type":"bytes"}],"name":"useAllowanceOf","outputs":[{"internalType":"uint256","name":"netDistributedAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"details":"Inherits from - JBPayoutRedemptionPaymentTerminal: Includes convenience functionality for checking a message sender\'s permissions before executing certain transactions.","kind":"dev","methods":{"acceptsToken(address,uint256)":{"params":{"_projectId":"The project ID to check for token acceptance.","_token":"The token to check if this terminal accepts or not."},"returns":{"_0":"The flag."}},"addToBalanceOf(uint256,uint256,address,bool,string,bytes)":{"params":{"_amount":"The amount of tokens to add, as a fixed point number with the same number of decimals as this terminal. If this is an ETH terminal, this is ignored and msg.value is used instead.","_memo":"A memo to pass along to the emitted event.","_metadata":"Extra data to pass along to the emitted event.","_projectId":"The ID of the project to which the funds received belong.","_shouldRefundHeldFees":"A flag indicating if held fees should be refunded based on the amount being added.","_token":"The token being paid. This terminal ignores this property since it only manages one currency. "}},"addToBalanceOf(uint256,uint256,address,string,bytes)":{"params":{"_amount":"The amount of tokens to add, as a fixed point number with the same number of decimals as this terminal. If this is an ETH terminal, this is ignored and msg.value is used instead.","_memo":"A memo to pass along to the emitted event.","_metadata":"Extra data to pass along to the emitted event.","_projectId":"The ID of the project to which the funds received belong.","_token":"The token being paid. This terminal ignores this property since it only manages one currency. "}},"constructor":{"params":{"_baseWeightCurrency":"The currency to base token issuance on.","_currency":"The currency that this terminal\'s token adheres to for price feeds.","_directory":"A contract storing directories of terminals and controllers for each project.","_operatorStore":"A contract storing operator assignments.","_owner":"The address that will own this contract.","_payoutSplitsGroup":"The group that denotes payout splits from this terminal in the splits store.","_prices":"A contract that exposes price feeds.","_projects":"A contract which mints ERC-721\'s that represent project ownership and transfers.","_splitsStore":"A contract that stores splits for each project.","_store":"A contract that stores the terminal\'s data.","_token":"The token that this terminal manages."}},"currencyForToken(address)":{"params":{"_token":"The token to check for the currency of."},"returns":{"_0":"The currency index."}},"currentEthOverflowOf(uint256)":{"details":"The current overflow is represented as a fixed point number with 18 decimals.","params":{"_projectId":"The ID of the project to get overflow for."},"returns":{"_0":"The current amount of ETH overflow that project has in this terminal, as a fixed point number with 18 decimals."}},"decimalsForToken(address)":{"params":{"_token":"The token to check for the decimals of."},"returns":{"_0":"The number of decimals for the token."}},"distributePayoutsOf(uint256,uint256,uint256,address,uint256,bytes)":{"details":"Payouts are sent to the preprogrammed splits. Any leftover is sent to the project\'s owner.Anyone can distribute payouts on a project\'s behalf. The project can preconfigure a wildcard split that is used to send funds to msg.sender. This can be used to incentivize calling this function.All funds distributed outside of this contract or any feeless terminals incure the protocol fee.","params":{"_amount":"The amount of terminal tokens to distribute, as a fixed point number with same number of decimals as this terminal.","_currency":"The expected currency of the amount being distributed. Must match the project\'s current funding cycle\'s distribution limit currency.","_memo":"Bytes to send along to the emitted event, if provided.","_minReturnedTokens":"The minimum number of terminal tokens that the `_amount` should be valued at in terms of this terminal\'s currency, as a fixed point number with the same number of decimals as this terminal.","_projectId":"The ID of the project having its payouts distributed.","_token":"The token being distributed. This terminal ignores this property since it only manages one token. "},"returns":{"netLeftoverDistributionAmount":"The amount that was sent to the project owner, as a fixed point number with the same amount of decimals as this terminal."}},"heldFeesOf(uint256)":{"params":{"_projectId":"The ID of the project for which fees are being held."},"returns":{"_0":"An array of fees that are being held."}},"migrate(uint256,address)":{"details":"Only a project\'s owner or a designated operator can migrate it.","params":{"_projectId":"The ID of the project being migrated.","_to":"The terminal contract that will gain the project\'s funds."},"returns":{"balance":"The amount of funds that were migrated, as a fixed point number with the same amount of decimals as this terminal."}},"owner()":{"details":"Returns the address of the current owner."},"pay(uint256,uint256,address,address,uint256,bool,string,bytes)":{"params":{"_amount":"The amount of terminal tokens being received, as a fixed point number with the same amount of decimals as this terminal. If this terminal\'s token is ETH, this is ignored and msg.value is used in its place.","_beneficiary":"The address to mint tokens for and pass along to the funding cycle\'s data source and delegate.","_memo":"A memo to pass along to the emitted event, and passed along the the funding cycle\'s data source and delegate.  A data source can alter the memo before emitting in the event and forwarding to the delegate.","_metadata":"Bytes to send along to the data source, delegate, and emitted event, if provided.","_minReturnedTokens":"The minimum number of project tokens expected in return, as a fixed point number with the same amount of decimals as this terminal.","_preferClaimedTokens":"A flag indicating whether the request prefers to mint project tokens into the beneficiaries wallet rather than leaving them unclaimed. This is only possible if the project has an attached token contract. Leaving them unclaimed saves gas.","_projectId":"The ID of the project being paid.","_token":"The token being paid. This terminal ignores this property since it only manages one token. "},"returns":{"_0":"The number of tokens minted for the beneficiary, as a fixed point number with 18 decimals."}},"processFees(uint256)":{"details":"Only a project owner, an operator, or the contract\'s owner can process held fees.","params":{"_projectId":"The ID of the project whos held fees should be processed."}},"redeemTokensOf(address,uint256,uint256,address,uint256,address,string,bytes)":{"details":"Only a token holder or a designated operator can redeem its tokens.","params":{"_beneficiary":"The address to send the terminal tokens to.","_holder":"The account to redeem tokens for.","_memo":"A memo to pass along to the emitted event.","_metadata":"Bytes to send along to the data source, delegate, and emitted event, if provided.","_minReturnedTokens":"The minimum amount of terminal tokens expected in return, as a fixed point number with the same amount of decimals as the terminal.","_projectId":"The ID of the project to which the tokens being redeemed belong.","_token":"The token being reclaimed. This terminal ignores this property since it only manages one token. ","_tokenCount":"The number of project tokens to redeem, as a fixed point number with 18 decimals."},"returns":{"reclaimAmount":"The amount of terminal tokens that the project tokens were redeemed for, as a fixed point number with 18 decimals."}},"renounceOwnership()":{"details":"Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."},"setFee(uint256)":{"details":"Only the owner of this contract can change the fee.","params":{"_fee":"The new fee, out of MAX_FEE."}},"setFeeGauge(address)":{"details":"Only the owner of this contract can change the fee gauge.","params":{"_feeGauge":"The new fee gauge."}},"setFeelessAddress(address,bool)":{"details":"Only the owner of this contract can set addresses as feeless.","params":{"_address":"The address that can be paid towards while still bypassing fees.","_flag":"A flag indicating whether the terminal should be feeless or not."}},"supportsInterface(bytes4)":{"details":" See {IERC165-supportsInterface}.","params":{"_interfaceId":"The ID of the interface to check for adherance to."}},"transferOwnership(address)":{"details":"Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."},"useAllowanceOf(uint256,uint256,uint256,address,uint256,address,string,bytes)":{"details":"Only a project\'s owner or a designated operator can use its allowance.Incurs the protocol fee.","params":{"_amount":"The amount of terminal tokens to use from this project\'s current allowance, as a fixed point number with the same amount of decimals as this terminal.","_beneficiary":"The address to send the funds to.","_currency":"The expected currency of the amount being distributed. Must match the project\'s current funding cycle\'s overflow allowance currency.","_memo":"A memo to pass along to the emitted event.","_metadata":"Bytes to send along to the emitted event, if provided.","_minReturnedTokens":"The minimum number of tokens that the `_amount` should be valued at in terms of this terminal\'s currency, as a fixed point number with 18 decimals.","_projectId":"The ID of the project to use the allowance of.","_token":"The token being distributed. This terminal ignores this property since it only manages one token. "},"returns":{"netDistributedAmount":"The amount of tokens that was distributed to the beneficiary, as a fixed point number with the same amount of decimals as the terminal."}}},"version":1},"userdoc":{"errors":{"PRBMath__MulDivOverflow(uint256,uint256)":[{"notice":"Emitted when the result overflows uint256."}]},"kind":"user","methods":{"acceptsToken(address,uint256)":{"notice":"A flag indicating if this terminal accepts the specified token."},"addToBalanceOf(uint256,uint256,address,bool,string,bytes)":{"notice":"Receives funds belonging to the specified project."},"addToBalanceOf(uint256,uint256,address,string,bytes)":{"notice":"Receives funds belonging to the specified project."},"baseWeightCurrency()":{"notice":"The currency to base token issuance on."},"currency()":{"notice":"The currency to use when resolving price feeds for this terminal."},"currencyForToken(address)":{"notice":"The currency that should be used for the specified token."},"currentEthOverflowOf(uint256)":{"notice":"Gets the current overflowed amount in this terminal for a specified project, in terms of ETH."},"decimals()":{"notice":"The number of decimals the token fixed point amounts are expected to have."},"decimalsForToken(address)":{"notice":"The decimals that should be used in fixed number accounting for the specified token."},"directory()":{"notice":"The directory of terminals and controllers for projects."},"distributePayoutsOf(uint256,uint256,uint256,address,uint256,bytes)":{"notice":"Distributes payouts for a project with the distribution limit of its current funding cycle."},"fee()":{"notice":"The platform fee percent."},"feeGauge()":{"notice":"The data source that returns a discount to apply to a project\'s fee."},"heldFeesOf(uint256)":{"notice":"The fees that are currently being held to be processed later for each project."},"isFeelessAddress(address)":{"notice":"Addresses that can be paid towards from this terminal without incurring a fee."},"migrate(uint256,address)":{"notice":"Allows a project owner to migrate its funds and operations to a new terminal that accepts the same token type."},"operatorStore()":{"notice":" A contract storing operator assignments."},"pay(uint256,uint256,address,address,uint256,bool,string,bytes)":{"notice":"Contribute tokens to a project."},"payoutSplitsGroup()":{"notice":"The group that payout splits coming from this terminal are identified by."},"prices()":{"notice":"The contract that exposes price feeds."},"processFees(uint256)":{"notice":"Process any fees that are being held for the project."},"projects()":{"notice":"Mints ERC-721\'s that represent project ownership and transfers."},"redeemTokensOf(address,uint256,uint256,address,uint256,address,string,bytes)":{"notice":"Holders can redeem their tokens to claim the project\'s overflowed tokens, or to trigger rules determined by the project\'s current funding cycle\'s data source."},"setFee(uint256)":{"notice":"Allows the fee to be updated."},"setFeeGauge(address)":{"notice":"Allows the fee gauge to be updated."},"setFeelessAddress(address,bool)":{"notice":"Sets whether projects operating on this terminal can pay towards the specified address without incurring a fee."},"splitsStore()":{"notice":"The contract that stores splits for each project."},"store()":{"notice":"The contract that stores and manages the terminal\'s data."},"supportsInterface(bytes4)":{"notice":"Indicates if this contract adheres to the specified interface."},"token()":{"notice":"The token that this terminal accepts."},"useAllowanceOf(uint256,uint256,uint256,address,uint256,address,string,bytes)":{"notice":"Allows a project to send funds from its overflow up to the preconfigured allowance."}},"notice":" Manages the inflows and outflows of an ERC-20 token.","version":1}},"settings":{"compilationTarget":{"lib/juice-contracts-v3/contracts/JBERC20PaymentTerminal3_1.sol":"JBERC20PaymentTerminal3_1"},"evmVersion":"london","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":10000},"remappings":[":@chainlink/=lib/juice-contracts-v3/lib/chainlink/",":@jbx-protocol/juice-contracts-v3/=lib/juice-contracts-v3/",":@juicebox/=lib/juice-contracts-v3/contracts/",":@openzeppelin-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/",":@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",":@paulrberg/contracts/math/=lib/juice-contracts-v3/lib/prb-math/contracts/",":@prb/math/=lib/prb-math/",":chainlink/=lib/juice-contracts-v3/lib/chainlink/",":create3-factory/=lib/create3-factory/src/",":ds-test/=lib/forge-std/lib/ds-test/src/",":erc4626-tests/=lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/",":forge-std/=lib/forge-std/src/",":juice-contracts-v3/=lib/juice-contracts-v3/",":openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/",":openzeppelin-contracts/=lib/openzeppelin-contracts/",":openzeppelin-contracts/contracts/=lib/juice-contracts-v3/lib/openzeppelin-contracts/contracts/",":prb-contracts/=lib/prb-contracts/contracts/",":prb-math/=lib/prb-math/contracts/",":solmate/=lib/solmate/src/"]},"sources":{"lib/juice-contracts-v3/contracts/JBERC20PaymentTerminal3_1.sol":{"keccak256":"0x4b546b1acce658108c7ba17b169482deb94f2ed113d0e8b1812b87dbfe538b19","license":"MIT","urls":["bzz-raw://a4b088e5e211cd917c3280e1da4a89d3bf3f7f863e6c9b8d89d1d589290117ce","dweb:/ipfs/QmcyQeRGJAimcngmae2dgwHrg6K1uDwXG2WvBK3iij1xcV"]},"lib/juice-contracts-v3/contracts/abstract/JBOperatable.sol":{"keccak256":"0x9e62cac5c464eb973f881cf6c373b95aab31d2ddbeb048ee7ad82b5c9ab28add","license":"MIT","urls":["bzz-raw://3b76b81bf5076219f1babbebcf993ecb1fc04ee547e3c82a8c74bfa761c8a735","dweb:/ipfs/QmbpQintWGTJvQyqoe4fdWFF22mBxb2hSomwbbuJ73CQpi"]},"lib/juice-contracts-v3/contracts/abstract/JBPayoutRedemptionPaymentTerminal3_1.sol":{"keccak256":"0x07d2efd06320f86c30ed24409d824210353dbf8ffcfe3997272729a709c6360d","license":"MIT","urls":["bzz-raw://d1e8cf4020e83142bae8ecf4c73fbb04163f4c4e8f6761b3a7efa9ec8f51d7c4","dweb:/ipfs/QmSPywTeomiReNHTAzb72Dk2bTQHgKM6fE2SSgYCcuKXpD"]},"lib/juice-contracts-v3/contracts/abstract/JBSingleTokenPaymentTerminal.sol":{"keccak256":"0xdc82ad3e01b918d3d21ffea8c9f30950d81e225137c851599d028dcd22125f89","license":"MIT","urls":["bzz-raw://adfab423d72c9742feec01bca482cedc2648072a1fb49fad5d328890fdfeb119","dweb:/ipfs/QmTrPfWjuBLjEojY2wKtUNrpY9gcw5fea2mK8JEE2MK1WP"]},"lib/juice-contracts-v3/contracts/enums/JBBallotState.sol":{"keccak256":"0x891fcac63470398b3a11239da7feba6b07d640809fcefd2404303b823d7378f8","license":"MIT","urls":["bzz-raw://6e6adfceaf284b669a8c1cbcf2da7f18ab31a2d1066f9db8bc914349e7401de7","dweb:/ipfs/QmXLHVRPPZdXUkgAHQbHUtEzAvCJk1P6rJ7wrwfTcfW6fw"]},"lib/juice-contracts-v3/contracts/interfaces/IJBAllowanceTerminal3_1.sol":{"keccak256":"0x4e1ef83fc258e44f7880005b7944e3b4799d87129b2300236d93269a00adb4ee","license":"MIT","urls":["bzz-raw://c546650f7acb683e60d389f28c0b1ff91db2dd6d318631fae9839ee7f60f2b14","dweb:/ipfs/QmNRxz2dw74vyuPN2QfPtTvKzXmGfsJf96XaYQnMLTNSzS"]},"lib/juice-contracts-v3/contracts/interfaces/IJBController.sol":{"keccak256":"0xb1ee4b41f2a06f28f69c74cb729b8964f2e75f3c545a68f85bd9082b5575bc85","license":"MIT","urls":["bzz-raw://160aef4e645dde9524564b2bd302e7c766bdf1f67c4fa58516ed59d1dbb7c2a6","dweb:/ipfs/QmaTpyWKi4itYaaxTKU6JUarJHRmxCMP65cp2NJ6ejJDZW"]},"lib/juice-contracts-v3/contracts/interfaces/IJBDirectory.sol":{"keccak256":"0x715321646db00514d1355ed43c40cd3f01e94959552fd07797b315d9c49cdb1d","license":"MIT","urls":["bzz-raw://c34c9e1c727ffc63dd42fb6e6ffb3116c8ba15d6a322a300f10f29478974768d","dweb:/ipfs/QmYToaGrbMyyWAuyepYcDd8M6KcmosY8AWhT3uJmPM6Pvy"]},"lib/juice-contracts-v3/contracts/interfaces/IJBFeeGauge.sol":{"keccak256":"0x8e19959617191320fe1210760860e668a57319258c0c74fcfabac829ae0222c0","license":"MIT","urls":["bzz-raw://3dd8a4e26f3abc19f1b0580b02d894bd91d31f8d72d8ee1be529ecd6dc638723","dweb:/ipfs/QmUxSM2ePxorxRNFxpxqDnRmGtQrwVMiezQsbxLCCkLL5x"]},"lib/juice-contracts-v3/contracts/interfaces/IJBFeeHoldingTerminal.sol":{"keccak256":"0x8c9edae0768a737097835b8b9ef4a60f000de122a867c90f20cfc653287541a4","license":"MIT","urls":["bzz-raw://ac13a8ac78151d7aa94578f77ce680271d73c4178bcc309b325554a499f58bce","dweb:/ipfs/QmRJHmKRyV4Ecu7XJF36BkfCmyjEvFit3m8k8fzeVCKgww"]},"lib/juice-contracts-v3/contracts/interfaces/IJBFundingCycleBallot.sol":{"keccak256":"0x49553a56209237846bc400cf27f260824a6bd06fd8094a7eb5abb9de75779598","license":"MIT","urls":["bzz-raw://559372746f94f28b385bc336df263f583dca5377350645c0b28110b083bdb41a","dweb:/ipfs/QmeQRYqPjXBQCtMKXSFtHVD2ewEPoUAPDxLh4oWTRSKbmx"]},"lib/juice-contracts-v3/contracts/interfaces/IJBFundingCycleStore.sol":{"keccak256":"0xaead823851433be0c2ddc8f8086813e6cd647de3a1bc0f7570a5d6b38c378b5a","license":"MIT","urls":["bzz-raw://7f11fd52ba9ef67b40811d8a2298ae8b69447d2565b3f1069cbb8f0f13bc65e7","dweb:/ipfs/QmVbBzpTxZWar9xvj6x1vW91hJDv2iPVq7aG6waMxaHUPQ"]},"lib/juice-contracts-v3/contracts/interfaces/IJBMigratable.sol":{"keccak256":"0xc81053e4b4754fc510aa04fecd3ab1460f01e3e27761e7a8c94f631a978ae127","license":"MIT","urls":["bzz-raw://4c57ab7d0c0e6d9be798055d68b6f253421458b3beb38d0a3596da104000ca9e","dweb:/ipfs/QmXn1CaffHoP2s43vkUszihdNk1TdfAxejngfdk2VmBVFU"]},"lib/juice-contracts-v3/contracts/interfaces/IJBOperatable.sol":{"keccak256":"0x09a55a91c6ce3625379334271d236cfa47bf36522a91568b406bf06f7239407e","license":"MIT","urls":["bzz-raw://c4e0058ff862925a9070f88bec5c53e8aaa5d3ac75952285b1e7ca67ecbe1d3b","dweb:/ipfs/QmVowtkRjGePcpaGjivvFyWTjQBGCtJQqoXFtxX6qhkx56"]},"lib/juice-contracts-v3/contracts/interfaces/IJBOperatorStore.sol":{"keccak256":"0x17f4929812a356984795fafed8cb2be816a025c9a0771d85595ac0b5ff3cffc5","license":"MIT","urls":["bzz-raw://4379909df832d51d25ac6f863c12e5271c96f01c4fd399eaeb16be3db8786e4c","dweb:/ipfs/QmTeGMNaf3KPT2A54sQ6HoZiBwfGRNqMZtvvci4oAN4z2s"]},"lib/juice-contracts-v3/contracts/interfaces/IJBPayDelegate.sol":{"keccak256":"0xa797de18b69eceba117e1f0b3810cf3cc2d2791417d580a5bdc510d1b868ab26","license":"MIT","urls":["bzz-raw://36b214c091c62c54d22cbedb606c29919cb56f1c29acf9c397c948247a29dcc0","dweb:/ipfs/QmSzxHs8xNFqNfxZb1igvPHk7vXA5vUsGQ6AMfJ8jx8Ktu"]},"lib/juice-contracts-v3/contracts/interfaces/IJBPaymentTerminal.sol":{"keccak256":"0xb7826f5ed609359ce322c09e83236c47ba385df1c3cad3607e56fd0a2e00eee2","license":"MIT","urls":["bzz-raw://cbb0de0e73f73a04fcfc8f08cab3588b6d608cf5268af737cff6a530f6062c95","dweb:/ipfs/QmPGb8aEbZNHNnrCvuGH52RLvV3kjL3agxQiFrjHoLHaup"]},"lib/juice-contracts-v3/contracts/interfaces/IJBPayoutRedemptionPaymentTerminal3_1.sol":{"keccak256":"0xe823526fd535dc962784820cac32e6fdd56f2a5020dbf9883979b9ddfcc093fa","license":"MIT","urls":["bzz-raw://b20151c2627edb72b444aefac48e9eddaed6716affe1c0f9972d0dea1efc67a3","dweb:/ipfs/QmZa3RPUNjj7KiMcP2feA2JEetZ63foc8ugGF9m1TkW65R"]},"lib/juice-contracts-v3/contracts/interfaces/IJBPayoutTerminal3_1.sol":{"keccak256":"0x415707a4902f90945ecee641e96dd88c733b1d159c35c1184e665ca3509ffe49","license":"MIT","urls":["bzz-raw://2f04cc83ec787668b868903822d8837291b7e5eae9587af2bf3044551cb85f57","dweb:/ipfs/QmbRR8JBB1uFK75QybqXEnUhiM8HXVo8Jq9ojGBvxLzVGj"]},"lib/juice-contracts-v3/contracts/interfaces/IJBPriceFeed.sol":{"keccak256":"0x57c71282fec1b34b00cf991ffed2e36031c393e35bfa7ca5d723eb6572fb7122","license":"MIT","urls":["bzz-raw://f51c97ac194d3120a2fb5428eeeff759b75b7cbc5708465afc914619016a7c9b","dweb:/ipfs/QmemTqsGqoPqG97EsdRTMAbB6RfCz8CJxGYPNnDTV6LJ2t"]},"lib/juice-contracts-v3/contracts/interfaces/IJBPrices.sol":{"keccak256":"0x82a175b1f4b95b506c98406576cd59cbe04615e3df24f9cf3587b61b8ee323b1","license":"MIT","urls":["bzz-raw://5493e394cf47fca51a4091f1e6d285cc9e4ff9916e5bdfb8e174fe652a2b9833","dweb:/ipfs/QmTXafZatcjYbNMpUYYk1AWNZLkRFK7VVdAYYudGf4z3HJ"]},"lib/juice-contracts-v3/contracts/interfaces/IJBProjects.sol":{"keccak256":"0x7cfc021d0bd7e73b1ba8f4845d7d35e3419d6a14d3d25ca3a8010e7f91062fe4","license":"MIT","urls":["bzz-raw://ff265e13e60da56b93104260ed69ab01153437ec2af9d453781f22ca295eaef9","dweb:/ipfs/QmfGCSLX2Wy26ojf4U12udsdtjSSacbLcZGwCjTw7MjWF8"]},"lib/juice-contracts-v3/contracts/interfaces/IJBRedemptionDelegate.sol":{"keccak256":"0x172d2c0be65e72e54f71ae521907067f0fa30e8ca05c4f88826903208aa437e2","license":"MIT","urls":["bzz-raw://266a32bd8feea10051a4e243e14692c62e99de7048cda2f541998b4cc64cbd51","dweb:/ipfs/QmPfqsbSZdpQee4WbisK9ZnZRrXbUVvSpbfnrEKGfjzz9N"]},"lib/juice-contracts-v3/contracts/interfaces/IJBRedemptionTerminal.sol":{"keccak256":"0xe26a6a03468401b802ae5328b39a266f53b9331a1c077fcbf7719d10ba74ff44","license":"MIT","urls":["bzz-raw://dae771e2abe46134bb23e5eebc30ebebb09a0677a8827f89a51e84902176cfb8","dweb:/ipfs/QmRqF3cdeB46PfYb6bGeFKQetjBJHaJHGV47kTbtMMsoEp"]},"lib/juice-contracts-v3/contracts/interfaces/IJBSingleTokenPaymentTerminal.sol":{"keccak256":"0xf6e78323caa9af7bbf024f44b2032a83fed0394e0b3a242a6346e73c85b2e46f","license":"MIT","urls":["bzz-raw://63c9f3f0db323bd5492c76da3ae2bae7895e287a824729d125bfb650121d576c","dweb:/ipfs/QmPWohiNJvv6JtH8yAtqomiwVheEvKXY4SfHjL98vd2mQY"]},"lib/juice-contracts-v3/contracts/interfaces/IJBSingleTokenPaymentTerminalStore.sol":{"keccak256":"0xd78929c9371fd7895b829ef5e4ad4b3786523c3580ac3f6f5f25d2b5941c0dd3","license":"MIT","urls":["bzz-raw://1b6afe1de26dec89d7f9b456586ae83e4f51e967ed65c44d809d33a298cd183c","dweb:/ipfs/QmavNYeXKJQyuQQLQuCgAL9GWsKvhd6wKgivtZjhXePSaN"]},"lib/juice-contracts-v3/contracts/interfaces/IJBSplitAllocator.sol":{"keccak256":"0x5efb6f51fc161f42ff58989386ad99028e4039a0ba897d66f358c3dfcf686105","license":"MIT","urls":["bzz-raw://171df7cf5285170894d7d7d00ecb14271204b55d330fa65e1bf9ebfb21741c29","dweb:/ipfs/QmXBmzjVVgGd1hZoStw2qoypJnqyWgYeMXMLyYS7f6Zonu"]},"lib/juice-contracts-v3/contracts/interfaces/IJBSplitsStore.sol":{"keccak256":"0x66dab3dd394e318b850401ca92c2963b906cc0ad5562fa5d4f6f850175d1c77a","license":"MIT","urls":["bzz-raw://948dae4e7eddc75f32fe75b25f97a7bad0e7b335a8a5a8dfd81b532dd325dd27","dweb:/ipfs/QmZY1s7r85NWVdqhmUE71Pkuo7CPk8SMgAwUrj8bLpTaWC"]},"lib/juice-contracts-v3/contracts/interfaces/IJBToken.sol":{"keccak256":"0xe8969210417736c85d71101bf1c0bd8ebbf9d1e62a93e758148bd5709a6c7097","license":"MIT","urls":["bzz-raw://214c67c2ebeabd1b412ac9b0b6de4c02765c8311a3dc258568a2aa7322d58fb7","dweb:/ipfs/QmeEbk8YWRVtMpxWQGfYbMrgYc2qsPhQF5jpufK26RrCXY"]},"lib/juice-contracts-v3/contracts/interfaces/IJBTokenStore.sol":{"keccak256":"0x98459e3af050d41dfeffdc97f1c93330207ba450f8ff3613224b49a89eeca9c6","license":"MIT","urls":["bzz-raw://0e98bda797088b1bb2a756eaed911ab12b092ffdad5467e82650bfa9bf8dd046","dweb:/ipfs/QmbuKq4xSC8LL62smwrHWCWKiWawEu8Ne2n7q8DhKHKvtD"]},"lib/juice-contracts-v3/contracts/interfaces/IJBTokenUriResolver.sol":{"keccak256":"0xd267fd8ca7c21c2c71794acdb9a98314c33a35fc559e0bf0897a6686d196d174","license":"MIT","urls":["bzz-raw://aa7053d4300ed1374f3f993e6e2163d0a05ee780e4e99eb007b55eabc93c724e","dweb:/ipfs/QmYZAUn7VCwqpDWYZNCXLNYMRQpD334YgPRiGCfxQApzuT"]},"lib/juice-contracts-v3/contracts/libraries/JBConstants.sol":{"keccak256":"0x34362846a1cd428a8bdedf4ab6857e11402f345cb87b994b2e7fb6d2474b808d","license":"MIT","urls":["bzz-raw://80b423d29251e6d6cc6bd24b89474628ebcd588fbf485da714134e449e002264","dweb:/ipfs/QmVBKR4eLMfJRHJLxEJJJQiYEgkoXK6kK6HyFy7mQ9Wx6d"]},"lib/juice-contracts-v3/contracts/libraries/JBCurrencies.sol":{"keccak256":"0x7e417ff25c173608ee4fe6d9fc3dcd5e1458c78c889af12bac47b1189a436076","license":"MIT","urls":["bzz-raw://92a96ba0dfa74f968db8d5f367c92a8c7e616c70cafab3b6d7f049e43b501e84","dweb:/ipfs/QmdJHS7yVcXjTzN82LjNZp77uzYZPL3951NWit4i36pN7Q"]},"lib/juice-contracts-v3/contracts/libraries/JBFixedPointNumber.sol":{"keccak256":"0x18efac48269f3a3bd7e9a1c770776f950e0afa86769e6f8b128002c3b8c6742c","license":"MIT","urls":["bzz-raw://35470671def0cc37ae881b4309ecc9de8dd55b45f2d94424992f81756cbccd9b","dweb:/ipfs/Qmf4D16xrCwtvDhHAtjs5U6H7kpXhiMVSp1gaVv5rQ7yNX"]},"lib/juice-contracts-v3/contracts/libraries/JBFundingCycleMetadataResolver.sol":{"keccak256":"0x3d045c38593102cfb6ac67f3ddf2232e1ff5518d6d021423ae2681387599fbd3","license":"MIT","urls":["bzz-raw://a3ed08bbad9868881b87258ecb34b6b5a4fe83e321e5f59c66a758180077135e","dweb:/ipfs/QmbVDpmk4VvunFqpkmsEqX8VomEbsXpRebv841dHRBpy63"]},"lib/juice-contracts-v3/contracts/libraries/JBGlobalFundingCycleMetadataResolver.sol":{"keccak256":"0x0d998f938026edeb755987a79421267cf860801161b5f171206a200b60f1061f","license":"MIT","urls":["bzz-raw://d2ff895bbf2f18fe6538abe53966acd8ea128795283209bb8402ac72ddd529b1","dweb:/ipfs/QmZgU8rokY5sBQ2guFmPotGh4e8ReNHAyZzRhZXrN9a8EP"]},"lib/juice-contracts-v3/contracts/libraries/JBOperations.sol":{"keccak256":"0x7f8e501e6890297f4015b1c27cebdb44fadbf21204bea1f3162f5388c060f690","license":"MIT","urls":["bzz-raw://6827d04b543d9579e910703ffe4b97293cad258faab20c52dfb17b905a4b5e9a","dweb:/ipfs/QmUW4NQdubMEd71uAdo7VkDXgTdvmiV9CAMSjk9ozQBfz9"]},"lib/juice-contracts-v3/contracts/libraries/JBTokens.sol":{"keccak256":"0xecf82992f7b827766aa55f16872517a646521eef414d8cc9786617ea377e5463","license":"MIT","urls":["bzz-raw://4bb334faa6d2d071473bfcd7efeb5bfa068c340600c204651d59a94be4e4b147","dweb:/ipfs/QmaKgSCvDNgQ6dh2gZfQ9VhkPuRCoACv8e7sd1K9VFikix"]},"lib/juice-contracts-v3/contracts/structs/JBDidPayData.sol":{"keccak256":"0xf3c664309b37790f16047ae97b0459889ae0242dfcde7fc8902c8d10c7f8e6b6","license":"MIT","urls":["bzz-raw://ea74b762604ffa0e45181d8ec31b130198546014f6360d15076af79952bc5874","dweb:/ipfs/QmdukMbucvU75BpK4TsYKoqjpQ2Nhs9yjFVzcKGkG3SpSV"]},"lib/juice-contracts-v3/contracts/structs/JBDidRedeemData.sol":{"keccak256":"0xe2c401f39723a7ce915b8bef328744c66daaf57460843964b941456c2258a412","license":"MIT","urls":["bzz-raw://c3bddd802ff895aa54f047d2385c7c253f9e0cd5b23d4d84439c1590e7e66ccb","dweb:/ipfs/QmXdSDWgEWMtJDqMhHrBCZnBM4qETXRPteB1wEGZBRxuUb"]},"lib/juice-contracts-v3/contracts/structs/JBFee.sol":{"keccak256":"0xf4759ff41fe7f1db0fd1ccc7b2a326b239389fd8d69df9b9ed5e1d5926f6fe38","license":"MIT","urls":["bzz-raw://55796903c879372a459a0eddfa333bc903d6cedb66125787d13ef7eea5c53cc6","dweb:/ipfs/QmZNsajvSxGc6859Jy2ZC6Dk6oy66Y9if9ETcpFa2xZkHP"]},"lib/juice-contracts-v3/contracts/structs/JBFundAccessConstraints.sol":{"keccak256":"0x85ebaa57b788cbdedc7a3d0eec4892eda5d79db7c1a6103797f10d0d989775b2","license":"MIT","urls":["bzz-raw://1a911a9d1d0a6f0e475854838877d2d3ae606028381c2aef7fac192a33e3d329","dweb:/ipfs/QmTih57fwyaXdjvXCrG9BbdayD6H2AHQrYkuL4v4rYhMyF"]},"lib/juice-contracts-v3/contracts/structs/JBFundingCycle.sol":{"keccak256":"0xcdd3ac9b6fa67e62ada88d09b73bc35ade1cd77d43db712289266a788928b4c2","license":"MIT","urls":["bzz-raw://8ba0be407022bbeb0e9272884653209ee262b8a4e00ffbba1298c3b119feccba","dweb:/ipfs/QmbtLQzSN3hut4jYVsYPiYDfRkDdGkZmTWBnV2wJKrdM3K"]},"lib/juice-contracts-v3/contracts/structs/JBFundingCycleData.sol":{"keccak256":"0x2aa6368bf4dfc5797e8b02a978293de0c777fae2658de2c825a103587240f3b0","license":"MIT","urls":["bzz-raw://2d7a980ab9b67ad1569d4407b747903cab668a332214117f5ad44feb50af0a3a","dweb:/ipfs/QmSuEzmrmDSihrTKYCk8miq7VQi7WD6jmQePkjDyzt7UpC"]},"lib/juice-contracts-v3/contracts/structs/JBFundingCycleMetadata.sol":{"keccak256":"0x783604440cac8d176332eab28166f188ee5c230378c08cfc95fea4f7187dc77d","license":"MIT","urls":["bzz-raw://81409f9675aabd5ece88efbf08d1acb5581c2aac5b6394824f575f5f2edb5788","dweb:/ipfs/QmPWdUztAEssCEnuFFkj74kNFEfVUxbNFmD5GmVB2Qvj1h"]},"lib/juice-contracts-v3/contracts/structs/JBGlobalFundingCycleMetadata.sol":{"keccak256":"0x05d85530305fec6d6eca54cdbc2cd9110cbda0146598032b0203aa4b622944ff","license":"MIT","urls":["bzz-raw://ec56eff6784c7b60ebc3098037573d8ece138794a9a58ebe8412e75927e984cd","dweb:/ipfs/QmdkEeE6JDyCiV3YBKf7h3FymEHCAHHAtBokUkJwFWVPSf"]},"lib/juice-contracts-v3/contracts/structs/JBGroupedSplits.sol":{"keccak256":"0x80be1b220da4ac04851ea540ebb94c1ec2b0442ec5bd1e88fdf78a56becd8b5a","license":"MIT","urls":["bzz-raw://b73e5da7d38bfadd565c202aa1a5a6c08a51542699e8e3683b8888009bc62563","dweb:/ipfs/QmUNTy4XVvfAMqP7wCjj84deTvCehkBL1diZoWkyMCVsPw"]},"lib/juice-contracts-v3/contracts/structs/JBOperatorData.sol":{"keccak256":"0x3b85be7b69515976ee10770776283911666aceca820b0cf4e201ea4dbffeb6f0","license":"MIT","urls":["bzz-raw://1a18afb385759e5440c645f2a5c581e42a7ac357c73c376fb34dbb5d5fd8f9af","dweb:/ipfs/QmZziN5ixwUXpk185YrcneBEVq91gVqYoBD7MrbvTTpALP"]},"lib/juice-contracts-v3/contracts/structs/JBPayDelegateAllocation.sol":{"keccak256":"0xb4e558dc62231d89e9b48998012577d22c3e52b58e23401f22d9096827f6ea0c","license":"MIT","urls":["bzz-raw://b6617a7479709d2a68fbc6686c9087fd7339ffcbb4823010287eb2ad979f23dd","dweb:/ipfs/QmVT66SXpY9h5sD8nJq7VALbfWdeHwUxAeBPymaHg1TMNM"]},"lib/juice-contracts-v3/contracts/structs/JBProjectMetadata.sol":{"keccak256":"0x90ad7b1014c0a9f945fe7a2efde9d5de41e40574fa27969070b1d2ff52033ea0","license":"MIT","urls":["bzz-raw://1fafc65a9fd74605b7d6c6f0a92b3237a8e3efdd160affb8c117bad00dcf9494","dweb:/ipfs/QmQkcVt11WLqrxHVrcDCF6dNxzg2kKHEghAgSbfLF6CHkt"]},"lib/juice-contracts-v3/contracts/structs/JBRedemptionDelegateAllocation.sol":{"keccak256":"0x10c29d33dd0d875a0d4692a2b9a9355c2ebf433cc06a9a60253d4366b60d4d31","license":"MIT","urls":["bzz-raw://76614755cf61b78b3d3263ddcbf7c7146986374e4cdf5cc2abb67c523d957142","dweb:/ipfs/QmVNGDmTCcfYxgbA83yURstmAU7vtAtjTh9zNFRwKMmTH1"]},"lib/juice-contracts-v3/contracts/structs/JBSplit.sol":{"keccak256":"0xc80a16606da8abf76d0f73abc38aee041e24f29342c1939018f70c286e89f105","license":"MIT","urls":["bzz-raw://d257df1f322904fdbf34a0d28880cc96a1ba3905d19488d83156a7d3476d820f","dweb:/ipfs/QmP6WFuoK6ePEQ2zxRnpu1kWDdFSUTGaEV57eZ4gs9FqC8"]},"lib/juice-contracts-v3/contracts/structs/JBSplitAllocationData.sol":{"keccak256":"0x39f5c41bd31d36774744698ac94484b6cab62d7038df2f29d947668959782e63","license":"MIT","urls":["bzz-raw://cf81d025aa0f6f93bdcd0b863730f7c574de7c3c4a595ba88e342f46c4b724e4","dweb:/ipfs/QmaQ1frbYciPVV1Qmsfmgts9fgbXKZLQ8jGf9XRikHSmci"]},"lib/juice-contracts-v3/contracts/structs/JBTokenAmount.sol":{"keccak256":"0x4a778e779ba257ba5638c5469e07a4d21b55a3128d56db5a0fdfacb1f3301c51","license":"MIT","urls":["bzz-raw://fdb8302e06c5b4e1e91d204ed735d8d5db5bb3648200c144d7c545678010a44d","dweb:/ipfs/QmTpffbt3FShkk8LDjsonVGnecbbNMUL8QHYQM7AFcMa54"]},"lib/juice-contracts-v3/lib/prb-math/contracts/PRBMath.sol":{"keccak256":"0xe981069ba1d98749de50dec3983d023a996575d2e7e983f9eb4a33601f655766","license":"Unlicense","urls":["bzz-raw://2804382c50036b38925399624a1a271b50f77ac5476d93fa703266bb60e70de8","dweb:/ipfs/QmXbw6xZc3tBt8MEwSymL9H842xPcnHVu9pwNzf5wAgCoH"]},"lib/openzeppelin-contracts/contracts/access/Ownable.sol":{"keccak256":"0x923b9774b81c1abfb992262ae7763b6e6de77b077a7180d53c6ebb7b1c8bd648","license":"MIT","urls":["bzz-raw://53445dc0431f9b45c06f567c6091da961d4087bec0010cca5bd62100fa624a38","dweb:/ipfs/QmNvBYpBv183czrAqNXr76E8M3LF93ouAJFeAcHfb59Rcx"]},"lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol":{"keccak256":"0x00c839ff53d07d19db2e7cfa1e5133f9ee90a8d64b0e2e57f50446a2d1a3a0e0","license":"MIT","urls":["bzz-raw://3dac621d015a68a5251b1e5d41dda0faf252699bf6e8bcf46a958b29964d9dd1","dweb:/ipfs/QmP9axjgZv4cezAhALoTemM62sdLtMDJ9MGTxECnNwHgSJ"]},"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol":{"keccak256":"0x8de418a5503946cabe331f35fe242d3201a73f67f77aaeb7110acb1f30423aca","license":"MIT","urls":["bzz-raw://5a376d3dda2cb70536c0a45c208b29b34ac560c4cb4f513a42079f96ba47d2dd","dweb:/ipfs/QmZQg6gn1sUpM8wHzwNvSnihumUCAhxD119MpXeKp8B9s8"]},"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol":{"keccak256":"0x35e258421ae206f3db37281cea70871b4c3553914734aa76139a41af60ac1abb","license":"MIT","urls":["bzz-raw://2ef94b6bc4ee356db612a1849c615f7dd4b15542d6c8584c86bb9243a7913cf0","dweb:/ipfs/QmaxFj5NFpAjjitZtHPNS9PPtCuBATaRz9ktDDRCQCQ83y"]},"lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol":{"keccak256":"0x8a63ea9ec07788740e51046ca14c61f411aedb901e89749c9d55fa56ed43086a","license":"MIT","urls":["bzz-raw://3035ae3f172ed9e172e1ba4d83bdc70279f63be51ce9218c530132def66ff577","dweb:/ipfs/QmTQ3zfC3YUNeY3KUVFiHgTWDuxfmcEMgpGC6HMoTpgZJL"]},"lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol":{"keccak256":"0x41bbb2c41036ca64b2f6c9e973e8cfaa113ebc42af86702cd0d267f915a7e886","license":"MIT","urls":["bzz-raw://6bf6699c55e82c7af6ae90b61ea9643ca0c905097da9a31269319f1b5a2a696a","dweb:/ipfs/QmRJZa2UmWcRo6W8JnuomwzfjVtAS21QC8HKggxBhoPsU4"]},"lib/openzeppelin-contracts/contracts/utils/Address.sol":{"keccak256":"0x2e53602b96c1bf97c731ed3e2a981b4f85e23a9410a5ebd36e549a4cc93340dc","license":"MIT","urls":["bzz-raw://523f47b3ecc6d4e47b4b998d3356199988eef8a42a10dff5a3660d5f9e76cc71","dweb:/ipfs/QmRLH8CNvDsuLzNCjsbpLM3RHD9he5ESXroYoDT3tpaTCA"]},"lib/openzeppelin-contracts/contracts/utils/Context.sol":{"keccak256":"0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7","license":"MIT","urls":["bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92","dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3"]},"lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol":{"keccak256":"0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b","license":"MIT","urls":["bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d","dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43"]},"lib/openzeppelin-contracts/contracts/utils/introspection/ERC165Checker.sol":{"keccak256":"0x269bb6068217c8049d795491e9cf287abddc005628084a18fcd5ceee7b0f1233","license":"MIT","urls":["bzz-raw://f490653e8697ce9d1d86807c3013ff6ed40d5c8a89c3b1f84c615266340dee7d","dweb:/ipfs/QmSGUziQzsbYQxXjajud9hXLWjGzRgzUVC1Z4DRL5WMmQR"]},"lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol":{"keccak256":"0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1","license":"MIT","urls":["bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f","dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy"]}},"version":1}',
  metadata: {
    compiler: {
      version: '0.8.17+commit.8df45f5f',
    },
    language: 'Solidity',
    output: {
      abi: [
        {
          inputs: [
            {
              internalType: 'contract IERC20Metadata',
              name: '_token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_currency',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_baseWeightCurrency',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_payoutSplitsGroup',
              type: 'uint256',
            },
            {
              internalType: 'contract IJBOperatorStore',
              name: '_operatorStore',
              type: 'address',
            },
            {
              internalType: 'contract IJBProjects',
              name: '_projects',
              type: 'address',
            },
            {
              internalType: 'contract IJBDirectory',
              name: '_directory',
              type: 'address',
            },
            {
              internalType: 'contract IJBSplitsStore',
              name: '_splitsStore',
              type: 'address',
            },
            {
              internalType: 'contract IJBPrices',
              name: '_prices',
              type: 'address',
            },
            {
              internalType: 'contract IJBSingleTokenPaymentTerminalStore',
              name: '_store',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_owner',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [],
          type: 'error',
          name: 'FEE_TOO_HIGH',
        },
        {
          inputs: [],
          type: 'error',
          name: 'INADEQUATE_DISTRIBUTION_AMOUNT',
        },
        {
          inputs: [],
          type: 'error',
          name: 'INADEQUATE_RECLAIM_AMOUNT',
        },
        {
          inputs: [],
          type: 'error',
          name: 'INADEQUATE_TOKEN_COUNT',
        },
        {
          inputs: [],
          type: 'error',
          name: 'NO_MSG_VALUE_ALLOWED',
        },
        {
          inputs: [],
          type: 'error',
          name: 'PAY_TO_ZERO_ADDRESS',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'prod1',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'denominator',
              type: 'uint256',
            },
          ],
          type: 'error',
          name: 'PRBMath__MulDivOverflow',
        },
        {
          inputs: [],
          type: 'error',
          name: 'PROJECT_TERMINAL_MISMATCH',
        },
        {
          inputs: [],
          type: 'error',
          name: 'REDEEM_TO_ZERO_ADDRESS',
        },
        {
          inputs: [],
          type: 'error',
          name: 'TERMINAL_IN_SPLIT_ZERO_ADDRESS',
        },
        {
          inputs: [],
          type: 'error',
          name: 'TERMINAL_TOKENS_INCOMPATIBLE',
        },
        {
          inputs: [],
          type: 'error',
          name: 'UNAUTHORIZED',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'refundedFees',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'string',
              name: 'memo',
              type: 'string',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: 'metadata',
              type: 'bytes',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'AddToBalance',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'contract IJBPayDelegate',
              name: 'delegate',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'struct JBDidPayData',
              name: 'data',
              type: 'tuple',
              components: [
                {
                  internalType: 'address',
                  name: 'payer',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'projectId',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'currentFundingCycleConfiguration',
                  type: 'uint256',
                },
                {
                  internalType: 'struct JBTokenAmount',
                  name: 'amount',
                  type: 'tuple',
                  components: [
                    {
                      internalType: 'address',
                      name: 'token',
                      type: 'address',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'decimals',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'currency',
                      type: 'uint256',
                    },
                  ],
                },
                {
                  internalType: 'struct JBTokenAmount',
                  name: 'forwardedAmount',
                  type: 'tuple',
                  components: [
                    {
                      internalType: 'address',
                      name: 'token',
                      type: 'address',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'decimals',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'currency',
                      type: 'uint256',
                    },
                  ],
                },
                {
                  internalType: 'uint256',
                  name: 'projectTokenCount',
                  type: 'uint256',
                },
                {
                  internalType: 'address',
                  name: 'beneficiary',
                  type: 'address',
                },
                {
                  internalType: 'bool',
                  name: 'preferClaimedTokens',
                  type: 'bool',
                },
                {
                  internalType: 'string',
                  name: 'memo',
                  type: 'string',
                },
                {
                  internalType: 'bytes',
                  name: 'metadata',
                  type: 'bytes',
                },
              ],
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'delegatedAmount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'DelegateDidPay',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'contract IJBRedemptionDelegate',
              name: 'delegate',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'struct JBDidRedeemData',
              name: 'data',
              type: 'tuple',
              components: [
                {
                  internalType: 'address',
                  name: 'holder',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'projectId',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'currentFundingCycleConfiguration',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'projectTokenCount',
                  type: 'uint256',
                },
                {
                  internalType: 'struct JBTokenAmount',
                  name: 'reclaimedAmount',
                  type: 'tuple',
                  components: [
                    {
                      internalType: 'address',
                      name: 'token',
                      type: 'address',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'decimals',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'currency',
                      type: 'uint256',
                    },
                  ],
                },
                {
                  internalType: 'struct JBTokenAmount',
                  name: 'forwardedAmount',
                  type: 'tuple',
                  components: [
                    {
                      internalType: 'address',
                      name: 'token',
                      type: 'address',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'decimals',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'currency',
                      type: 'uint256',
                    },
                  ],
                },
                {
                  internalType: 'address payable',
                  name: 'beneficiary',
                  type: 'address',
                },
                {
                  internalType: 'string',
                  name: 'memo',
                  type: 'string',
                },
                {
                  internalType: 'bytes',
                  name: 'metadata',
                  type: 'bytes',
                },
              ],
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'delegatedAmount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'DelegateDidRedeem',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'fundingCycleConfiguration',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'fundingCycleNumber',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'distributedAmount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'fee',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'beneficiaryDistributionAmount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: 'metadata',
              type: 'bytes',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'DistributePayouts',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'domain',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'group',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'struct JBSplit',
              name: 'split',
              type: 'tuple',
              components: [
                {
                  internalType: 'bool',
                  name: 'preferClaimed',
                  type: 'bool',
                },
                {
                  internalType: 'bool',
                  name: 'preferAddToBalance',
                  type: 'bool',
                },
                {
                  internalType: 'uint256',
                  name: 'percent',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'projectId',
                  type: 'uint256',
                },
                {
                  internalType: 'address payable',
                  name: 'beneficiary',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'lockedUntil',
                  type: 'uint256',
                },
                {
                  internalType: 'contract IJBSplitAllocator',
                  name: 'allocator',
                  type: 'address',
                },
              ],
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'netAmount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'DistributeToPayoutSplit',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'feeProjectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: 'reason',
              type: 'bytes',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'FeeReverted',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'fee',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'feeDiscount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'HoldFee',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'contract IJBPaymentTerminal',
              name: 'to',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'Migrate',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
              indexed: true,
            },
          ],
          type: 'event',
          name: 'OwnershipTransferred',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'fundingCycleConfiguration',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'fundingCycleNumber',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'address',
              name: 'payer',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'beneficiaryTokenCount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'string',
              name: 'memo',
              type: 'string',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: 'metadata',
              type: 'bytes',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'Pay',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'struct JBSplit',
              name: 'split',
              type: 'tuple',
              components: [
                {
                  internalType: 'bool',
                  name: 'preferClaimed',
                  type: 'bool',
                },
                {
                  internalType: 'bool',
                  name: 'preferAddToBalance',
                  type: 'bool',
                },
                {
                  internalType: 'uint256',
                  name: 'percent',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'projectId',
                  type: 'uint256',
                },
                {
                  internalType: 'address payable',
                  name: 'beneficiary',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'lockedUntil',
                  type: 'uint256',
                },
                {
                  internalType: 'contract IJBSplitAllocator',
                  name: 'allocator',
                  type: 'address',
                },
              ],
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: 'reason',
              type: 'bytes',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'PayoutReverted',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'bool',
              name: 'wasHeld',
              type: 'bool',
              indexed: true,
            },
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'ProcessFee',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'fundingCycleConfiguration',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'fundingCycleNumber',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'address',
              name: 'holder',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'tokenCount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'reclaimedAmount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'string',
              name: 'memo',
              type: 'string',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: 'metadata',
              type: 'bytes',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'RedeemTokens',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'refundedFees',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'leftoverAmount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'RefundHeldFees',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'fee',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'SetFee',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'contract IJBFeeGauge',
              name: 'feeGauge',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'SetFeeGauge',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'addrs',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'bool',
              name: 'flag',
              type: 'bool',
              indexed: true,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'SetFeelessAddress',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'fundingCycleConfiguration',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'fundingCycleNumber',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'projectId',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'distributedAmount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'uint256',
              name: 'netDistributedamount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'string',
              name: 'memo',
              type: 'string',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: 'metadata',
              type: 'bytes',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'UseAllowance',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'acceptsToken',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
            {
              internalType: 'string',
              name: '_memo',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: '_metadata',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'function',
          name: 'addToBalanceOf',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: '_shouldRefundHeldFees',
              type: 'bool',
            },
            {
              internalType: 'string',
              name: '_memo',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: '_metadata',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'function',
          name: 'addToBalanceOf',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'baseWeightCurrency',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'currency',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'currencyForToken',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'currentEthOverflowOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'decimals',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'decimalsForToken',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'directory',
          outputs: [
            {
              internalType: 'contract IJBDirectory',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_currency',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_minReturnedTokens',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '_memo',
              type: 'bytes',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'distributePayoutsOf',
          outputs: [
            {
              internalType: 'uint256',
              name: 'netLeftoverDistributionAmount',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'fee',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'feeGauge',
          outputs: [
            {
              internalType: 'contract IJBFeeGauge',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'heldFeesOf',
          outputs: [
            {
              internalType: 'struct JBFee[]',
              name: '',
              type: 'tuple[]',
              components: [
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
                {
                  internalType: 'uint32',
                  name: 'fee',
                  type: 'uint32',
                },
                {
                  internalType: 'uint32',
                  name: 'feeDiscount',
                  type: 'uint32',
                },
                {
                  internalType: 'address',
                  name: 'beneficiary',
                  type: 'address',
                },
              ],
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'isFeelessAddress',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
            {
              internalType: 'contract IJBPaymentTerminal',
              name: '_to',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'migrate',
          outputs: [
            {
              internalType: 'uint256',
              name: 'balance',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'operatorStore',
          outputs: [
            {
              internalType: 'contract IJBOperatorStore',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_beneficiary',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_minReturnedTokens',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: '_preferClaimedTokens',
              type: 'bool',
            },
            {
              internalType: 'string',
              name: '_memo',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: '_metadata',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'function',
          name: 'pay',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'payoutSplitsGroup',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'prices',
          outputs: [
            {
              internalType: 'contract IJBPrices',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'processFees',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'projects',
          outputs: [
            {
              internalType: 'contract IJBProjects',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_holder',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_tokenCount',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_minReturnedTokens',
              type: 'uint256',
            },
            {
              internalType: 'address payable',
              name: '_beneficiary',
              type: 'address',
            },
            {
              internalType: 'string',
              name: '_memo',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: '_metadata',
              type: 'bytes',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'redeemTokensOf',
          outputs: [
            {
              internalType: 'uint256',
              name: 'reclaimAmount',
              type: 'uint256',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'renounceOwnership',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_fee',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'setFee',
        },
        {
          inputs: [
            {
              internalType: 'contract IJBFeeGauge',
              name: '_feeGauge',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'setFeeGauge',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_address',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: '_flag',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'setFeelessAddress',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'splitsStore',
          outputs: [
            {
              internalType: 'contract IJBSplitsStore',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'store',
          outputs: [
            {
              internalType: 'contract IJBSingleTokenPaymentTerminalStore',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: '_interfaceId',
              type: 'bytes4',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'token',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'transferOwnership',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_projectId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_currency',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_minReturnedTokens',
              type: 'uint256',
            },
            {
              internalType: 'address payable',
              name: '_beneficiary',
              type: 'address',
            },
            {
              internalType: 'string',
              name: '_memo',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: '_metadata',
              type: 'bytes',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'useAllowanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: 'netDistributedAmount',
              type: 'uint256',
            },
          ],
        },
      ],
      devdoc: {
        kind: 'dev',
        methods: {
          'acceptsToken(address,uint256)': {
            params: {
              _projectId: 'The project ID to check for token acceptance.',
              _token: 'The token to check if this terminal accepts or not.',
            },
            returns: {
              _0: 'The flag.',
            },
          },
          'addToBalanceOf(uint256,uint256,address,bool,string,bytes)': {
            params: {
              _amount:
                'The amount of tokens to add, as a fixed point number with the same number of decimals as this terminal. If this is an ETH terminal, this is ignored and msg.value is used instead.',
              _memo: 'A memo to pass along to the emitted event.',
              _metadata: 'Extra data to pass along to the emitted event.',
              _projectId:
                'The ID of the project to which the funds received belong.',
              _shouldRefundHeldFees:
                'A flag indicating if held fees should be refunded based on the amount being added.',
              _token:
                'The token being paid. This terminal ignores this property since it only manages one currency. ',
            },
          },
          'addToBalanceOf(uint256,uint256,address,string,bytes)': {
            params: {
              _amount:
                'The amount of tokens to add, as a fixed point number with the same number of decimals as this terminal. If this is an ETH terminal, this is ignored and msg.value is used instead.',
              _memo: 'A memo to pass along to the emitted event.',
              _metadata: 'Extra data to pass along to the emitted event.',
              _projectId:
                'The ID of the project to which the funds received belong.',
              _token:
                'The token being paid. This terminal ignores this property since it only manages one currency. ',
            },
          },
          constructor: {
            params: {
              _baseWeightCurrency: 'The currency to base token issuance on.',
              _currency:
                "The currency that this terminal's token adheres to for price feeds.",
              _directory:
                'A contract storing directories of terminals and controllers for each project.',
              _operatorStore: 'A contract storing operator assignments.',
              _owner: 'The address that will own this contract.',
              _payoutSplitsGroup:
                'The group that denotes payout splits from this terminal in the splits store.',
              _prices: 'A contract that exposes price feeds.',
              _projects:
                "A contract which mints ERC-721's that represent project ownership and transfers.",
              _splitsStore: 'A contract that stores splits for each project.',
              _store: "A contract that stores the terminal's data.",
              _token: 'The token that this terminal manages.',
            },
          },
          'currencyForToken(address)': {
            params: {
              _token: 'The token to check for the currency of.',
            },
            returns: {
              _0: 'The currency index.',
            },
          },
          'currentEthOverflowOf(uint256)': {
            details:
              'The current overflow is represented as a fixed point number with 18 decimals.',
            params: {
              _projectId: 'The ID of the project to get overflow for.',
            },
            returns: {
              _0: 'The current amount of ETH overflow that project has in this terminal, as a fixed point number with 18 decimals.',
            },
          },
          'decimalsForToken(address)': {
            params: {
              _token: 'The token to check for the decimals of.',
            },
            returns: {
              _0: 'The number of decimals for the token.',
            },
          },
          'distributePayoutsOf(uint256,uint256,uint256,address,uint256,bytes)':
            {
              details:
                "Payouts are sent to the preprogrammed splits. Any leftover is sent to the project's owner.Anyone can distribute payouts on a project's behalf. The project can preconfigure a wildcard split that is used to send funds to msg.sender. This can be used to incentivize calling this function.All funds distributed outside of this contract or any feeless terminals incure the protocol fee.",
              params: {
                _amount:
                  'The amount of terminal tokens to distribute, as a fixed point number with same number of decimals as this terminal.',
                _currency:
                  "The expected currency of the amount being distributed. Must match the project's current funding cycle's distribution limit currency.",
                _memo: 'Bytes to send along to the emitted event, if provided.',
                _minReturnedTokens:
                  "The minimum number of terminal tokens that the `_amount` should be valued at in terms of this terminal's currency, as a fixed point number with the same number of decimals as this terminal.",
                _projectId:
                  'The ID of the project having its payouts distributed.',
                _token:
                  'The token being distributed. This terminal ignores this property since it only manages one token. ',
              },
              returns: {
                netLeftoverDistributionAmount:
                  'The amount that was sent to the project owner, as a fixed point number with the same amount of decimals as this terminal.',
              },
            },
          'heldFeesOf(uint256)': {
            params: {
              _projectId:
                'The ID of the project for which fees are being held.',
            },
            returns: {
              _0: 'An array of fees that are being held.',
            },
          },
          'migrate(uint256,address)': {
            details:
              "Only a project's owner or a designated operator can migrate it.",
            params: {
              _projectId: 'The ID of the project being migrated.',
              _to: "The terminal contract that will gain the project's funds.",
            },
            returns: {
              balance:
                'The amount of funds that were migrated, as a fixed point number with the same amount of decimals as this terminal.',
            },
          },
          'owner()': {
            details: 'Returns the address of the current owner.',
          },
          'pay(uint256,uint256,address,address,uint256,bool,string,bytes)': {
            params: {
              _amount:
                "The amount of terminal tokens being received, as a fixed point number with the same amount of decimals as this terminal. If this terminal's token is ETH, this is ignored and msg.value is used in its place.",
              _beneficiary:
                "The address to mint tokens for and pass along to the funding cycle's data source and delegate.",
              _memo:
                "A memo to pass along to the emitted event, and passed along the the funding cycle's data source and delegate.  A data source can alter the memo before emitting in the event and forwarding to the delegate.",
              _metadata:
                'Bytes to send along to the data source, delegate, and emitted event, if provided.',
              _minReturnedTokens:
                'The minimum number of project tokens expected in return, as a fixed point number with the same amount of decimals as this terminal.',
              _preferClaimedTokens:
                'A flag indicating whether the request prefers to mint project tokens into the beneficiaries wallet rather than leaving them unclaimed. This is only possible if the project has an attached token contract. Leaving them unclaimed saves gas.',
              _projectId: 'The ID of the project being paid.',
              _token:
                'The token being paid. This terminal ignores this property since it only manages one token. ',
            },
            returns: {
              _0: 'The number of tokens minted for the beneficiary, as a fixed point number with 18 decimals.',
            },
          },
          'processFees(uint256)': {
            details:
              "Only a project owner, an operator, or the contract's owner can process held fees.",
            params: {
              _projectId:
                'The ID of the project whos held fees should be processed.',
            },
          },
          'redeemTokensOf(address,uint256,uint256,address,uint256,address,string,bytes)':
            {
              details:
                'Only a token holder or a designated operator can redeem its tokens.',
              params: {
                _beneficiary: 'The address to send the terminal tokens to.',
                _holder: 'The account to redeem tokens for.',
                _memo: 'A memo to pass along to the emitted event.',
                _metadata:
                  'Bytes to send along to the data source, delegate, and emitted event, if provided.',
                _minReturnedTokens:
                  'The minimum amount of terminal tokens expected in return, as a fixed point number with the same amount of decimals as the terminal.',
                _projectId:
                  'The ID of the project to which the tokens being redeemed belong.',
                _token:
                  'The token being reclaimed. This terminal ignores this property since it only manages one token. ',
                _tokenCount:
                  'The number of project tokens to redeem, as a fixed point number with 18 decimals.',
              },
              returns: {
                reclaimAmount:
                  'The amount of terminal tokens that the project tokens were redeemed for, as a fixed point number with 18 decimals.',
              },
            },
          'renounceOwnership()': {
            details:
              'Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.',
          },
          'setFee(uint256)': {
            details: 'Only the owner of this contract can change the fee.',
            params: {
              _fee: 'The new fee, out of MAX_FEE.',
            },
          },
          'setFeeGauge(address)': {
            details:
              'Only the owner of this contract can change the fee gauge.',
            params: {
              _feeGauge: 'The new fee gauge.',
            },
          },
          'setFeelessAddress(address,bool)': {
            details:
              'Only the owner of this contract can set addresses as feeless.',
            params: {
              _address:
                'The address that can be paid towards while still bypassing fees.',
              _flag:
                'A flag indicating whether the terminal should be feeless or not.',
            },
          },
          'supportsInterface(bytes4)': {
            details: ' See {IERC165-supportsInterface}.',
            params: {
              _interfaceId:
                'The ID of the interface to check for adherance to.',
            },
          },
          'transferOwnership(address)': {
            details:
              'Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.',
          },
          'useAllowanceOf(uint256,uint256,uint256,address,uint256,address,string,bytes)':
            {
              details:
                "Only a project's owner or a designated operator can use its allowance.Incurs the protocol fee.",
              params: {
                _amount:
                  "The amount of terminal tokens to use from this project's current allowance, as a fixed point number with the same amount of decimals as this terminal.",
                _beneficiary: 'The address to send the funds to.',
                _currency:
                  "The expected currency of the amount being distributed. Must match the project's current funding cycle's overflow allowance currency.",
                _memo: 'A memo to pass along to the emitted event.',
                _metadata:
                  'Bytes to send along to the emitted event, if provided.',
                _minReturnedTokens:
                  "The minimum number of tokens that the `_amount` should be valued at in terms of this terminal's currency, as a fixed point number with 18 decimals.",
                _projectId: 'The ID of the project to use the allowance of.',
                _token:
                  'The token being distributed. This terminal ignores this property since it only manages one token. ',
              },
              returns: {
                netDistributedAmount:
                  'The amount of tokens that was distributed to the beneficiary, as a fixed point number with the same amount of decimals as the terminal.',
              },
            },
        },
        version: 1,
      },
      userdoc: {
        kind: 'user',
        methods: {
          'acceptsToken(address,uint256)': {
            notice:
              'A flag indicating if this terminal accepts the specified token.',
          },
          'addToBalanceOf(uint256,uint256,address,bool,string,bytes)': {
            notice: 'Receives funds belonging to the specified project.',
          },
          'addToBalanceOf(uint256,uint256,address,string,bytes)': {
            notice: 'Receives funds belonging to the specified project.',
          },
          'baseWeightCurrency()': {
            notice: 'The currency to base token issuance on.',
          },
          'currency()': {
            notice:
              'The currency to use when resolving price feeds for this terminal.',
          },
          'currencyForToken(address)': {
            notice: 'The currency that should be used for the specified token.',
          },
          'currentEthOverflowOf(uint256)': {
            notice:
              'Gets the current overflowed amount in this terminal for a specified project, in terms of ETH.',
          },
          'decimals()': {
            notice:
              'The number of decimals the token fixed point amounts are expected to have.',
          },
          'decimalsForToken(address)': {
            notice:
              'The decimals that should be used in fixed number accounting for the specified token.',
          },
          'directory()': {
            notice: 'The directory of terminals and controllers for projects.',
          },
          'distributePayoutsOf(uint256,uint256,uint256,address,uint256,bytes)':
            {
              notice:
                'Distributes payouts for a project with the distribution limit of its current funding cycle.',
            },
          'fee()': {
            notice: 'The platform fee percent.',
          },
          'feeGauge()': {
            notice:
              "The data source that returns a discount to apply to a project's fee.",
          },
          'heldFeesOf(uint256)': {
            notice:
              'The fees that are currently being held to be processed later for each project.',
          },
          'isFeelessAddress(address)': {
            notice:
              'Addresses that can be paid towards from this terminal without incurring a fee.',
          },
          'migrate(uint256,address)': {
            notice:
              'Allows a project owner to migrate its funds and operations to a new terminal that accepts the same token type.',
          },
          'operatorStore()': {
            notice: ' A contract storing operator assignments.',
          },
          'pay(uint256,uint256,address,address,uint256,bool,string,bytes)': {
            notice: 'Contribute tokens to a project.',
          },
          'payoutSplitsGroup()': {
            notice:
              'The group that payout splits coming from this terminal are identified by.',
          },
          'prices()': {
            notice: 'The contract that exposes price feeds.',
          },
          'processFees(uint256)': {
            notice: 'Process any fees that are being held for the project.',
          },
          'projects()': {
            notice:
              "Mints ERC-721's that represent project ownership and transfers.",
          },
          'redeemTokensOf(address,uint256,uint256,address,uint256,address,string,bytes)':
            {
              notice:
                "Holders can redeem their tokens to claim the project's overflowed tokens, or to trigger rules determined by the project's current funding cycle's data source.",
            },
          'setFee(uint256)': {
            notice: 'Allows the fee to be updated.',
          },
          'setFeeGauge(address)': {
            notice: 'Allows the fee gauge to be updated.',
          },
          'setFeelessAddress(address,bool)': {
            notice:
              'Sets whether projects operating on this terminal can pay towards the specified address without incurring a fee.',
          },
          'splitsStore()': {
            notice: 'The contract that stores splits for each project.',
          },
          'store()': {
            notice: "The contract that stores and manages the terminal's data.",
          },
          'supportsInterface(bytes4)': {
            notice:
              'Indicates if this contract adheres to the specified interface.',
          },
          'token()': {
            notice: 'The token that this terminal accepts.',
          },
          'useAllowanceOf(uint256,uint256,uint256,address,uint256,address,string,bytes)':
            {
              notice:
                'Allows a project to send funds from its overflow up to the preconfigured allowance.',
            },
        },
        version: 1,
      },
    },
    settings: {
      remappings: [
        ':@chainlink/=lib/juice-contracts-v3/lib/chainlink/',
        ':@jbx-protocol/juice-contracts-v3/=lib/juice-contracts-v3/',
        ':@juicebox/=lib/juice-contracts-v3/contracts/',
        ':@openzeppelin-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/',
        ':@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/',
        ':@paulrberg/contracts/math/=lib/juice-contracts-v3/lib/prb-math/contracts/',
        ':@prb/math/=lib/prb-math/',
        ':chainlink/=lib/juice-contracts-v3/lib/chainlink/',
        ':create3-factory/=lib/create3-factory/src/',
        ':ds-test/=lib/forge-std/lib/ds-test/src/',
        ':erc4626-tests/=lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/',
        ':forge-std/=lib/forge-std/src/',
        ':juice-contracts-v3/=lib/juice-contracts-v3/',
        ':openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/',
        ':openzeppelin-contracts/=lib/openzeppelin-contracts/',
        ':openzeppelin-contracts/contracts/=lib/juice-contracts-v3/lib/openzeppelin-contracts/contracts/',
        ':prb-contracts/=lib/prb-contracts/contracts/',
        ':prb-math/=lib/prb-math/contracts/',
        ':solmate/=lib/solmate/src/',
      ],
      optimizer: {
        enabled: true,
        runs: 10000,
      },
      metadata: {
        bytecodeHash: 'ipfs',
      },
      compilationTarget: {
        'lib/juice-contracts-v3/contracts/JBERC20PaymentTerminal3_1.sol':
          'JBERC20PaymentTerminal3_1',
      },
      libraries: {},
    },
    sources: {
      'lib/juice-contracts-v3/contracts/JBERC20PaymentTerminal3_1.sol': {
        keccak256:
          '0x4b546b1acce658108c7ba17b169482deb94f2ed113d0e8b1812b87dbfe538b19',
        urls: [
          'bzz-raw://a4b088e5e211cd917c3280e1da4a89d3bf3f7f863e6c9b8d89d1d589290117ce',
          'dweb:/ipfs/QmcyQeRGJAimcngmae2dgwHrg6K1uDwXG2WvBK3iij1xcV',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/abstract/JBOperatable.sol': {
        keccak256:
          '0x9e62cac5c464eb973f881cf6c373b95aab31d2ddbeb048ee7ad82b5c9ab28add',
        urls: [
          'bzz-raw://3b76b81bf5076219f1babbebcf993ecb1fc04ee547e3c82a8c74bfa761c8a735',
          'dweb:/ipfs/QmbpQintWGTJvQyqoe4fdWFF22mBxb2hSomwbbuJ73CQpi',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/abstract/JBPayoutRedemptionPaymentTerminal3_1.sol':
        {
          keccak256:
            '0x07d2efd06320f86c30ed24409d824210353dbf8ffcfe3997272729a709c6360d',
          urls: [
            'bzz-raw://d1e8cf4020e83142bae8ecf4c73fbb04163f4c4e8f6761b3a7efa9ec8f51d7c4',
            'dweb:/ipfs/QmSPywTeomiReNHTAzb72Dk2bTQHgKM6fE2SSgYCcuKXpD',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/abstract/JBSingleTokenPaymentTerminal.sol':
        {
          keccak256:
            '0xdc82ad3e01b918d3d21ffea8c9f30950d81e225137c851599d028dcd22125f89',
          urls: [
            'bzz-raw://adfab423d72c9742feec01bca482cedc2648072a1fb49fad5d328890fdfeb119',
            'dweb:/ipfs/QmTrPfWjuBLjEojY2wKtUNrpY9gcw5fea2mK8JEE2MK1WP',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/enums/JBBallotState.sol': {
        keccak256:
          '0x891fcac63470398b3a11239da7feba6b07d640809fcefd2404303b823d7378f8',
        urls: [
          'bzz-raw://6e6adfceaf284b669a8c1cbcf2da7f18ab31a2d1066f9db8bc914349e7401de7',
          'dweb:/ipfs/QmXLHVRPPZdXUkgAHQbHUtEzAvCJk1P6rJ7wrwfTcfW6fw',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBAllowanceTerminal3_1.sol':
        {
          keccak256:
            '0x4e1ef83fc258e44f7880005b7944e3b4799d87129b2300236d93269a00adb4ee',
          urls: [
            'bzz-raw://c546650f7acb683e60d389f28c0b1ff91db2dd6d318631fae9839ee7f60f2b14',
            'dweb:/ipfs/QmNRxz2dw74vyuPN2QfPtTvKzXmGfsJf96XaYQnMLTNSzS',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/interfaces/IJBController.sol': {
        keccak256:
          '0xb1ee4b41f2a06f28f69c74cb729b8964f2e75f3c545a68f85bd9082b5575bc85',
        urls: [
          'bzz-raw://160aef4e645dde9524564b2bd302e7c766bdf1f67c4fa58516ed59d1dbb7c2a6',
          'dweb:/ipfs/QmaTpyWKi4itYaaxTKU6JUarJHRmxCMP65cp2NJ6ejJDZW',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBDirectory.sol': {
        keccak256:
          '0x715321646db00514d1355ed43c40cd3f01e94959552fd07797b315d9c49cdb1d',
        urls: [
          'bzz-raw://c34c9e1c727ffc63dd42fb6e6ffb3116c8ba15d6a322a300f10f29478974768d',
          'dweb:/ipfs/QmYToaGrbMyyWAuyepYcDd8M6KcmosY8AWhT3uJmPM6Pvy',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBFeeGauge.sol': {
        keccak256:
          '0x8e19959617191320fe1210760860e668a57319258c0c74fcfabac829ae0222c0',
        urls: [
          'bzz-raw://3dd8a4e26f3abc19f1b0580b02d894bd91d31f8d72d8ee1be529ecd6dc638723',
          'dweb:/ipfs/QmUxSM2ePxorxRNFxpxqDnRmGtQrwVMiezQsbxLCCkLL5x',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBFeeHoldingTerminal.sol': {
        keccak256:
          '0x8c9edae0768a737097835b8b9ef4a60f000de122a867c90f20cfc653287541a4',
        urls: [
          'bzz-raw://ac13a8ac78151d7aa94578f77ce680271d73c4178bcc309b325554a499f58bce',
          'dweb:/ipfs/QmRJHmKRyV4Ecu7XJF36BkfCmyjEvFit3m8k8fzeVCKgww',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBFundingCycleBallot.sol': {
        keccak256:
          '0x49553a56209237846bc400cf27f260824a6bd06fd8094a7eb5abb9de75779598',
        urls: [
          'bzz-raw://559372746f94f28b385bc336df263f583dca5377350645c0b28110b083bdb41a',
          'dweb:/ipfs/QmeQRYqPjXBQCtMKXSFtHVD2ewEPoUAPDxLh4oWTRSKbmx',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBFundingCycleStore.sol': {
        keccak256:
          '0xaead823851433be0c2ddc8f8086813e6cd647de3a1bc0f7570a5d6b38c378b5a',
        urls: [
          'bzz-raw://7f11fd52ba9ef67b40811d8a2298ae8b69447d2565b3f1069cbb8f0f13bc65e7',
          'dweb:/ipfs/QmVbBzpTxZWar9xvj6x1vW91hJDv2iPVq7aG6waMxaHUPQ',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBMigratable.sol': {
        keccak256:
          '0xc81053e4b4754fc510aa04fecd3ab1460f01e3e27761e7a8c94f631a978ae127',
        urls: [
          'bzz-raw://4c57ab7d0c0e6d9be798055d68b6f253421458b3beb38d0a3596da104000ca9e',
          'dweb:/ipfs/QmXn1CaffHoP2s43vkUszihdNk1TdfAxejngfdk2VmBVFU',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBOperatable.sol': {
        keccak256:
          '0x09a55a91c6ce3625379334271d236cfa47bf36522a91568b406bf06f7239407e',
        urls: [
          'bzz-raw://c4e0058ff862925a9070f88bec5c53e8aaa5d3ac75952285b1e7ca67ecbe1d3b',
          'dweb:/ipfs/QmVowtkRjGePcpaGjivvFyWTjQBGCtJQqoXFtxX6qhkx56',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBOperatorStore.sol': {
        keccak256:
          '0x17f4929812a356984795fafed8cb2be816a025c9a0771d85595ac0b5ff3cffc5',
        urls: [
          'bzz-raw://4379909df832d51d25ac6f863c12e5271c96f01c4fd399eaeb16be3db8786e4c',
          'dweb:/ipfs/QmTeGMNaf3KPT2A54sQ6HoZiBwfGRNqMZtvvci4oAN4z2s',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBPayDelegate.sol': {
        keccak256:
          '0xa797de18b69eceba117e1f0b3810cf3cc2d2791417d580a5bdc510d1b868ab26',
        urls: [
          'bzz-raw://36b214c091c62c54d22cbedb606c29919cb56f1c29acf9c397c948247a29dcc0',
          'dweb:/ipfs/QmSzxHs8xNFqNfxZb1igvPHk7vXA5vUsGQ6AMfJ8jx8Ktu',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBPaymentTerminal.sol': {
        keccak256:
          '0xb7826f5ed609359ce322c09e83236c47ba385df1c3cad3607e56fd0a2e00eee2',
        urls: [
          'bzz-raw://cbb0de0e73f73a04fcfc8f08cab3588b6d608cf5268af737cff6a530f6062c95',
          'dweb:/ipfs/QmPGb8aEbZNHNnrCvuGH52RLvV3kjL3agxQiFrjHoLHaup',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBPayoutRedemptionPaymentTerminal3_1.sol':
        {
          keccak256:
            '0xe823526fd535dc962784820cac32e6fdd56f2a5020dbf9883979b9ddfcc093fa',
          urls: [
            'bzz-raw://b20151c2627edb72b444aefac48e9eddaed6716affe1c0f9972d0dea1efc67a3',
            'dweb:/ipfs/QmZa3RPUNjj7KiMcP2feA2JEetZ63foc8ugGF9m1TkW65R',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/interfaces/IJBPayoutTerminal3_1.sol': {
        keccak256:
          '0x415707a4902f90945ecee641e96dd88c733b1d159c35c1184e665ca3509ffe49',
        urls: [
          'bzz-raw://2f04cc83ec787668b868903822d8837291b7e5eae9587af2bf3044551cb85f57',
          'dweb:/ipfs/QmbRR8JBB1uFK75QybqXEnUhiM8HXVo8Jq9ojGBvxLzVGj',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBPriceFeed.sol': {
        keccak256:
          '0x57c71282fec1b34b00cf991ffed2e36031c393e35bfa7ca5d723eb6572fb7122',
        urls: [
          'bzz-raw://f51c97ac194d3120a2fb5428eeeff759b75b7cbc5708465afc914619016a7c9b',
          'dweb:/ipfs/QmemTqsGqoPqG97EsdRTMAbB6RfCz8CJxGYPNnDTV6LJ2t',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBPrices.sol': {
        keccak256:
          '0x82a175b1f4b95b506c98406576cd59cbe04615e3df24f9cf3587b61b8ee323b1',
        urls: [
          'bzz-raw://5493e394cf47fca51a4091f1e6d285cc9e4ff9916e5bdfb8e174fe652a2b9833',
          'dweb:/ipfs/QmTXafZatcjYbNMpUYYk1AWNZLkRFK7VVdAYYudGf4z3HJ',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBProjects.sol': {
        keccak256:
          '0x7cfc021d0bd7e73b1ba8f4845d7d35e3419d6a14d3d25ca3a8010e7f91062fe4',
        urls: [
          'bzz-raw://ff265e13e60da56b93104260ed69ab01153437ec2af9d453781f22ca295eaef9',
          'dweb:/ipfs/QmfGCSLX2Wy26ojf4U12udsdtjSSacbLcZGwCjTw7MjWF8',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBRedemptionDelegate.sol': {
        keccak256:
          '0x172d2c0be65e72e54f71ae521907067f0fa30e8ca05c4f88826903208aa437e2',
        urls: [
          'bzz-raw://266a32bd8feea10051a4e243e14692c62e99de7048cda2f541998b4cc64cbd51',
          'dweb:/ipfs/QmPfqsbSZdpQee4WbisK9ZnZRrXbUVvSpbfnrEKGfjzz9N',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBRedemptionTerminal.sol': {
        keccak256:
          '0xe26a6a03468401b802ae5328b39a266f53b9331a1c077fcbf7719d10ba74ff44',
        urls: [
          'bzz-raw://dae771e2abe46134bb23e5eebc30ebebb09a0677a8827f89a51e84902176cfb8',
          'dweb:/ipfs/QmRqF3cdeB46PfYb6bGeFKQetjBJHaJHGV47kTbtMMsoEp',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBSingleTokenPaymentTerminal.sol':
        {
          keccak256:
            '0xf6e78323caa9af7bbf024f44b2032a83fed0394e0b3a242a6346e73c85b2e46f',
          urls: [
            'bzz-raw://63c9f3f0db323bd5492c76da3ae2bae7895e287a824729d125bfb650121d576c',
            'dweb:/ipfs/QmPWohiNJvv6JtH8yAtqomiwVheEvKXY4SfHjL98vd2mQY',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/interfaces/IJBSingleTokenPaymentTerminalStore.sol':
        {
          keccak256:
            '0xd78929c9371fd7895b829ef5e4ad4b3786523c3580ac3f6f5f25d2b5941c0dd3',
          urls: [
            'bzz-raw://1b6afe1de26dec89d7f9b456586ae83e4f51e967ed65c44d809d33a298cd183c',
            'dweb:/ipfs/QmavNYeXKJQyuQQLQuCgAL9GWsKvhd6wKgivtZjhXePSaN',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/interfaces/IJBSplitAllocator.sol': {
        keccak256:
          '0x5efb6f51fc161f42ff58989386ad99028e4039a0ba897d66f358c3dfcf686105',
        urls: [
          'bzz-raw://171df7cf5285170894d7d7d00ecb14271204b55d330fa65e1bf9ebfb21741c29',
          'dweb:/ipfs/QmXBmzjVVgGd1hZoStw2qoypJnqyWgYeMXMLyYS7f6Zonu',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBSplitsStore.sol': {
        keccak256:
          '0x66dab3dd394e318b850401ca92c2963b906cc0ad5562fa5d4f6f850175d1c77a',
        urls: [
          'bzz-raw://948dae4e7eddc75f32fe75b25f97a7bad0e7b335a8a5a8dfd81b532dd325dd27',
          'dweb:/ipfs/QmZY1s7r85NWVdqhmUE71Pkuo7CPk8SMgAwUrj8bLpTaWC',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBToken.sol': {
        keccak256:
          '0xe8969210417736c85d71101bf1c0bd8ebbf9d1e62a93e758148bd5709a6c7097',
        urls: [
          'bzz-raw://214c67c2ebeabd1b412ac9b0b6de4c02765c8311a3dc258568a2aa7322d58fb7',
          'dweb:/ipfs/QmeEbk8YWRVtMpxWQGfYbMrgYc2qsPhQF5jpufK26RrCXY',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBTokenStore.sol': {
        keccak256:
          '0x98459e3af050d41dfeffdc97f1c93330207ba450f8ff3613224b49a89eeca9c6',
        urls: [
          'bzz-raw://0e98bda797088b1bb2a756eaed911ab12b092ffdad5467e82650bfa9bf8dd046',
          'dweb:/ipfs/QmbuKq4xSC8LL62smwrHWCWKiWawEu8Ne2n7q8DhKHKvtD',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/interfaces/IJBTokenUriResolver.sol': {
        keccak256:
          '0xd267fd8ca7c21c2c71794acdb9a98314c33a35fc559e0bf0897a6686d196d174',
        urls: [
          'bzz-raw://aa7053d4300ed1374f3f993e6e2163d0a05ee780e4e99eb007b55eabc93c724e',
          'dweb:/ipfs/QmYZAUn7VCwqpDWYZNCXLNYMRQpD334YgPRiGCfxQApzuT',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/libraries/JBConstants.sol': {
        keccak256:
          '0x34362846a1cd428a8bdedf4ab6857e11402f345cb87b994b2e7fb6d2474b808d',
        urls: [
          'bzz-raw://80b423d29251e6d6cc6bd24b89474628ebcd588fbf485da714134e449e002264',
          'dweb:/ipfs/QmVBKR4eLMfJRHJLxEJJJQiYEgkoXK6kK6HyFy7mQ9Wx6d',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/libraries/JBCurrencies.sol': {
        keccak256:
          '0x7e417ff25c173608ee4fe6d9fc3dcd5e1458c78c889af12bac47b1189a436076',
        urls: [
          'bzz-raw://92a96ba0dfa74f968db8d5f367c92a8c7e616c70cafab3b6d7f049e43b501e84',
          'dweb:/ipfs/QmdJHS7yVcXjTzN82LjNZp77uzYZPL3951NWit4i36pN7Q',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/libraries/JBFixedPointNumber.sol': {
        keccak256:
          '0x18efac48269f3a3bd7e9a1c770776f950e0afa86769e6f8b128002c3b8c6742c',
        urls: [
          'bzz-raw://35470671def0cc37ae881b4309ecc9de8dd55b45f2d94424992f81756cbccd9b',
          'dweb:/ipfs/Qmf4D16xrCwtvDhHAtjs5U6H7kpXhiMVSp1gaVv5rQ7yNX',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/libraries/JBFundingCycleMetadataResolver.sol':
        {
          keccak256:
            '0x3d045c38593102cfb6ac67f3ddf2232e1ff5518d6d021423ae2681387599fbd3',
          urls: [
            'bzz-raw://a3ed08bbad9868881b87258ecb34b6b5a4fe83e321e5f59c66a758180077135e',
            'dweb:/ipfs/QmbVDpmk4VvunFqpkmsEqX8VomEbsXpRebv841dHRBpy63',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/libraries/JBGlobalFundingCycleMetadataResolver.sol':
        {
          keccak256:
            '0x0d998f938026edeb755987a79421267cf860801161b5f171206a200b60f1061f',
          urls: [
            'bzz-raw://d2ff895bbf2f18fe6538abe53966acd8ea128795283209bb8402ac72ddd529b1',
            'dweb:/ipfs/QmZgU8rokY5sBQ2guFmPotGh4e8ReNHAyZzRhZXrN9a8EP',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/libraries/JBOperations.sol': {
        keccak256:
          '0x7f8e501e6890297f4015b1c27cebdb44fadbf21204bea1f3162f5388c060f690',
        urls: [
          'bzz-raw://6827d04b543d9579e910703ffe4b97293cad258faab20c52dfb17b905a4b5e9a',
          'dweb:/ipfs/QmUW4NQdubMEd71uAdo7VkDXgTdvmiV9CAMSjk9ozQBfz9',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/libraries/JBTokens.sol': {
        keccak256:
          '0xecf82992f7b827766aa55f16872517a646521eef414d8cc9786617ea377e5463',
        urls: [
          'bzz-raw://4bb334faa6d2d071473bfcd7efeb5bfa068c340600c204651d59a94be4e4b147',
          'dweb:/ipfs/QmaKgSCvDNgQ6dh2gZfQ9VhkPuRCoACv8e7sd1K9VFikix',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBDidPayData.sol': {
        keccak256:
          '0xf3c664309b37790f16047ae97b0459889ae0242dfcde7fc8902c8d10c7f8e6b6',
        urls: [
          'bzz-raw://ea74b762604ffa0e45181d8ec31b130198546014f6360d15076af79952bc5874',
          'dweb:/ipfs/QmdukMbucvU75BpK4TsYKoqjpQ2Nhs9yjFVzcKGkG3SpSV',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBDidRedeemData.sol': {
        keccak256:
          '0xe2c401f39723a7ce915b8bef328744c66daaf57460843964b941456c2258a412',
        urls: [
          'bzz-raw://c3bddd802ff895aa54f047d2385c7c253f9e0cd5b23d4d84439c1590e7e66ccb',
          'dweb:/ipfs/QmXdSDWgEWMtJDqMhHrBCZnBM4qETXRPteB1wEGZBRxuUb',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBFee.sol': {
        keccak256:
          '0xf4759ff41fe7f1db0fd1ccc7b2a326b239389fd8d69df9b9ed5e1d5926f6fe38',
        urls: [
          'bzz-raw://55796903c879372a459a0eddfa333bc903d6cedb66125787d13ef7eea5c53cc6',
          'dweb:/ipfs/QmZNsajvSxGc6859Jy2ZC6Dk6oy66Y9if9ETcpFa2xZkHP',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBFundAccessConstraints.sol': {
        keccak256:
          '0x85ebaa57b788cbdedc7a3d0eec4892eda5d79db7c1a6103797f10d0d989775b2',
        urls: [
          'bzz-raw://1a911a9d1d0a6f0e475854838877d2d3ae606028381c2aef7fac192a33e3d329',
          'dweb:/ipfs/QmTih57fwyaXdjvXCrG9BbdayD6H2AHQrYkuL4v4rYhMyF',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBFundingCycle.sol': {
        keccak256:
          '0xcdd3ac9b6fa67e62ada88d09b73bc35ade1cd77d43db712289266a788928b4c2',
        urls: [
          'bzz-raw://8ba0be407022bbeb0e9272884653209ee262b8a4e00ffbba1298c3b119feccba',
          'dweb:/ipfs/QmbtLQzSN3hut4jYVsYPiYDfRkDdGkZmTWBnV2wJKrdM3K',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBFundingCycleData.sol': {
        keccak256:
          '0x2aa6368bf4dfc5797e8b02a978293de0c777fae2658de2c825a103587240f3b0',
        urls: [
          'bzz-raw://2d7a980ab9b67ad1569d4407b747903cab668a332214117f5ad44feb50af0a3a',
          'dweb:/ipfs/QmSuEzmrmDSihrTKYCk8miq7VQi7WD6jmQePkjDyzt7UpC',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBFundingCycleMetadata.sol': {
        keccak256:
          '0x783604440cac8d176332eab28166f188ee5c230378c08cfc95fea4f7187dc77d',
        urls: [
          'bzz-raw://81409f9675aabd5ece88efbf08d1acb5581c2aac5b6394824f575f5f2edb5788',
          'dweb:/ipfs/QmPWdUztAEssCEnuFFkj74kNFEfVUxbNFmD5GmVB2Qvj1h',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBGlobalFundingCycleMetadata.sol':
        {
          keccak256:
            '0x05d85530305fec6d6eca54cdbc2cd9110cbda0146598032b0203aa4b622944ff',
          urls: [
            'bzz-raw://ec56eff6784c7b60ebc3098037573d8ece138794a9a58ebe8412e75927e984cd',
            'dweb:/ipfs/QmdkEeE6JDyCiV3YBKf7h3FymEHCAHHAtBokUkJwFWVPSf',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/structs/JBGroupedSplits.sol': {
        keccak256:
          '0x80be1b220da4ac04851ea540ebb94c1ec2b0442ec5bd1e88fdf78a56becd8b5a',
        urls: [
          'bzz-raw://b73e5da7d38bfadd565c202aa1a5a6c08a51542699e8e3683b8888009bc62563',
          'dweb:/ipfs/QmUNTy4XVvfAMqP7wCjj84deTvCehkBL1diZoWkyMCVsPw',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBOperatorData.sol': {
        keccak256:
          '0x3b85be7b69515976ee10770776283911666aceca820b0cf4e201ea4dbffeb6f0',
        urls: [
          'bzz-raw://1a18afb385759e5440c645f2a5c581e42a7ac357c73c376fb34dbb5d5fd8f9af',
          'dweb:/ipfs/QmZziN5ixwUXpk185YrcneBEVq91gVqYoBD7MrbvTTpALP',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBPayDelegateAllocation.sol': {
        keccak256:
          '0xb4e558dc62231d89e9b48998012577d22c3e52b58e23401f22d9096827f6ea0c',
        urls: [
          'bzz-raw://b6617a7479709d2a68fbc6686c9087fd7339ffcbb4823010287eb2ad979f23dd',
          'dweb:/ipfs/QmVT66SXpY9h5sD8nJq7VALbfWdeHwUxAeBPymaHg1TMNM',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBProjectMetadata.sol': {
        keccak256:
          '0x90ad7b1014c0a9f945fe7a2efde9d5de41e40574fa27969070b1d2ff52033ea0',
        urls: [
          'bzz-raw://1fafc65a9fd74605b7d6c6f0a92b3237a8e3efdd160affb8c117bad00dcf9494',
          'dweb:/ipfs/QmQkcVt11WLqrxHVrcDCF6dNxzg2kKHEghAgSbfLF6CHkt',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBRedemptionDelegateAllocation.sol':
        {
          keccak256:
            '0x10c29d33dd0d875a0d4692a2b9a9355c2ebf433cc06a9a60253d4366b60d4d31',
          urls: [
            'bzz-raw://76614755cf61b78b3d3263ddcbf7c7146986374e4cdf5cc2abb67c523d957142',
            'dweb:/ipfs/QmVNGDmTCcfYxgbA83yURstmAU7vtAtjTh9zNFRwKMmTH1',
          ],
          license: 'MIT',
        },
      'lib/juice-contracts-v3/contracts/structs/JBSplit.sol': {
        keccak256:
          '0xc80a16606da8abf76d0f73abc38aee041e24f29342c1939018f70c286e89f105',
        urls: [
          'bzz-raw://d257df1f322904fdbf34a0d28880cc96a1ba3905d19488d83156a7d3476d820f',
          'dweb:/ipfs/QmP6WFuoK6ePEQ2zxRnpu1kWDdFSUTGaEV57eZ4gs9FqC8',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBSplitAllocationData.sol': {
        keccak256:
          '0x39f5c41bd31d36774744698ac94484b6cab62d7038df2f29d947668959782e63',
        urls: [
          'bzz-raw://cf81d025aa0f6f93bdcd0b863730f7c574de7c3c4a595ba88e342f46c4b724e4',
          'dweb:/ipfs/QmaQ1frbYciPVV1Qmsfmgts9fgbXKZLQ8jGf9XRikHSmci',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/contracts/structs/JBTokenAmount.sol': {
        keccak256:
          '0x4a778e779ba257ba5638c5469e07a4d21b55a3128d56db5a0fdfacb1f3301c51',
        urls: [
          'bzz-raw://fdb8302e06c5b4e1e91d204ed735d8d5db5bb3648200c144d7c545678010a44d',
          'dweb:/ipfs/QmTpffbt3FShkk8LDjsonVGnecbbNMUL8QHYQM7AFcMa54',
        ],
        license: 'MIT',
      },
      'lib/juice-contracts-v3/lib/prb-math/contracts/PRBMath.sol': {
        keccak256:
          '0xe981069ba1d98749de50dec3983d023a996575d2e7e983f9eb4a33601f655766',
        urls: [
          'bzz-raw://2804382c50036b38925399624a1a271b50f77ac5476d93fa703266bb60e70de8',
          'dweb:/ipfs/QmXbw6xZc3tBt8MEwSymL9H842xPcnHVu9pwNzf5wAgCoH',
        ],
        license: 'Unlicense',
      },
      'lib/openzeppelin-contracts/contracts/access/Ownable.sol': {
        keccak256:
          '0x923b9774b81c1abfb992262ae7763b6e6de77b077a7180d53c6ebb7b1c8bd648',
        urls: [
          'bzz-raw://53445dc0431f9b45c06f567c6091da961d4087bec0010cca5bd62100fa624a38',
          'dweb:/ipfs/QmNvBYpBv183czrAqNXr76E8M3LF93ouAJFeAcHfb59Rcx',
        ],
        license: 'MIT',
      },
      'lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol': {
        keccak256:
          '0x00c839ff53d07d19db2e7cfa1e5133f9ee90a8d64b0e2e57f50446a2d1a3a0e0',
        urls: [
          'bzz-raw://3dac621d015a68a5251b1e5d41dda0faf252699bf6e8bcf46a958b29964d9dd1',
          'dweb:/ipfs/QmP9axjgZv4cezAhALoTemM62sdLtMDJ9MGTxECnNwHgSJ',
        ],
        license: 'MIT',
      },
      'lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol':
        {
          keccak256:
            '0x8de418a5503946cabe331f35fe242d3201a73f67f77aaeb7110acb1f30423aca',
          urls: [
            'bzz-raw://5a376d3dda2cb70536c0a45c208b29b34ac560c4cb4f513a42079f96ba47d2dd',
            'dweb:/ipfs/QmZQg6gn1sUpM8wHzwNvSnihumUCAhxD119MpXeKp8B9s8',
          ],
          license: 'MIT',
        },
      'lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol':
        {
          keccak256:
            '0x35e258421ae206f3db37281cea70871b4c3553914734aa76139a41af60ac1abb',
          urls: [
            'bzz-raw://2ef94b6bc4ee356db612a1849c615f7dd4b15542d6c8584c86bb9243a7913cf0',
            'dweb:/ipfs/QmaxFj5NFpAjjitZtHPNS9PPtCuBATaRz9ktDDRCQCQ83y',
          ],
          license: 'MIT',
        },
      'lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol': {
        keccak256:
          '0x8a63ea9ec07788740e51046ca14c61f411aedb901e89749c9d55fa56ed43086a',
        urls: [
          'bzz-raw://3035ae3f172ed9e172e1ba4d83bdc70279f63be51ce9218c530132def66ff577',
          'dweb:/ipfs/QmTQ3zfC3YUNeY3KUVFiHgTWDuxfmcEMgpGC6HMoTpgZJL',
        ],
        license: 'MIT',
      },
      'lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol': {
        keccak256:
          '0x41bbb2c41036ca64b2f6c9e973e8cfaa113ebc42af86702cd0d267f915a7e886',
        urls: [
          'bzz-raw://6bf6699c55e82c7af6ae90b61ea9643ca0c905097da9a31269319f1b5a2a696a',
          'dweb:/ipfs/QmRJZa2UmWcRo6W8JnuomwzfjVtAS21QC8HKggxBhoPsU4',
        ],
        license: 'MIT',
      },
      'lib/openzeppelin-contracts/contracts/utils/Address.sol': {
        keccak256:
          '0x2e53602b96c1bf97c731ed3e2a981b4f85e23a9410a5ebd36e549a4cc93340dc',
        urls: [
          'bzz-raw://523f47b3ecc6d4e47b4b998d3356199988eef8a42a10dff5a3660d5f9e76cc71',
          'dweb:/ipfs/QmRLH8CNvDsuLzNCjsbpLM3RHD9he5ESXroYoDT3tpaTCA',
        ],
        license: 'MIT',
      },
      'lib/openzeppelin-contracts/contracts/utils/Context.sol': {
        keccak256:
          '0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7',
        urls: [
          'bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92',
          'dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3',
        ],
        license: 'MIT',
      },
      'lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol': {
        keccak256:
          '0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b',
        urls: [
          'bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d',
          'dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43',
        ],
        license: 'MIT',
      },
      'lib/openzeppelin-contracts/contracts/utils/introspection/ERC165Checker.sol':
        {
          keccak256:
            '0x269bb6068217c8049d795491e9cf287abddc005628084a18fcd5ceee7b0f1233',
          urls: [
            'bzz-raw://f490653e8697ce9d1d86807c3013ff6ed40d5c8a89c3b1f84c615266340dee7d',
            'dweb:/ipfs/QmSGUziQzsbYQxXjajud9hXLWjGzRgzUVC1Z4DRL5WMmQR',
          ],
          license: 'MIT',
        },
      'lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol': {
        keccak256:
          '0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1',
        urls: [
          'bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f',
          'dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy',
        ],
        license: 'MIT',
      },
    },
    version: 1,
  },
  ast: {
    absolutePath:
      'lib/juice-contracts-v3/contracts/JBERC20PaymentTerminal3_1.sol',
    id: 15079,
    exportedSymbols: {
      Address: [37483],
      Context: [39046],
      ERC165: [40220],
      ERC165Checker: [40414],
      IERC165: [40426],
      IERC20: [34622],
      IERC20Metadata: [35552],
      IERC20Permit: [35588],
      IERC721: [37025],
      IJBAllowanceTerminal3_1: [26493],
      IJBController: [26893],
      IJBDirectory: [27434],
      IJBFeeGauge: [27444],
      IJBFeeHoldingTerminal: [27462],
      IJBFundingCycleBallot: [27548],
      IJBFundingCycleStore: [27685],
      IJBMigratable: [27695],
      IJBOperatable: [27705],
      IJBOperatorStore: [27773],
      IJBPayDelegate: [27788],
      IJBPaymentTerminal: [27858],
      IJBPayoutRedemptionPaymentTerminal3_1: [28556],
      IJBPayoutTerminal3_1: [28596],
      IJBPriceFeed: [28606],
      IJBPrices: [28650],
      IJBProjects: [28729],
      IJBRedemptionDelegate: [28744],
      IJBRedemptionTerminal: [28768],
      IJBSingleTokenPaymentTerminal: [28789],
      IJBSingleTokenPaymentTerminalStore: [28995],
      IJBSplitAllocator: [29010],
      IJBSplitsStore: [29066],
      IJBToken: [29142],
      IJBTokenStore: [29338],
      IJBTokenUriResolver: [29348],
      JBBallotState: [26447],
      JBConstants: [29370],
      JBCurrencies: [29379],
      JBDidPayData: [30261],
      JBDidRedeemData: [30285],
      JBERC20PaymentTerminal3_1: [15078],
      JBFee: [30296],
      JBFixedPointNumber: [29422],
      JBFundAccessConstraints: [30313],
      JBFundingCycle: [30336],
      JBFundingCycleData: [30349],
      JBFundingCycleMetadata: [30390],
      JBFundingCycleMetadataResolver: [30047],
      JBGlobalFundingCycleMetadata: [30399],
      JBGlobalFundingCycleMetadataResolver: [30159],
      JBGroupedSplits: [30409],
      JBOperatable: [21138],
      JBOperations: [30216],
      JBOperatorData: [30419],
      JBPayDelegateAllocation: [30428],
      JBPayoutRedemptionPaymentTerminal3_1: [26319],
      JBProjectMetadata: [30462],
      JBRedemptionDelegateAllocation: [30502],
      JBSingleTokenPaymentTerminal: [26441],
      JBSplit: [30521],
      JBSplitAllocationData: [30538],
      JBTokenAmount: [30549],
      JBTokens: [30235],
      Ownable: [33009],
      PRBMath: [32443],
      PRBMathSD59x18__AbsInputTooSmall: [30574],
      PRBMathSD59x18__CeilOverflow: [30579],
      PRBMathSD59x18__DivInputTooSmall: [30582],
      PRBMathSD59x18__DivOverflow: [30587],
      PRBMathSD59x18__Exp2InputTooBig: [30597],
      PRBMathSD59x18__ExpInputTooBig: [30592],
      PRBMathSD59x18__FloorUnderflow: [30602],
      PRBMathSD59x18__FromIntOverflow: [30607],
      PRBMathSD59x18__FromIntUnderflow: [30612],
      PRBMathSD59x18__GmNegativeProduct: [30619],
      PRBMathSD59x18__GmOverflow: [30626],
      PRBMathSD59x18__LogInputTooSmall: [30631],
      PRBMathSD59x18__MulInputTooSmall: [30634],
      PRBMathSD59x18__MulOverflow: [30639],
      PRBMathSD59x18__PowuOverflow: [30644],
      PRBMathSD59x18__SqrtNegativeInput: [30649],
      PRBMathSD59x18__SqrtOverflow: [30654],
      PRBMathUD60x18__AddOverflow: [30661],
      PRBMathUD60x18__CeilOverflow: [30666],
      PRBMathUD60x18__Exp2InputTooBig: [30676],
      PRBMathUD60x18__ExpInputTooBig: [30671],
      PRBMathUD60x18__FromUintOverflow: [30681],
      PRBMathUD60x18__GmOverflow: [30688],
      PRBMathUD60x18__LogInputTooSmall: [30693],
      PRBMathUD60x18__SqrtOverflow: [30698],
      PRBMathUD60x18__SubUnderflow: [30705],
      PRBMath__MulDivFixedPointOverflow: [30556],
      PRBMath__MulDivOverflow: [30563],
      PRBMath__MulDivSignedInputTooSmall: [30566],
      PRBMath__MulDivSignedOverflow: [30571],
      SafeERC20: [35964],
    },
    nodeType: 'SourceUnit',
    src: '32:4505:21',
    nodes: [
      {
        id: 14925,
        nodeType: 'PragmaDirective',
        src: '32:24:21',
        nodes: [],
        literals: ['solidity', '^', '0.8', '.16'],
      },
      {
        id: 14926,
        nodeType: 'ImportDirective',
        src: '58:75:21',
        nodes: [],
        absolutePath:
          'lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol',
        file: '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol',
        nameLocation: '-1:-1:-1',
        scope: 15079,
        sourceUnit: 35553,
        symbolAliases: [],
        unitAlias: '',
      },
      {
        id: 14927,
        nodeType: 'ImportDirective',
        src: '134:65:21',
        nodes: [],
        absolutePath:
          'lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol',
        file: '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol',
        nameLocation: '-1:-1:-1',
        scope: 15079,
        sourceUnit: 35965,
        symbolAliases: [],
        unitAlias: '',
      },
      {
        id: 14928,
        nodeType: 'ImportDirective',
        src: '200:61:21',
        nodes: [],
        absolutePath:
          'lib/juice-contracts-v3/contracts/abstract/JBPayoutRedemptionPaymentTerminal3_1.sol',
        file: './abstract/JBPayoutRedemptionPaymentTerminal3_1.sol',
        nameLocation: '-1:-1:-1',
        scope: 15079,
        sourceUnit: 26320,
        symbolAliases: [],
        unitAlias: '',
      },
      {
        id: 15078,
        nodeType: 'ContractDefinition',
        src: '518:4018:21',
        nodes: [
          {
            id: 14935,
            nodeType: 'UsingForDirective',
            src: '597:27:21',
            nodes: [],
            global: false,
            libraryName: {
              id: 14932,
              name: 'SafeERC20',
              nameLocations: ['603:9:21'],
              nodeType: 'IdentifierPath',
              referencedDeclaration: 35964,
              src: '603:9:21',
            },
            typeName: {
              id: 14934,
              nodeType: 'UserDefinedTypeName',
              pathNode: {
                id: 14933,
                name: 'IERC20',
                nameLocations: ['617:6:21'],
                nodeType: 'IdentifierPath',
                referencedDeclaration: 34622,
                src: '617:6:21',
              },
              referencedDeclaration: 34622,
              src: '617:6:21',
              typeDescriptions: {
                typeIdentifier: 't_contract$_IERC20_$34622',
                typeString: 'contract IERC20',
              },
            },
          },
          {
            id: 14953,
            nodeType: 'FunctionDefinition',
            src: '1044:117:21',
            nodes: [],
            body: {
              id: 14952,
              nodeType: 'Block',
              src: '1105:56:21',
              nodes: [],
              statements: [
                {
                  expression: {
                    arguments: [
                      {
                        arguments: [
                          {
                            id: 14948,
                            name: 'this',
                            nodeType: 'Identifier',
                            overloadedDeclarations: [],
                            referencedDeclaration: -28,
                            src: '1150:4:21',
                            typeDescriptions: {
                              typeIdentifier:
                                't_contract$_JBERC20PaymentTerminal3_1_$15078',
                              typeString: 'contract JBERC20PaymentTerminal3_1',
                            },
                          },
                        ],
                        expression: {
                          argumentTypes: [
                            {
                              typeIdentifier:
                                't_contract$_JBERC20PaymentTerminal3_1_$15078',
                              typeString: 'contract JBERC20PaymentTerminal3_1',
                            },
                          ],
                          id: 14947,
                          isConstant: false,
                          isLValue: false,
                          isPure: true,
                          lValueRequested: false,
                          nodeType: 'ElementaryTypeNameExpression',
                          src: '1142:7:21',
                          typeDescriptions: {
                            typeIdentifier: 't_type$_t_address_$',
                            typeString: 'type(address)',
                          },
                          typeName: {
                            id: 14946,
                            name: 'address',
                            nodeType: 'ElementaryTypeName',
                            src: '1142:7:21',
                            typeDescriptions: {},
                          },
                        },
                        id: 14949,
                        isConstant: false,
                        isLValue: false,
                        isPure: false,
                        kind: 'typeConversion',
                        lValueRequested: false,
                        nameLocations: [],
                        names: [],
                        nodeType: 'FunctionCall',
                        src: '1142:13:21',
                        tryCall: false,
                        typeDescriptions: {
                          typeIdentifier: 't_address',
                          typeString: 'address',
                        },
                      },
                    ],
                    expression: {
                      argumentTypes: [
                        {
                          typeIdentifier: 't_address',
                          typeString: 'address',
                        },
                      ],
                      expression: {
                        arguments: [
                          {
                            id: 14943,
                            name: 'token',
                            nodeType: 'Identifier',
                            overloadedDeclarations: [],
                            referencedDeclaration: 26332,
                            src: '1125:5:21',
                            typeDescriptions: {
                              typeIdentifier: 't_address',
                              typeString: 'address',
                            },
                          },
                        ],
                        expression: {
                          argumentTypes: [
                            {
                              typeIdentifier: 't_address',
                              typeString: 'address',
                            },
                          ],
                          id: 14942,
                          name: 'IERC20',
                          nodeType: 'Identifier',
                          overloadedDeclarations: [],
                          referencedDeclaration: 34622,
                          src: '1118:6:21',
                          typeDescriptions: {
                            typeIdentifier:
                              't_type$_t_contract$_IERC20_$34622_$',
                            typeString: 'type(contract IERC20)',
                          },
                        },
                        id: 14944,
                        isConstant: false,
                        isLValue: false,
                        isPure: false,
                        kind: 'typeConversion',
                        lValueRequested: false,
                        nameLocations: [],
                        names: [],
                        nodeType: 'FunctionCall',
                        src: '1118:13:21',
                        tryCall: false,
                        typeDescriptions: {
                          typeIdentifier: 't_contract$_IERC20_$34622',
                          typeString: 'contract IERC20',
                        },
                      },
                      id: 14945,
                      isConstant: false,
                      isLValue: false,
                      isPure: false,
                      lValueRequested: false,
                      memberLocation: '1132:9:21',
                      memberName: 'balanceOf',
                      nodeType: 'MemberAccess',
                      referencedDeclaration: 34579,
                      src: '1118:23:21',
                      typeDescriptions: {
                        typeIdentifier:
                          't_function_external_view$_t_address_$returns$_t_uint256_$',
                        typeString:
                          'function (address) view external returns (uint256)',
                      },
                    },
                    id: 14950,
                    isConstant: false,
                    isLValue: false,
                    isPure: false,
                    kind: 'functionCall',
                    lValueRequested: false,
                    nameLocations: [],
                    names: [],
                    nodeType: 'FunctionCall',
                    src: '1118:38:21',
                    tryCall: false,
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  functionReturnParameters: 14941,
                  id: 14951,
                  nodeType: 'Return',
                  src: '1111:45:21',
                },
              ],
            },
            baseFunctions: [23887],
            documentation: {
              id: 14936,
              nodeType: 'StructuredDocumentation',
              src: '857:184:21',
              text: "@notice\nChecks the balance of tokens in this contract.\n@return The contract's balance, as a fixed point number with the same amount of decimals as this terminal.",
            },
            implemented: true,
            kind: 'function',
            modifiers: [],
            name: '_balance',
            nameLocation: '1053:8:21',
            overrides: {
              id: 14938,
              nodeType: 'OverrideSpecifier',
              overrides: [],
              src: '1078:8:21',
            },
            parameters: {
              id: 14937,
              nodeType: 'ParameterList',
              parameters: [],
              src: '1061:2:21',
            },
            returnParameters: {
              id: 14941,
              nodeType: 'ParameterList',
              parameters: [
                {
                  constant: false,
                  id: 14940,
                  mutability: 'mutable',
                  name: '',
                  nameLocation: '-1:-1:-1',
                  nodeType: 'VariableDeclaration',
                  scope: 14953,
                  src: '1096:7:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_uint256',
                    typeString: 'uint256',
                  },
                  typeName: {
                    id: 14939,
                    name: 'uint256',
                    nodeType: 'ElementaryTypeName',
                    src: '1096:7:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  visibility: 'internal',
                },
              ],
              src: '1095:9:21',
            },
            scope: 15078,
            stateMutability: 'view',
            virtual: false,
            visibility: 'internal',
          },
          {
            id: 15006,
            nodeType: 'FunctionDefinition',
            src: '2246:687:21',
            nodes: [],
            body: {
              id: 15005,
              nodeType: 'Block',
              src: '2927:6:21',
              nodes: [],
              statements: [],
            },
            documentation: {
              id: 14954,
              nodeType: 'StructuredDocumentation',
              src: '1394:849:21',
              text: "@param _token The token that this terminal manages.\n@param _currency The currency that this terminal's token adheres to for price feeds.\n@param _baseWeightCurrency The currency to base token issuance on.\n@param _payoutSplitsGroup The group that denotes payout splits from this terminal in the splits store.\n@param _operatorStore A contract storing operator assignments.\n@param _projects A contract which mints ERC-721's that represent project ownership and transfers.\n@param _directory A contract storing directories of terminals and controllers for each project.\n@param _splitsStore A contract that stores splits for each project.\n@param _prices A contract that exposes price feeds.\n@param _store A contract that stores the terminal's data.\n@param _owner The address that will own this contract.",
            },
            implemented: true,
            kind: 'constructor',
            modifiers: [
              {
                arguments: [
                  {
                    arguments: [
                      {
                        id: 14988,
                        name: '_token',
                        nodeType: 'Identifier',
                        overloadedDeclarations: [],
                        referencedDeclaration: 14957,
                        src: '2649:6:21',
                        typeDescriptions: {
                          typeIdentifier: 't_contract$_IERC20Metadata_$35552',
                          typeString: 'contract IERC20Metadata',
                        },
                      },
                    ],
                    expression: {
                      argumentTypes: [
                        {
                          typeIdentifier: 't_contract$_IERC20Metadata_$35552',
                          typeString: 'contract IERC20Metadata',
                        },
                      ],
                      id: 14987,
                      isConstant: false,
                      isLValue: false,
                      isPure: true,
                      lValueRequested: false,
                      nodeType: 'ElementaryTypeNameExpression',
                      src: '2641:7:21',
                      typeDescriptions: {
                        typeIdentifier: 't_type$_t_address_$',
                        typeString: 'type(address)',
                      },
                      typeName: {
                        id: 14986,
                        name: 'address',
                        nodeType: 'ElementaryTypeName',
                        src: '2641:7:21',
                        typeDescriptions: {},
                      },
                    },
                    id: 14989,
                    isConstant: false,
                    isLValue: false,
                    isPure: false,
                    kind: 'typeConversion',
                    lValueRequested: false,
                    nameLocations: [],
                    names: [],
                    nodeType: 'FunctionCall',
                    src: '2641:15:21',
                    tryCall: false,
                    typeDescriptions: {
                      typeIdentifier: 't_address',
                      typeString: 'address',
                    },
                  },
                  {
                    arguments: [],
                    expression: {
                      argumentTypes: [],
                      expression: {
                        id: 14990,
                        name: '_token',
                        nodeType: 'Identifier',
                        overloadedDeclarations: [],
                        referencedDeclaration: 14957,
                        src: '2664:6:21',
                        typeDescriptions: {
                          typeIdentifier: 't_contract$_IERC20Metadata_$35552',
                          typeString: 'contract IERC20Metadata',
                        },
                      },
                      id: 14991,
                      isConstant: false,
                      isLValue: false,
                      isPure: false,
                      lValueRequested: false,
                      memberLocation: '2671:8:21',
                      memberName: 'decimals',
                      nodeType: 'MemberAccess',
                      referencedDeclaration: 35551,
                      src: '2664:15:21',
                      typeDescriptions: {
                        typeIdentifier:
                          't_function_external_view$__$returns$_t_uint8_$',
                        typeString: 'function () view external returns (uint8)',
                      },
                    },
                    id: 14992,
                    isConstant: false,
                    isLValue: false,
                    isPure: false,
                    kind: 'functionCall',
                    lValueRequested: false,
                    nameLocations: [],
                    names: [],
                    nodeType: 'FunctionCall',
                    src: '2664:17:21',
                    tryCall: false,
                    typeDescriptions: {
                      typeIdentifier: 't_uint8',
                      typeString: 'uint8',
                    },
                  },
                  {
                    id: 14993,
                    name: '_currency',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14959,
                    src: '2689:9:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  {
                    id: 14994,
                    name: '_baseWeightCurrency',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14961,
                    src: '2706:19:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  {
                    id: 14995,
                    name: '_payoutSplitsGroup',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14963,
                    src: '2733:18:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  {
                    id: 14996,
                    name: '_operatorStore',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14966,
                    src: '2759:14:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBOperatorStore_$27773',
                      typeString: 'contract IJBOperatorStore',
                    },
                  },
                  {
                    id: 14997,
                    name: '_projects',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14969,
                    src: '2781:9:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBProjects_$28729',
                      typeString: 'contract IJBProjects',
                    },
                  },
                  {
                    id: 14998,
                    name: '_directory',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14972,
                    src: '2798:10:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBDirectory_$27434',
                      typeString: 'contract IJBDirectory',
                    },
                  },
                  {
                    id: 14999,
                    name: '_splitsStore',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14975,
                    src: '2816:12:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBSplitsStore_$29066',
                      typeString: 'contract IJBSplitsStore',
                    },
                  },
                  {
                    id: 15000,
                    name: '_prices',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14978,
                    src: '2836:7:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBPrices_$28650',
                      typeString: 'contract IJBPrices',
                    },
                  },
                  {
                    id: 15001,
                    name: '_store',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14981,
                    src: '2851:6:21',
                    typeDescriptions: {
                      typeIdentifier:
                        't_contract$_IJBSingleTokenPaymentTerminalStore_$28995',
                      typeString: 'contract IJBSingleTokenPaymentTerminalStore',
                    },
                  },
                  {
                    id: 15002,
                    name: '_owner',
                    nodeType: 'Identifier',
                    overloadedDeclarations: [],
                    referencedDeclaration: 14983,
                    src: '2865:6:21',
                    typeDescriptions: {
                      typeIdentifier: 't_address',
                      typeString: 'address',
                    },
                  },
                ],
                id: 15003,
                kind: 'baseConstructorSpecifier',
                modifierName: {
                  id: 14985,
                  name: 'JBPayoutRedemptionPaymentTerminal3_1',
                  nameLocations: ['2597:36:21'],
                  nodeType: 'IdentifierPath',
                  referencedDeclaration: 26319,
                  src: '2597:36:21',
                },
                nodeType: 'ModifierInvocation',
                src: '2597:280:21',
              },
            ],
            name: '',
            nameLocation: '-1:-1:-1',
            parameters: {
              id: 14984,
              nodeType: 'ParameterList',
              parameters: [
                {
                  constant: false,
                  id: 14957,
                  mutability: 'mutable',
                  name: '_token',
                  nameLocation: '2278:6:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2263:21:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_contract$_IERC20Metadata_$35552',
                    typeString: 'contract IERC20Metadata',
                  },
                  typeName: {
                    id: 14956,
                    nodeType: 'UserDefinedTypeName',
                    pathNode: {
                      id: 14955,
                      name: 'IERC20Metadata',
                      nameLocations: ['2263:14:21'],
                      nodeType: 'IdentifierPath',
                      referencedDeclaration: 35552,
                      src: '2263:14:21',
                    },
                    referencedDeclaration: 35552,
                    src: '2263:14:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IERC20Metadata_$35552',
                      typeString: 'contract IERC20Metadata',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14959,
                  mutability: 'mutable',
                  name: '_currency',
                  nameLocation: '2298:9:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2290:17:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_uint256',
                    typeString: 'uint256',
                  },
                  typeName: {
                    id: 14958,
                    name: 'uint256',
                    nodeType: 'ElementaryTypeName',
                    src: '2290:7:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14961,
                  mutability: 'mutable',
                  name: '_baseWeightCurrency',
                  nameLocation: '2321:19:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2313:27:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_uint256',
                    typeString: 'uint256',
                  },
                  typeName: {
                    id: 14960,
                    name: 'uint256',
                    nodeType: 'ElementaryTypeName',
                    src: '2313:7:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14963,
                  mutability: 'mutable',
                  name: '_payoutSplitsGroup',
                  nameLocation: '2354:18:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2346:26:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_uint256',
                    typeString: 'uint256',
                  },
                  typeName: {
                    id: 14962,
                    name: 'uint256',
                    nodeType: 'ElementaryTypeName',
                    src: '2346:7:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14966,
                  mutability: 'mutable',
                  name: '_operatorStore',
                  nameLocation: '2395:14:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2378:31:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_contract$_IJBOperatorStore_$27773',
                    typeString: 'contract IJBOperatorStore',
                  },
                  typeName: {
                    id: 14965,
                    nodeType: 'UserDefinedTypeName',
                    pathNode: {
                      id: 14964,
                      name: 'IJBOperatorStore',
                      nameLocations: ['2378:16:21'],
                      nodeType: 'IdentifierPath',
                      referencedDeclaration: 27773,
                      src: '2378:16:21',
                    },
                    referencedDeclaration: 27773,
                    src: '2378:16:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBOperatorStore_$27773',
                      typeString: 'contract IJBOperatorStore',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14969,
                  mutability: 'mutable',
                  name: '_projects',
                  nameLocation: '2427:9:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2415:21:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_contract$_IJBProjects_$28729',
                    typeString: 'contract IJBProjects',
                  },
                  typeName: {
                    id: 14968,
                    nodeType: 'UserDefinedTypeName',
                    pathNode: {
                      id: 14967,
                      name: 'IJBProjects',
                      nameLocations: ['2415:11:21'],
                      nodeType: 'IdentifierPath',
                      referencedDeclaration: 28729,
                      src: '2415:11:21',
                    },
                    referencedDeclaration: 28729,
                    src: '2415:11:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBProjects_$28729',
                      typeString: 'contract IJBProjects',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14972,
                  mutability: 'mutable',
                  name: '_directory',
                  nameLocation: '2455:10:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2442:23:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_contract$_IJBDirectory_$27434',
                    typeString: 'contract IJBDirectory',
                  },
                  typeName: {
                    id: 14971,
                    nodeType: 'UserDefinedTypeName',
                    pathNode: {
                      id: 14970,
                      name: 'IJBDirectory',
                      nameLocations: ['2442:12:21'],
                      nodeType: 'IdentifierPath',
                      referencedDeclaration: 27434,
                      src: '2442:12:21',
                    },
                    referencedDeclaration: 27434,
                    src: '2442:12:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBDirectory_$27434',
                      typeString: 'contract IJBDirectory',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14975,
                  mutability: 'mutable',
                  name: '_splitsStore',
                  nameLocation: '2486:12:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2471:27:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_contract$_IJBSplitsStore_$29066',
                    typeString: 'contract IJBSplitsStore',
                  },
                  typeName: {
                    id: 14974,
                    nodeType: 'UserDefinedTypeName',
                    pathNode: {
                      id: 14973,
                      name: 'IJBSplitsStore',
                      nameLocations: ['2471:14:21'],
                      nodeType: 'IdentifierPath',
                      referencedDeclaration: 29066,
                      src: '2471:14:21',
                    },
                    referencedDeclaration: 29066,
                    src: '2471:14:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBSplitsStore_$29066',
                      typeString: 'contract IJBSplitsStore',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14978,
                  mutability: 'mutable',
                  name: '_prices',
                  nameLocation: '2514:7:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2504:17:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_contract$_IJBPrices_$28650',
                    typeString: 'contract IJBPrices',
                  },
                  typeName: {
                    id: 14977,
                    nodeType: 'UserDefinedTypeName',
                    pathNode: {
                      id: 14976,
                      name: 'IJBPrices',
                      nameLocations: ['2504:9:21'],
                      nodeType: 'IdentifierPath',
                      referencedDeclaration: 28650,
                      src: '2504:9:21',
                    },
                    referencedDeclaration: 28650,
                    src: '2504:9:21',
                    typeDescriptions: {
                      typeIdentifier: 't_contract$_IJBPrices_$28650',
                      typeString: 'contract IJBPrices',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14981,
                  mutability: 'mutable',
                  name: '_store',
                  nameLocation: '2562:6:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2527:41:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier:
                      't_contract$_IJBSingleTokenPaymentTerminalStore_$28995',
                    typeString: 'contract IJBSingleTokenPaymentTerminalStore',
                  },
                  typeName: {
                    id: 14980,
                    nodeType: 'UserDefinedTypeName',
                    pathNode: {
                      id: 14979,
                      name: 'IJBSingleTokenPaymentTerminalStore',
                      nameLocations: ['2527:34:21'],
                      nodeType: 'IdentifierPath',
                      referencedDeclaration: 28995,
                      src: '2527:34:21',
                    },
                    referencedDeclaration: 28995,
                    src: '2527:34:21',
                    typeDescriptions: {
                      typeIdentifier:
                        't_contract$_IJBSingleTokenPaymentTerminalStore_$28995',
                      typeString: 'contract IJBSingleTokenPaymentTerminalStore',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 14983,
                  mutability: 'mutable',
                  name: '_owner',
                  nameLocation: '2582:6:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15006,
                  src: '2574:14:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_address',
                    typeString: 'address',
                  },
                  typeName: {
                    id: 14982,
                    name: 'address',
                    nodeType: 'ElementaryTypeName',
                    src: '2574:7:21',
                    stateMutability: 'nonpayable',
                    typeDescriptions: {
                      typeIdentifier: 't_address',
                      typeString: 'address',
                    },
                  },
                  visibility: 'internal',
                },
              ],
              src: '2257:335:21',
            },
            returnParameters: {
              id: 15004,
              nodeType: 'ParameterList',
              parameters: [],
              src: '2927:0:21',
            },
            scope: 15078,
            stateMutability: 'nonpayable',
            virtual: false,
            visibility: 'public',
          },
          {
            id: 15041,
            nodeType: 'FunctionDefinition',
            src: '3466:252:21',
            nodes: [],
            body: {
              id: 15040,
              nodeType: 'Block',
              src: '3576:142:21',
              nodes: [],
              statements: [
                {
                  expression: {
                    condition: {
                      commonType: {
                        typeIdentifier: 't_address',
                        typeString: 'address',
                      },
                      id: 15022,
                      isConstant: false,
                      isLValue: false,
                      isPure: false,
                      lValueRequested: false,
                      leftExpression: {
                        id: 15017,
                        name: '_from',
                        nodeType: 'Identifier',
                        overloadedDeclarations: [],
                        referencedDeclaration: 15009,
                        src: '3582:5:21',
                        typeDescriptions: {
                          typeIdentifier: 't_address',
                          typeString: 'address',
                        },
                      },
                      nodeType: 'BinaryOperation',
                      operator: '==',
                      rightExpression: {
                        arguments: [
                          {
                            id: 15020,
                            name: 'this',
                            nodeType: 'Identifier',
                            overloadedDeclarations: [],
                            referencedDeclaration: -28,
                            src: '3599:4:21',
                            typeDescriptions: {
                              typeIdentifier:
                                't_contract$_JBERC20PaymentTerminal3_1_$15078',
                              typeString: 'contract JBERC20PaymentTerminal3_1',
                            },
                          },
                        ],
                        expression: {
                          argumentTypes: [
                            {
                              typeIdentifier:
                                't_contract$_JBERC20PaymentTerminal3_1_$15078',
                              typeString: 'contract JBERC20PaymentTerminal3_1',
                            },
                          ],
                          id: 15019,
                          isConstant: false,
                          isLValue: false,
                          isPure: true,
                          lValueRequested: false,
                          nodeType: 'ElementaryTypeNameExpression',
                          src: '3591:7:21',
                          typeDescriptions: {
                            typeIdentifier: 't_type$_t_address_$',
                            typeString: 'type(address)',
                          },
                          typeName: {
                            id: 15018,
                            name: 'address',
                            nodeType: 'ElementaryTypeName',
                            src: '3591:7:21',
                            typeDescriptions: {},
                          },
                        },
                        id: 15021,
                        isConstant: false,
                        isLValue: false,
                        isPure: false,
                        kind: 'typeConversion',
                        lValueRequested: false,
                        nameLocations: [],
                        names: [],
                        nodeType: 'FunctionCall',
                        src: '3591:13:21',
                        tryCall: false,
                        typeDescriptions: {
                          typeIdentifier: 't_address',
                          typeString: 'address',
                        },
                      },
                      src: '3582:22:21',
                      typeDescriptions: {
                        typeIdentifier: 't_bool',
                        typeString: 'bool',
                      },
                    },
                    falseExpression: {
                      arguments: [
                        {
                          id: 15034,
                          name: '_from',
                          nodeType: 'Identifier',
                          overloadedDeclarations: [],
                          referencedDeclaration: 15009,
                          src: '3693:5:21',
                          typeDescriptions: {
                            typeIdentifier: 't_address',
                            typeString: 'address',
                          },
                        },
                        {
                          id: 15035,
                          name: '_to',
                          nodeType: 'Identifier',
                          overloadedDeclarations: [],
                          referencedDeclaration: 15011,
                          src: '3700:3:21',
                          typeDescriptions: {
                            typeIdentifier: 't_address_payable',
                            typeString: 'address payable',
                          },
                        },
                        {
                          id: 15036,
                          name: '_amount',
                          nodeType: 'Identifier',
                          overloadedDeclarations: [],
                          referencedDeclaration: 15013,
                          src: '3705:7:21',
                          typeDescriptions: {
                            typeIdentifier: 't_uint256',
                            typeString: 'uint256',
                          },
                        },
                      ],
                      expression: {
                        argumentTypes: [
                          {
                            typeIdentifier: 't_address',
                            typeString: 'address',
                          },
                          {
                            typeIdentifier: 't_address_payable',
                            typeString: 'address payable',
                          },
                          {
                            typeIdentifier: 't_uint256',
                            typeString: 'uint256',
                          },
                        ],
                        expression: {
                          arguments: [
                            {
                              id: 15031,
                              name: 'token',
                              nodeType: 'Identifier',
                              overloadedDeclarations: [],
                              referencedDeclaration: 26332,
                              src: '3669:5:21',
                              typeDescriptions: {
                                typeIdentifier: 't_address',
                                typeString: 'address',
                              },
                            },
                          ],
                          expression: {
                            argumentTypes: [
                              {
                                typeIdentifier: 't_address',
                                typeString: 'address',
                              },
                            ],
                            id: 15030,
                            name: 'IERC20',
                            nodeType: 'Identifier',
                            overloadedDeclarations: [],
                            referencedDeclaration: 34622,
                            src: '3662:6:21',
                            typeDescriptions: {
                              typeIdentifier:
                                't_type$_t_contract$_IERC20_$34622_$',
                              typeString: 'type(contract IERC20)',
                            },
                          },
                          id: 15032,
                          isConstant: false,
                          isLValue: false,
                          isPure: false,
                          kind: 'typeConversion',
                          lValueRequested: false,
                          nameLocations: [],
                          names: [],
                          nodeType: 'FunctionCall',
                          src: '3662:13:21',
                          tryCall: false,
                          typeDescriptions: {
                            typeIdentifier: 't_contract$_IERC20_$34622',
                            typeString: 'contract IERC20',
                          },
                        },
                        id: 15033,
                        isConstant: false,
                        isLValue: false,
                        isPure: false,
                        lValueRequested: false,
                        memberLocation: '3676:16:21',
                        memberName: 'safeTransferFrom',
                        nodeType: 'MemberAccess',
                        referencedDeclaration: 35648,
                        src: '3662:30:21',
                        typeDescriptions: {
                          typeIdentifier:
                            't_function_internal_nonpayable$_t_contract$_IERC20_$34622_$_t_address_$_t_address_$_t_uint256_$returns$__$bound_to$_t_contract$_IERC20_$34622_$',
                          typeString:
                            'function (contract IERC20,address,address,uint256)',
                        },
                      },
                      id: 15037,
                      isConstant: false,
                      isLValue: false,
                      isPure: false,
                      kind: 'functionCall',
                      lValueRequested: false,
                      nameLocations: [],
                      names: [],
                      nodeType: 'FunctionCall',
                      src: '3662:51:21',
                      tryCall: false,
                      typeDescriptions: {
                        typeIdentifier: 't_tuple$__$',
                        typeString: 'tuple()',
                      },
                    },
                    id: 15038,
                    isConstant: false,
                    isLValue: false,
                    isPure: false,
                    lValueRequested: false,
                    nodeType: 'Conditional',
                    src: '3582:131:21',
                    trueExpression: {
                      arguments: [
                        {
                          id: 15027,
                          name: '_to',
                          nodeType: 'Identifier',
                          overloadedDeclarations: [],
                          referencedDeclaration: 15011,
                          src: '3640:3:21',
                          typeDescriptions: {
                            typeIdentifier: 't_address_payable',
                            typeString: 'address payable',
                          },
                        },
                        {
                          id: 15028,
                          name: '_amount',
                          nodeType: 'Identifier',
                          overloadedDeclarations: [],
                          referencedDeclaration: 15013,
                          src: '3645:7:21',
                          typeDescriptions: {
                            typeIdentifier: 't_uint256',
                            typeString: 'uint256',
                          },
                        },
                      ],
                      expression: {
                        argumentTypes: [
                          {
                            typeIdentifier: 't_address_payable',
                            typeString: 'address payable',
                          },
                          {
                            typeIdentifier: 't_uint256',
                            typeString: 'uint256',
                          },
                        ],
                        expression: {
                          arguments: [
                            {
                              id: 15024,
                              name: 'token',
                              nodeType: 'Identifier',
                              overloadedDeclarations: [],
                              referencedDeclaration: 26332,
                              src: '3620:5:21',
                              typeDescriptions: {
                                typeIdentifier: 't_address',
                                typeString: 'address',
                              },
                            },
                          ],
                          expression: {
                            argumentTypes: [
                              {
                                typeIdentifier: 't_address',
                                typeString: 'address',
                              },
                            ],
                            id: 15023,
                            name: 'IERC20',
                            nodeType: 'Identifier',
                            overloadedDeclarations: [],
                            referencedDeclaration: 34622,
                            src: '3613:6:21',
                            typeDescriptions: {
                              typeIdentifier:
                                't_type$_t_contract$_IERC20_$34622_$',
                              typeString: 'type(contract IERC20)',
                            },
                          },
                          id: 15025,
                          isConstant: false,
                          isLValue: false,
                          isPure: false,
                          kind: 'typeConversion',
                          lValueRequested: false,
                          nameLocations: [],
                          names: [],
                          nodeType: 'FunctionCall',
                          src: '3613:13:21',
                          tryCall: false,
                          typeDescriptions: {
                            typeIdentifier: 't_contract$_IERC20_$34622',
                            typeString: 'contract IERC20',
                          },
                        },
                        id: 15026,
                        isConstant: false,
                        isLValue: false,
                        isPure: false,
                        lValueRequested: false,
                        memberLocation: '3627:12:21',
                        memberName: 'safeTransfer',
                        nodeType: 'MemberAccess',
                        referencedDeclaration: 35621,
                        src: '3613:26:21',
                        typeDescriptions: {
                          typeIdentifier:
                            't_function_internal_nonpayable$_t_contract$_IERC20_$34622_$_t_address_$_t_uint256_$returns$__$bound_to$_t_contract$_IERC20_$34622_$',
                          typeString:
                            'function (contract IERC20,address,uint256)',
                        },
                      },
                      id: 15029,
                      isConstant: false,
                      isLValue: false,
                      isPure: false,
                      kind: 'functionCall',
                      lValueRequested: false,
                      nameLocations: [],
                      names: [],
                      nodeType: 'FunctionCall',
                      src: '3613:40:21',
                      tryCall: false,
                      typeDescriptions: {
                        typeIdentifier: 't_tuple$__$',
                        typeString: 'tuple()',
                      },
                    },
                    typeDescriptions: {
                      typeIdentifier: 't_tuple$__$',
                      typeString: 'tuple()',
                    },
                  },
                  id: 15039,
                  nodeType: 'ExpressionStatement',
                  src: '3582:131:21',
                },
              ],
            },
            baseFunctions: [24533],
            documentation: {
              id: 15007,
              nodeType: 'StructuredDocumentation',
              src: '3166:297:21',
              text: '@notice\nTransfers tokens.\n@param _from The address from which the transfer should originate.\n@param _to The address to which the transfer should go.\n@param _amount The amount of the transfer, as a fixed point number with the same number of decimals as this terminal.',
            },
            implemented: true,
            kind: 'function',
            modifiers: [],
            name: '_transferFrom',
            nameLocation: '3475:13:21',
            overrides: {
              id: 15015,
              nodeType: 'OverrideSpecifier',
              overrides: [],
              src: '3567:8:21',
            },
            parameters: {
              id: 15014,
              nodeType: 'ParameterList',
              parameters: [
                {
                  constant: false,
                  id: 15009,
                  mutability: 'mutable',
                  name: '_from',
                  nameLocation: '3502:5:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15041,
                  src: '3494:13:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_address',
                    typeString: 'address',
                  },
                  typeName: {
                    id: 15008,
                    name: 'address',
                    nodeType: 'ElementaryTypeName',
                    src: '3494:7:21',
                    stateMutability: 'nonpayable',
                    typeDescriptions: {
                      typeIdentifier: 't_address',
                      typeString: 'address',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 15011,
                  mutability: 'mutable',
                  name: '_to',
                  nameLocation: '3529:3:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15041,
                  src: '3513:19:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_address_payable',
                    typeString: 'address payable',
                  },
                  typeName: {
                    id: 15010,
                    name: 'address',
                    nodeType: 'ElementaryTypeName',
                    src: '3513:15:21',
                    stateMutability: 'payable',
                    typeDescriptions: {
                      typeIdentifier: 't_address_payable',
                      typeString: 'address payable',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 15013,
                  mutability: 'mutable',
                  name: '_amount',
                  nameLocation: '3546:7:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15041,
                  src: '3538:15:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_uint256',
                    typeString: 'uint256',
                  },
                  typeName: {
                    id: 15012,
                    name: 'uint256',
                    nodeType: 'ElementaryTypeName',
                    src: '3538:7:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  visibility: 'internal',
                },
              ],
              src: '3488:69:21',
            },
            returnParameters: {
              id: 15016,
              nodeType: 'ParameterList',
              parameters: [],
              src: '3576:0:21',
            },
            scope: 15078,
            stateMutability: 'nonpayable',
            virtual: false,
            visibility: 'internal',
          },
          {
            id: 15059,
            nodeType: 'FunctionDefinition',
            src: '4001:135:21',
            nodes: [],
            body: {
              id: 15058,
              nodeType: 'Block',
              src: '4076:60:21',
              nodes: [],
              statements: [
                {
                  expression: {
                    arguments: [
                      {
                        id: 15054,
                        name: '_to',
                        nodeType: 'Identifier',
                        overloadedDeclarations: [],
                        referencedDeclaration: 15044,
                        src: '4118:3:21',
                        typeDescriptions: {
                          typeIdentifier: 't_address',
                          typeString: 'address',
                        },
                      },
                      {
                        id: 15055,
                        name: '_amount',
                        nodeType: 'Identifier',
                        overloadedDeclarations: [],
                        referencedDeclaration: 15046,
                        src: '4123:7:21',
                        typeDescriptions: {
                          typeIdentifier: 't_uint256',
                          typeString: 'uint256',
                        },
                      },
                    ],
                    expression: {
                      argumentTypes: [
                        {
                          typeIdentifier: 't_address',
                          typeString: 'address',
                        },
                        {
                          typeIdentifier: 't_uint256',
                          typeString: 'uint256',
                        },
                      ],
                      expression: {
                        arguments: [
                          {
                            id: 15051,
                            name: 'token',
                            nodeType: 'Identifier',
                            overloadedDeclarations: [],
                            referencedDeclaration: 26332,
                            src: '4089:5:21',
                            typeDescriptions: {
                              typeIdentifier: 't_address',
                              typeString: 'address',
                            },
                          },
                        ],
                        expression: {
                          argumentTypes: [
                            {
                              typeIdentifier: 't_address',
                              typeString: 'address',
                            },
                          ],
                          id: 15050,
                          name: 'IERC20',
                          nodeType: 'Identifier',
                          overloadedDeclarations: [],
                          referencedDeclaration: 34622,
                          src: '4082:6:21',
                          typeDescriptions: {
                            typeIdentifier:
                              't_type$_t_contract$_IERC20_$34622_$',
                            typeString: 'type(contract IERC20)',
                          },
                        },
                        id: 15052,
                        isConstant: false,
                        isLValue: false,
                        isPure: false,
                        kind: 'typeConversion',
                        lValueRequested: false,
                        nameLocations: [],
                        names: [],
                        nodeType: 'FunctionCall',
                        src: '4082:13:21',
                        tryCall: false,
                        typeDescriptions: {
                          typeIdentifier: 't_contract$_IERC20_$34622',
                          typeString: 'contract IERC20',
                        },
                      },
                      id: 15053,
                      isConstant: false,
                      isLValue: false,
                      isPure: false,
                      lValueRequested: false,
                      memberLocation: '4096:21:21',
                      memberName: 'safeIncreaseAllowance',
                      nodeType: 'MemberAccess',
                      referencedDeclaration: 35729,
                      src: '4082:35:21',
                      typeDescriptions: {
                        typeIdentifier:
                          't_function_internal_nonpayable$_t_contract$_IERC20_$34622_$_t_address_$_t_uint256_$returns$__$bound_to$_t_contract$_IERC20_$34622_$',
                        typeString:
                          'function (contract IERC20,address,uint256)',
                      },
                    },
                    id: 15056,
                    isConstant: false,
                    isLValue: false,
                    isPure: false,
                    kind: 'functionCall',
                    lValueRequested: false,
                    nameLocations: [],
                    names: [],
                    nodeType: 'FunctionCall',
                    src: '4082:49:21',
                    tryCall: false,
                    typeDescriptions: {
                      typeIdentifier: 't_tuple$__$',
                      typeString: 'tuple()',
                    },
                  },
                  id: 15057,
                  nodeType: 'ExpressionStatement',
                  src: '4082:49:21',
                },
              ],
            },
            baseFunctions: [24546],
            documentation: {
              id: 15042,
              nodeType: 'StructuredDocumentation',
              src: '3722:276:21',
              text: '@notice\nLogic to be triggered before transferring tokens from this terminal.\n@param _to The address to which the transfer is going.\n@param _amount The amount of the transfer, as a fixed point number with the same number of decimals as this terminal.',
            },
            implemented: true,
            kind: 'function',
            modifiers: [],
            name: '_beforeTransferTo',
            nameLocation: '4010:17:21',
            overrides: {
              id: 15048,
              nodeType: 'OverrideSpecifier',
              overrides: [],
              src: '4067:8:21',
            },
            parameters: {
              id: 15047,
              nodeType: 'ParameterList',
              parameters: [
                {
                  constant: false,
                  id: 15044,
                  mutability: 'mutable',
                  name: '_to',
                  nameLocation: '4036:3:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15059,
                  src: '4028:11:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_address',
                    typeString: 'address',
                  },
                  typeName: {
                    id: 15043,
                    name: 'address',
                    nodeType: 'ElementaryTypeName',
                    src: '4028:7:21',
                    stateMutability: 'nonpayable',
                    typeDescriptions: {
                      typeIdentifier: 't_address',
                      typeString: 'address',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 15046,
                  mutability: 'mutable',
                  name: '_amount',
                  nameLocation: '4049:7:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15059,
                  src: '4041:15:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_uint256',
                    typeString: 'uint256',
                  },
                  typeName: {
                    id: 15045,
                    name: 'uint256',
                    nodeType: 'ElementaryTypeName',
                    src: '4041:7:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  visibility: 'internal',
                },
              ],
              src: '4027:30:21',
            },
            returnParameters: {
              id: 15049,
              nodeType: 'ParameterList',
              parameters: [],
              src: '4076:0:21',
            },
            scope: 15078,
            stateMutability: 'nonpayable',
            virtual: false,
            visibility: 'internal',
          },
          {
            id: 15077,
            nodeType: 'FunctionDefinition',
            src: '4399:135:21',
            nodes: [],
            body: {
              id: 15076,
              nodeType: 'Block',
              src: '4474:60:21',
              nodes: [],
              statements: [
                {
                  expression: {
                    arguments: [
                      {
                        id: 15072,
                        name: '_to',
                        nodeType: 'Identifier',
                        overloadedDeclarations: [],
                        referencedDeclaration: 15062,
                        src: '4516:3:21',
                        typeDescriptions: {
                          typeIdentifier: 't_address',
                          typeString: 'address',
                        },
                      },
                      {
                        id: 15073,
                        name: '_amount',
                        nodeType: 'Identifier',
                        overloadedDeclarations: [],
                        referencedDeclaration: 15064,
                        src: '4521:7:21',
                        typeDescriptions: {
                          typeIdentifier: 't_uint256',
                          typeString: 'uint256',
                        },
                      },
                    ],
                    expression: {
                      argumentTypes: [
                        {
                          typeIdentifier: 't_address',
                          typeString: 'address',
                        },
                        {
                          typeIdentifier: 't_uint256',
                          typeString: 'uint256',
                        },
                      ],
                      expression: {
                        arguments: [
                          {
                            id: 15069,
                            name: 'token',
                            nodeType: 'Identifier',
                            overloadedDeclarations: [],
                            referencedDeclaration: 26332,
                            src: '4487:5:21',
                            typeDescriptions: {
                              typeIdentifier: 't_address',
                              typeString: 'address',
                            },
                          },
                        ],
                        expression: {
                          argumentTypes: [
                            {
                              typeIdentifier: 't_address',
                              typeString: 'address',
                            },
                          ],
                          id: 15068,
                          name: 'IERC20',
                          nodeType: 'Identifier',
                          overloadedDeclarations: [],
                          referencedDeclaration: 34622,
                          src: '4480:6:21',
                          typeDescriptions: {
                            typeIdentifier:
                              't_type$_t_contract$_IERC20_$34622_$',
                            typeString: 'type(contract IERC20)',
                          },
                        },
                        id: 15070,
                        isConstant: false,
                        isLValue: false,
                        isPure: false,
                        kind: 'typeConversion',
                        lValueRequested: false,
                        nameLocations: [],
                        names: [],
                        nodeType: 'FunctionCall',
                        src: '4480:13:21',
                        tryCall: false,
                        typeDescriptions: {
                          typeIdentifier: 't_contract$_IERC20_$34622',
                          typeString: 'contract IERC20',
                        },
                      },
                      id: 15071,
                      isConstant: false,
                      isLValue: false,
                      isPure: false,
                      lValueRequested: false,
                      memberLocation: '4494:21:21',
                      memberName: 'safeDecreaseAllowance',
                      nodeType: 'MemberAccess',
                      referencedDeclaration: 35774,
                      src: '4480:35:21',
                      typeDescriptions: {
                        typeIdentifier:
                          't_function_internal_nonpayable$_t_contract$_IERC20_$34622_$_t_address_$_t_uint256_$returns$__$bound_to$_t_contract$_IERC20_$34622_$',
                        typeString:
                          'function (contract IERC20,address,uint256)',
                      },
                    },
                    id: 15074,
                    isConstant: false,
                    isLValue: false,
                    isPure: false,
                    kind: 'functionCall',
                    lValueRequested: false,
                    nameLocations: [],
                    names: [],
                    nodeType: 'FunctionCall',
                    src: '4480:49:21',
                    tryCall: false,
                    typeDescriptions: {
                      typeIdentifier: 't_tuple$__$',
                      typeString: 'tuple()',
                    },
                  },
                  id: 15075,
                  nodeType: 'ExpressionStatement',
                  src: '4480:49:21',
                },
              ],
            },
            baseFunctions: [24559],
            documentation: {
              id: 15060,
              nodeType: 'StructuredDocumentation',
              src: '4140:256:21',
              text: '@notice\nLogic to be triggered if a transfer should be undone\n@param _to The address to which the transfer went.\n@param _amount The amount of the transfer, as a fixed point number with the same number of decimals as this terminal.',
            },
            implemented: true,
            kind: 'function',
            modifiers: [],
            name: '_cancelTransferTo',
            nameLocation: '4408:17:21',
            overrides: {
              id: 15066,
              nodeType: 'OverrideSpecifier',
              overrides: [],
              src: '4465:8:21',
            },
            parameters: {
              id: 15065,
              nodeType: 'ParameterList',
              parameters: [
                {
                  constant: false,
                  id: 15062,
                  mutability: 'mutable',
                  name: '_to',
                  nameLocation: '4434:3:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15077,
                  src: '4426:11:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_address',
                    typeString: 'address',
                  },
                  typeName: {
                    id: 15061,
                    name: 'address',
                    nodeType: 'ElementaryTypeName',
                    src: '4426:7:21',
                    stateMutability: 'nonpayable',
                    typeDescriptions: {
                      typeIdentifier: 't_address',
                      typeString: 'address',
                    },
                  },
                  visibility: 'internal',
                },
                {
                  constant: false,
                  id: 15064,
                  mutability: 'mutable',
                  name: '_amount',
                  nameLocation: '4447:7:21',
                  nodeType: 'VariableDeclaration',
                  scope: 15077,
                  src: '4439:15:21',
                  stateVariable: false,
                  storageLocation: 'default',
                  typeDescriptions: {
                    typeIdentifier: 't_uint256',
                    typeString: 'uint256',
                  },
                  typeName: {
                    id: 15063,
                    name: 'uint256',
                    nodeType: 'ElementaryTypeName',
                    src: '4439:7:21',
                    typeDescriptions: {
                      typeIdentifier: 't_uint256',
                      typeString: 'uint256',
                    },
                  },
                  visibility: 'internal',
                },
              ],
              src: '4425:30:21',
            },
            returnParameters: {
              id: 15067,
              nodeType: 'ParameterList',
              parameters: [],
              src: '4474:0:21',
            },
            scope: 15078,
            stateMutability: 'nonpayable',
            virtual: false,
            visibility: 'internal',
          },
        ],
        abstract: false,
        baseContracts: [
          {
            baseName: {
              id: 14930,
              name: 'JBPayoutRedemptionPaymentTerminal3_1',
              nameLocations: ['556:36:21'],
              nodeType: 'IdentifierPath',
              referencedDeclaration: 26319,
              src: '556:36:21',
            },
            id: 14931,
            nodeType: 'InheritanceSpecifier',
            src: '556:36:21',
          },
        ],
        canonicalName: 'JBERC20PaymentTerminal3_1',
        contractDependencies: [],
        contractKind: 'contract',
        documentation: {
          id: 14929,
          nodeType: 'StructuredDocumentation',
          src: '263:254:21',
          text: "@notice \nManages the inflows and outflows of an ERC-20 token.\n@dev\nInherits from -\nJBPayoutRedemptionPaymentTerminal: Includes convenience functionality for checking a message sender's permissions before executing certain transactions.",
        },
        fullyImplemented: true,
        linearizedBaseContracts: [
          15078, 26319, 28556, 27462, 28768, 26493, 28596, 33009, 39046, 21138,
          27705, 26441, 28789, 27858, 40220, 40426,
        ],
        name: 'JBERC20PaymentTerminal3_1',
        nameLocation: '527:25:21',
        scope: 15079,
        usedErrors: [
          21000, 23659, 23661, 23663, 23665, 23667, 23669, 23671, 23673, 23675,
          23677, 30563,
        ],
      },
    ],
    license: 'MIT',
  },
  id: 21,
}

export default abi
