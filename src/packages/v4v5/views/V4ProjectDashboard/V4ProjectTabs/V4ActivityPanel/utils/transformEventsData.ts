import { Ether, JBProjectToken } from 'juice-sdk-core'

import { ActivityEventsQuery } from 'packages/v4v5/graphql/client/graphql'

// TODO Event types can be updated to bendystraw schema, currently there are mismatched event names + properties
export type EventType =
  | 'payEvent'
  | 'addToBalanceEvent'
  | 'mintTokensEvent'
  | 'cashOutEvent'
  | 'deployedERC20Event'
  | 'projectCreateEvent'
  | 'distributePayoutsEvent'
  | 'distributeReservedTokensEvent'
  | 'distributeToReservedTokenSplitEvent'
  | 'distributeToPayoutSplitEvent'
  | 'useAllowanceEvent'
  | 'burnEvent'

export interface Event {
  id: string
  type: EventType
  projectId: number
  timestamp: number
  txHash: string
  from: string
  caller: string
  chainId: number
}

export interface PayEvent extends Event {
  type: 'payEvent'
  amount: Ether
  note: string
  distributionFromProjectId: number | null
  beneficiary: string
  feeFromProject: number | null
  beneficiaryTokenCount: JBProjectToken
}

export interface AddToBalanceEvent extends Event {
  type: 'addToBalanceEvent'
  amount: Ether
  note: string | null
}

export interface MintTokensEvent extends Event {
  type: 'mintTokensEvent'
  amount: Ether
  beneficiary: string
  note: string
}

export interface CashOutEvent extends Event {
  type: 'cashOutEvent'
  metadata: string
  holder: string
  beneficiary: string
  cashOutCount: Ether
  reclaimAmount: Ether
}

export interface DeployedERC20Event extends Event {
  type: 'deployedERC20Event'
  symbol: string
  address: string
}

export interface ProjectCreateEvent extends Event {
  type: 'projectCreateEvent'
}

export interface DistributePayoutsEvent extends Event {
  type: 'distributePayoutsEvent'
  amount: Ether
  amountPaidOut: Ether
  rulesetCycleNumber: bigint
  rulesetId: bigint
  fee: Ether
}

export interface DistributeReservedTokensEvent extends Event {
  type: 'distributeReservedTokensEvent'
  rulesetCycleNumber: number
  tokenCount: bigint
}

export interface DistributeToReservedTokenSplitEvent extends Event {
  type: 'distributeToReservedTokenSplitEvent'
  tokenCount: bigint
  preferAddToBalance: boolean
  percent: number
  splitProjectId: number
  beneficiary: string
  lockedUntil: number
}

export interface DistributeToPayoutSplitEvent extends Event {
  type: 'distributeToPayoutSplitEvent'
  amount: Ether
  preferAddToBalance: boolean
  percent: number
  splitProjectId: number
  beneficiary: string
  lockedUntil: number
}

export interface UseAllowanceEvent extends Event {
  type: 'useAllowanceEvent'
  rulesetId: bigint
  rulesetCycleNumber: number
  beneficiary: string
  amount: Ether
  distributedAmount: Ether
  netDistributedamount: Ether
  note: string
}

export interface BurnEvent extends Event {
  type: 'burnEvent'
  holder: string
  amount: Ether
  stakedAmount: Ether
  erc20Amount: Ether
}

export type AnyEvent =
  | PayEvent
  | AddToBalanceEvent
  | MintTokensEvent
  | CashOutEvent
  | DeployedERC20Event
  | ProjectCreateEvent
  | DistributePayoutsEvent
  | DistributeReservedTokensEvent
  | DistributeToReservedTokenSplitEvent
  | DistributeToPayoutSplitEvent
  | UseAllowanceEvent
  | BurnEvent

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractBaseEventData(event: any): AnyEvent {
  return {
    // Make type null and set it later
    // @ts-ignore
    type: null,
    id: event.id,
    projectId: event.projectId,
    timestamp: event.timestamp,
    txHash: event.txHash,
    from: event.from,
    caller: event.caller,
  }
}

// TODO update AnyEvent types to match bendystraw
export function transformEventData(
  data: ActivityEventsQuery['activityEvents']['items'][number],
): AnyEvent | null {
  if (data.payEvent) {
    return {
      ...extractBaseEventData(data.payEvent),
      chainId: data.chainId,
      type: 'payEvent',
      amount: new Ether(BigInt(data.payEvent.amount)),
      note: data.payEvent.memo || '',
      distributionFromProjectId: data.payEvent.distributionFromProjectId,
      beneficiary: data.payEvent.beneficiary,
      feeFromProject: data.payEvent.feeFromProject,
      beneficiaryTokenCount: new JBProjectToken(
        BigInt(data.payEvent.newlyIssuedTokenCount),
      ),
    }
  }
  if (data.addToBalanceEvent) {
    return {
      ...extractBaseEventData(data.addToBalanceEvent),
      chainId: data.chainId,
      type: 'addToBalanceEvent',
      amount: new Ether(BigInt(data.addToBalanceEvent.amount)),
      note: data.addToBalanceEvent.memo,
    }
  }
  if (data.mintTokensEvent) {
    return {
      ...extractBaseEventData(data.mintTokensEvent),
      chainId: data.chainId,
      type: 'mintTokensEvent',
      amount: new Ether(BigInt(data.mintTokensEvent.tokenCount)),
      beneficiary: data.mintTokensEvent.beneficiary,
      note: data.mintTokensEvent.memo || '',
    }
  }
  if (data.cashOutTokensEvent) {
    return {
      ...extractBaseEventData(data.cashOutTokensEvent),
      chainId: data.chainId,
      type: 'cashOutEvent',
      metadata: data.cashOutTokensEvent.metadata,
      holder: data.cashOutTokensEvent.holder,
      beneficiary: data.cashOutTokensEvent.beneficiary,
      cashOutCount: new Ether(BigInt(data.cashOutTokensEvent.cashOutCount)),
      reclaimAmount: new Ether(BigInt(data.cashOutTokensEvent.reclaimAmount)),
    }
  }
  if (data.deployErc20Event) {
    return {
      ...extractBaseEventData(data.deployErc20Event),
      chainId: data.chainId,
      type: 'deployedERC20Event',
      symbol: data.deployErc20Event.symbol,
      address: data.deployErc20Event.token,
    }
  }
  if (data.projectCreateEvent) {
    return {
      ...extractBaseEventData(data.projectCreateEvent),
      chainId: data.chainId,
      type: 'projectCreateEvent',
    }
  }
  if (data.sendPayoutsEvent) {
    return {
      ...extractBaseEventData(data.sendPayoutsEvent),
      chainId: data.chainId,
      type: 'distributePayoutsEvent',
      amount: new Ether(BigInt(data.sendPayoutsEvent.amount)),
      amountPaidOut: new Ether(BigInt(data.sendPayoutsEvent.amountPaidOut)),
      rulesetCycleNumber: BigInt(data.sendPayoutsEvent.rulesetCycleNumber),
      rulesetId: BigInt(data.sendPayoutsEvent.rulesetId),
      fee: new Ether(BigInt(data.sendPayoutsEvent.fee)),
    }
  }
  if (data.sendReservedTokensToSplitsEvent) {
    return {
      ...extractBaseEventData(data.sendReservedTokensToSplitsEvent),
      chainId: data.chainId,
      type: 'distributeReservedTokensEvent',
      rulesetCycleNumber:
        data.sendReservedTokensToSplitsEvent.rulesetCycleNumber,
      tokenCount: data.sendReservedTokensToSplitsEvent.tokenCount,
    }
  }
  if (data.sendReservedTokensToSplitEvent) {
    return {
      ...extractBaseEventData(data.sendReservedTokensToSplitEvent),
      chainId: data.chainId,
      type: 'distributeToReservedTokenSplitEvent',
      tokenCount: data.sendReservedTokensToSplitEvent.tokenCount,
      preferAddToBalance:
        data.sendReservedTokensToSplitEvent.preferAddToBalance,
      percent: data.sendReservedTokensToSplitEvent.percent,
      splitProjectId: data.sendReservedTokensToSplitEvent.splitProjectId,
      beneficiary: data.sendReservedTokensToSplitEvent.beneficiary,
      lockedUntil: Number(data.sendReservedTokensToSplitEvent.lockedUntil),
    }
  }
  if (data.sendPayoutToSplitEvent) {
    return {
      ...extractBaseEventData(data.sendPayoutToSplitEvent),
      chainId: data.chainId,
      type: 'distributeToPayoutSplitEvent',
      amount: new Ether(BigInt(data.sendPayoutToSplitEvent.amount)),
      preferAddToBalance: data.sendPayoutToSplitEvent.preferAddToBalance,
      percent: data.sendPayoutToSplitEvent.percent,
      splitProjectId: data.sendPayoutToSplitEvent.splitProjectId,
      beneficiary: data.sendPayoutToSplitEvent.beneficiary,
      lockedUntil: Number(data.sendPayoutToSplitEvent.lockedUntil),
    }
  }
  if (data.useAllowanceEvent) {
    return {
      ...extractBaseEventData(data.useAllowanceEvent),
      chainId: data.chainId,
      type: 'useAllowanceEvent',
      rulesetId: BigInt(data.useAllowanceEvent.rulesetId),
      rulesetCycleNumber: data.useAllowanceEvent.rulesetCycleNumber,
      beneficiary: data.useAllowanceEvent.beneficiary,
      amount: new Ether(BigInt(data.useAllowanceEvent.amount)),
      distributedAmount: new Ether(
        BigInt(data.useAllowanceEvent.amountPaidOut),
      ),
      netDistributedamount: new Ether(
        BigInt(data.useAllowanceEvent.netAmountPaidOut),
      ),
      note: data.useAllowanceEvent.memo || '',
    }
  }
  if (data.burnEvent) {
    return {
      ...extractBaseEventData(data.burnEvent),
      chainId: data.chainId,
      type: 'burnEvent',
      holder: data.burnEvent.from,
      amount: new Ether(BigInt(data.burnEvent.amount)),
      stakedAmount: new Ether(BigInt(data.burnEvent.creditAmount)),
      erc20Amount: new Ether(BigInt(data.burnEvent.erc20Amount)),
    }
  }
  console.warn('Unknown event type', data)
  return null
}
