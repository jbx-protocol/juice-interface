import { ContractInterface } from '@ethersproject/contracts'
import { NetworkName } from 'models/network-name'

// TODO terminalV1_1 should be from @jbx-protocol/contracts package
export const terminalV1_1Dict: Partial<
  Record<NetworkName, { address: string; abi: ContractInterface }>
> = {
  [NetworkName.rinkeby]: {
    address: '0xaFFe0E61Ebd2A451BA0ee9574D47F47c0A5D736c',
    abi: [
      {
        inputs: [
          {
            internalType: 'contract IProjects',
            name: '_projects',
            type: 'address',
          },
          {
            internalType: 'contract IFundingCycles',
            name: '_fundingCycles',
            type: 'address',
          },
          {
            internalType: 'contract ITicketBooth',
            name: '_ticketBooth',
            type: 'address',
          },
          {
            internalType: 'contract IOperatorStore',
            name: '_operatorStore',
            type: 'address',
          },
          {
            internalType: 'contract IModStore',
            name: '_modStore',
            type: 'address',
          },
          {
            internalType: 'contract IPrices',
            name: '_prices',
            type: 'address',
          },
          {
            internalType: 'contract ITerminalDirectory',
            name: '_terminalDirectory',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: '_governance',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'prod1',
            type: 'uint256',
          },
        ],
        name: 'PRBMath__MulDivFixedPointOverflow',
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
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'governance',
            type: 'address',
          },
        ],
        name: 'AcceptGovernance',
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
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
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
            indexed: false,
            internalType: 'contract ITerminal',
            name: 'allowed',
            type: 'address',
          },
        ],
        name: 'AllowMigration',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'governance',
            type: 'address',
          },
        ],
        name: 'AppointGovernance',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'fundingCycleId',
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
            name: 'caller',
            type: 'address',
          },
        ],
        name: 'Configure',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'Deposit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'fundingCycleId',
            type: 'uint256',
          },
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
                name: 'preferUnstaked',
                type: 'bool',
              },
              {
                internalType: 'uint16',
                name: 'percent',
                type: 'uint16',
              },
              {
                internalType: 'uint48',
                name: 'lockedUntil',
                type: 'uint48',
              },
              {
                internalType: 'address payable',
                name: 'beneficiary',
                type: 'address',
              },
              {
                internalType: 'contract IModAllocator',
                name: 'allocator',
                type: 'address',
              },
              {
                internalType: 'uint56',
                name: 'projectId',
                type: 'uint56',
              },
            ],
            indexed: false,
            internalType: 'struct PayoutMod',
            name: 'mod',
            type: 'tuple',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'modCut',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
        ],
        name: 'DistributeToPayoutMod',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'fundingCycleId',
            type: 'uint256',
          },
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
                name: 'preferUnstaked',
                type: 'bool',
              },
              {
                internalType: 'uint16',
                name: 'percent',
                type: 'uint16',
              },
              {
                internalType: 'uint48',
                name: 'lockedUntil',
                type: 'uint48',
              },
              {
                internalType: 'address payable',
                name: 'beneficiary',
                type: 'address',
              },
            ],
            indexed: false,
            internalType: 'struct TicketMod',
            name: 'mod',
            type: 'tuple',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'modCut',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
        ],
        name: 'DistributeToTicketMod',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'target',
            type: 'uint256',
          },
        ],
        name: 'EnsureTargetLocalWei',
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
            internalType: 'contract ITerminal',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '_amount',
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
            internalType: 'uint256',
            name: 'fundingCycleId',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'projectId',
            type: 'uint256',
          },
          {
            indexed: true,
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
            name: 'beneficiaryTokens',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'totalTokens',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'note',
            type: 'string',
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
            name: 'fundingCycleId',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'projectId',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'beneficiary',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'count',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'beneficiaryTicketAmount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
        ],
        name: 'PrintReserveTickets',
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
            internalType: 'string',
            name: 'memo',
            type: 'string',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
        ],
        name: 'PrintTickets',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'holder',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'beneficiary',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: '_projectId',
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
            name: 'returnAmount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
        ],
        name: 'Redeem',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: '_amount',
            type: 'uint256',
          },
        ],
        name: 'SetFee',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'SetTargetLocalWei',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'contract IYielder',
            name: 'newYielder',
            type: 'address',
          },
        ],
        name: 'SetYielder',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'fundingCycleId',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'projectId',
            type: 'uint256',
          },
          {
            indexed: true,
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
            name: 'currency',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'netTransferAmount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'beneficiaryTransferAmount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'govFeeAmount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
        ],
        name: 'Tap',
        type: 'event',
      },
      {
        inputs: [],
        name: 'acceptGovernance',
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
        ],
        name: 'addToBalance',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'contract ITerminal',
            name: '_contract',
            type: 'address',
          },
        ],
        name: 'allowMigration',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address payable',
            name: '_pendingGovernance',
            type: 'address',
          },
        ],
        name: 'appointGovernance',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'balanceOf',
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
            name: '_account',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_projectId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_count',
            type: 'uint256',
          },
        ],
        name: 'claimableOverflowOf',
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
          {
            components: [
              {
                internalType: 'uint256',
                name: 'target',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'currency',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'duration',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'cycleLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'discountRate',
                type: 'uint256',
              },
              {
                internalType: 'contract IFundingCycleBallot',
                name: 'ballot',
                type: 'address',
              },
            ],
            internalType: 'struct FundingCycleProperties',
            name: '_properties',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'reservedRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'bondingCurveRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'reconfigurationBondingCurveRate',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'payIsPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'ticketPrintingIsAllowed',
                type: 'bool',
              },
              {
                internalType: 'contract ITreasuryExtension',
                name: 'treasuryExtension',
                type: 'address',
              },
            ],
            internalType: 'struct FundingCycleMetadata2',
            name: '_metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bool',
                name: 'preferUnstaked',
                type: 'bool',
              },
              {
                internalType: 'uint16',
                name: 'percent',
                type: 'uint16',
              },
              {
                internalType: 'uint48',
                name: 'lockedUntil',
                type: 'uint48',
              },
              {
                internalType: 'address payable',
                name: 'beneficiary',
                type: 'address',
              },
              {
                internalType: 'contract IModAllocator',
                name: 'allocator',
                type: 'address',
              },
              {
                internalType: 'uint56',
                name: 'projectId',
                type: 'uint56',
              },
            ],
            internalType: 'struct PayoutMod[]',
            name: '_payoutMods',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'bool',
                name: 'preferUnstaked',
                type: 'bool',
              },
              {
                internalType: 'uint16',
                name: 'percent',
                type: 'uint16',
              },
              {
                internalType: 'uint48',
                name: 'lockedUntil',
                type: 'uint48',
              },
              {
                internalType: 'address payable',
                name: 'beneficiary',
                type: 'address',
              },
            ],
            internalType: 'struct TicketMod[]',
            name: '_ticketMods',
            type: 'tuple[]',
          },
        ],
        name: 'configure',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
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
        ],
        name: 'currentOverflowOf',
        outputs: [
          {
            internalType: 'uint256',
            name: 'overflow',
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
            name: '_owner',
            type: 'address',
          },
          {
            internalType: 'bytes32',
            name: '_handle',
            type: 'bytes32',
          },
          {
            internalType: 'string',
            name: '_uri',
            type: 'string',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'target',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'currency',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'duration',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'cycleLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'discountRate',
                type: 'uint256',
              },
              {
                internalType: 'contract IFundingCycleBallot',
                name: 'ballot',
                type: 'address',
              },
            ],
            internalType: 'struct FundingCycleProperties',
            name: '_properties',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'reservedRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'bondingCurveRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'reconfigurationBondingCurveRate',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'payIsPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'ticketPrintingIsAllowed',
                type: 'bool',
              },
              {
                internalType: 'contract ITreasuryExtension',
                name: 'treasuryExtension',
                type: 'address',
              },
            ],
            internalType: 'struct FundingCycleMetadata2',
            name: '_metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bool',
                name: 'preferUnstaked',
                type: 'bool',
              },
              {
                internalType: 'uint16',
                name: 'percent',
                type: 'uint16',
              },
              {
                internalType: 'uint48',
                name: 'lockedUntil',
                type: 'uint48',
              },
              {
                internalType: 'address payable',
                name: 'beneficiary',
                type: 'address',
              },
              {
                internalType: 'contract IModAllocator',
                name: 'allocator',
                type: 'address',
              },
              {
                internalType: 'uint56',
                name: 'projectId',
                type: 'uint56',
              },
            ],
            internalType: 'struct PayoutMod[]',
            name: '_payoutMods',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'bool',
                name: 'preferUnstaked',
                type: 'bool',
              },
              {
                internalType: 'uint16',
                name: 'percent',
                type: 'uint16',
              },
              {
                internalType: 'uint48',
                name: 'lockedUntil',
                type: 'uint48',
              },
              {
                internalType: 'address payable',
                name: 'beneficiary',
                type: 'address',
              },
            ],
            internalType: 'struct TicketMod[]',
            name: '_ticketMods',
            type: 'tuple[]',
          },
        ],
        name: 'deploy',
        outputs: [],
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
        name: 'fundingCycles',
        outputs: [
          {
            internalType: 'contract IFundingCycles',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'governance',
        outputs: [
          {
            internalType: 'address payable',
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
            internalType: 'contract ITerminal',
            name: '_to',
            type: 'address',
          },
        ],
        name: 'migrate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'contract ITerminal',
            name: '',
            type: 'address',
          },
        ],
        name: 'migrationIsAllowed',
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
        name: 'modStore',
        outputs: [
          {
            internalType: 'contract IModStore',
            name: '',
            type: 'address',
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
            internalType: 'contract IOperatorStore',
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
            internalType: 'address',
            name: '_beneficiary',
            type: 'address',
          },
          {
            internalType: 'string',
            name: '_memo',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: '_preferUnstakedTickets',
            type: 'bool',
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
        name: 'pendingGovernance',
        outputs: [
          {
            internalType: 'address payable',
            name: '',
            type: 'address',
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
            internalType: 'contract IPrices',
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
        name: 'printReservedTickets',
        outputs: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
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
            internalType: 'address',
            name: '_beneficiary',
            type: 'address',
          },
          {
            internalType: 'string',
            name: '_memo',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: '_preferUnstakedTickets',
            type: 'bool',
          },
        ],
        name: 'printTickets',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'projects',
        outputs: [
          {
            internalType: 'contract IProjects',
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
            name: '_account',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_projectId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_count',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_minReturnedWei',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: '_beneficiary',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: '_preferUnstaked',
            type: 'bool',
          },
        ],
        name: 'redeem',
        outputs: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
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
            name: '_reservedRate',
            type: 'uint256',
          },
        ],
        name: 'reservedTicketBalanceOf',
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
            internalType: 'uint256',
            name: '_minReturnedWei',
            type: 'uint256',
          },
        ],
        name: 'tap',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'terminalDirectory',
        outputs: [
          {
            internalType: 'contract ITerminalDirectory',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'ticketBooth',
        outputs: [
          {
            internalType: 'contract ITicketBooth',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  },
} as const
