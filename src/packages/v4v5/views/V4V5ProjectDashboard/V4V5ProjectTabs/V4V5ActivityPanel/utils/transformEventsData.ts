import { Ether, JBProjectToken } from 'juice-sdk-core'

import { ActivityEventsQuery } from 'packages/v4v5/graphql/client/graphql'

// TODO Event types can be updated to bendystraw schema, currently there are mismatched event names + properties
export type EventType =
  | 'payEvent'
  | 'addToBalanceEvent'
  | 'manualMintTokensEvent'
  | 'cashOutEvent'
  | 'deployedERC20Event'
  | 'projectCreateEvent'
  | 'distributePayoutsEvent'
  | 'distributeReservedTokensEvent'
  | 'distributeToReservedTokenSplitEvent'
  | 'distributeToPayoutSplitEvent'
  | 'useAllowanceEvent'
  | 'manualBurnEvent'

export interface Event {
  id: string
  type: EventType
  projectId: number
  projectName?: string | null
  projectHandle?: string | null
  projectLogoUri?: string | null
  projectToken?: string | null
  projectCurrency?: string | null
  projectDecimals?: number | null
  projectVersion?: 4 | 5 | null
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

export interface ManualMintTokensEvent extends Event {
  type: 'manualMintTokensEvent'
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

export interface ManualBurnEvent extends Event {
  type: 'manualBurnEvent'
  holder: string
  amount: Ether
  stakedAmount: Ether
  erc20Amount: Ether
}

// TODO: Aggregated Event Interfaces - to be implemented later
// export interface PaymentEvent extends Event...
// export interface CashOutAggregatedEvent extends Event...
// export interface ERC20CreationEvent extends Event...
// export interface PayoutDistributionEvent extends Event...
// export interface ReservedTokenDistributionEvent extends Event...

export type AnyEvent =
  | PayEvent
  | AddToBalanceEvent
  | ManualMintTokensEvent
  | CashOutEvent
  | DeployedERC20Event
  | ProjectCreateEvent
  | DistributePayoutsEvent
  | DistributeReservedTokensEvent
  | DistributeToReservedTokenSplitEvent
  | DistributeToPayoutSplitEvent
  | UseAllowanceEvent
  | ManualBurnEvent

interface BaseEventInput {
  id: string
  projectId: number
  timestamp: number
  txHash: string
  from: string
  caller?: string
}

function extractBaseEventData(
  event: BaseEventInput,
  projectName?: string | null,
  projectHandle?: string | null,
  projectLogoUri?: string | null,
  projectToken?: string | null,
  projectCurrency?: string | null,
  projectDecimals?: number | null,
  projectVersion?: 4 | 5 | null,
): AnyEvent {
  return {
    // Make type null and set it later
    // @ts-ignore
    type: null,
    id: event.id,
    projectId: event.projectId,
    projectName,
    projectHandle,
    projectLogoUri,
    projectToken,
    projectCurrency,
    projectDecimals,
    projectVersion,
    timestamp: event.timestamp,
    txHash: event.txHash,
    from: event.from,
    caller: event.caller ?? event.from,
  }
}

// TODO update AnyEvent types to match bendystraw
export function transformEventData(
  data: ActivityEventsQuery['activityEvents']['items'][number],
): AnyEvent | null {
  const projectName = data.project?.name ?? null
  const projectHandle = data.project?.handle ?? null
  const projectLogoUri = data.project?.logoUri ?? null
  // Token is already a hex string address (e.g., "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913")
  const projectToken = data.project?.token ?? null
  // Currency appears to be an ID/enum, not the token address
  const projectCurrency = data.project?.currency ? String(data.project.currency) : null
  const projectDecimals = data.project?.decimals ? Number(data.project.decimals) : null
  const projectVersion = data.project?.version === 4 || data.project?.version === 5 ? data.project.version : null

  // Check for aggregated events first
  // TODO: Aggregated event handling - temporarily disabled
  // const aggregatedType = (data as any).__aggregatedType
  // const relatedEvents = (data as any).__relatedEvents || []
  // if (aggregatedType === 'paymentEvent') { return transformPaymentEvent(data, relatedEvents) }
  // if (aggregatedType === 'cashOutAggregatedEvent') { return transformCashOutAggregatedEvent(data, relatedEvents) }
  // etc...

  // Handle individual events
  if (data.payEvent) {
    return {
      ...extractBaseEventData(data.payEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
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
      ...extractBaseEventData(data.addToBalanceEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
      chainId: data.chainId,
      type: 'addToBalanceEvent',
      amount: new Ether(BigInt(data.addToBalanceEvent.amount)),
      note: data.addToBalanceEvent.memo,
    }
  }
  if (data.manualMintTokensEvent) {
    return {
      ...extractBaseEventData(data.manualMintTokensEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
      chainId: data.chainId,
      type: 'manualMintTokensEvent',
      amount: new Ether(BigInt(data.manualMintTokensEvent.tokenCount)),
      beneficiary: data.manualMintTokensEvent.beneficiary,
      note: data.manualMintTokensEvent.memo || '',
    }
  }
  if (data.cashOutTokensEvent) {
    return {
      ...extractBaseEventData(data.cashOutTokensEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
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
      ...extractBaseEventData(data.deployErc20Event, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
      chainId: data.chainId,
      type: 'deployedERC20Event',
      symbol: data.deployErc20Event.symbol,
      address: data.deployErc20Event.token,
    }
  }
  if (data.projectCreateEvent) {
    return {
      ...extractBaseEventData(data.projectCreateEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
      chainId: data.chainId,
      type: 'projectCreateEvent',
    }
  }
  if (data.sendPayoutsEvent) {
    return {
      ...extractBaseEventData(data.sendPayoutsEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
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
      ...extractBaseEventData(data.sendReservedTokensToSplitsEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
      chainId: data.chainId,
      type: 'distributeReservedTokensEvent',
      rulesetCycleNumber:
        data.sendReservedTokensToSplitsEvent.rulesetCycleNumber,
      tokenCount: data.sendReservedTokensToSplitsEvent.tokenCount,
    }
  }
  if (data.sendReservedTokensToSplitEvent) {
    return {
      ...extractBaseEventData(data.sendReservedTokensToSplitEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
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
      ...extractBaseEventData(data.sendPayoutToSplitEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
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
      ...extractBaseEventData(data.useAllowanceEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
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
  if (data.manualBurnEvent) {
    return {
      ...extractBaseEventData(data.manualBurnEvent, projectName, projectHandle, projectLogoUri, projectToken, projectCurrency, projectDecimals, projectVersion),
      chainId: data.chainId,
      type: 'manualBurnEvent',
      holder: data.manualBurnEvent.from,
      amount: new Ether(BigInt(data.manualBurnEvent.amount)),
      stakedAmount: new Ether(BigInt(data.manualBurnEvent.creditAmount)),
      erc20Amount: new Ether(BigInt(data.manualBurnEvent.erc20Amount)),
    }
  }
  console.warn('Unknown event type', data)
  return null
}

// TODO: Transform functions for aggregated events - temporarily disabled
/*
function transformPaymentEvent(
  data: ActivityEventsQuery['activityEvents']['items'][number],
  relatedEvents: ActivityEventsQuery['activityEvents']['items'],
): any | null {
  const payEvent = relatedEvents.find(e => e.payEvent)?.payEvent
  const mintEvent = relatedEvents.find(e => e.mintTokensEvent)?.mintTokensEvent

  if (!payEvent) return null

  const projectName = data.project?.name ?? null
  const projectHandle = data.project?.handle ?? null

  return {
    ...extractBaseEventData(payEvent, projectName, projectHandle),
    chainId: data.chainId,
    type: 'paymentEvent',
    amountPaid: new Ether(BigInt(payEvent.amount)),
    tokensMinted: new JBProjectToken(
      BigInt(mintEvent?.tokenCount || payEvent.newlyIssuedTokenCount),
    ),
    beneficiary: payEvent.beneficiary,
    note: payEvent.memo || '',
    distributionFromProjectId: payEvent.distributionFromProjectId,
    feeFromProject: payEvent.feeFromProject,
  }
}

function transformCashOutAggregatedEvent(
  data: ActivityEventsQuery['activityEvents']['items'][number],
  relatedEvents: ActivityEventsQuery['activityEvents']['items'],
): CashOutAggregatedEvent | null {
  const cashOutEvent = relatedEvents.find(e => e.cashOutTokensEvent)
    ?.cashOutTokensEvent
  const burnEvent = relatedEvents.find(e => e.burnEvent)?.burnEvent

  if (!cashOutEvent || !burnEvent) return null

  const projectName = data.project?.name ?? null
  const projectHandle = data.project?.handle ?? null

  return {
    ...extractBaseEventData(cashOutEvent, projectName, projectHandle),
    chainId: data.chainId,
    type: 'cashOutAggregatedEvent',
    holder: cashOutEvent.holder,
    beneficiary: cashOutEvent.beneficiary,
    tokensBurned: new Ether(BigInt(burnEvent.amount)),
    stakedAmount: new Ether(BigInt(burnEvent.creditAmount)),
    erc20Amount: new Ether(BigInt(burnEvent.erc20Amount)),
    ethReceived: new Ether(BigInt(cashOutEvent.reclaimAmount)),
    metadata: cashOutEvent.metadata,
  }
}

function transformERC20CreationEvent(
  data: ActivityEventsQuery['activityEvents']['items'][number],
  relatedEvents: ActivityEventsQuery['activityEvents']['items'],
): ERC20CreationEvent | null {
  const erc20Events = relatedEvents.filter(e => e.deployErc20Event)

  if (erc20Events.length === 0) return null

  const firstEvent = erc20Events[0].deployErc20Event
  if (!firstEvent) return null

  const projectName = data.project?.name ?? null
  const projectHandle = data.project?.handle ?? null

  return {
    ...extractBaseEventData(firstEvent, projectName, projectHandle),
    chainId: data.chainId,
    type: 'erc20CreationEvent',
    symbol: firstEvent.symbol,
    chains: erc20Events.map(e => ({
      chainId: e.chainId,
      address: e.deployErc20Event?.token || '',
    })),
  }
}

function transformPayoutDistributionEvent(
  data: ActivityEventsQuery['activityEvents']['items'][number],
  relatedEvents: ActivityEventsQuery['activityEvents']['items'],
): PayoutDistributionEvent | null {
  const distributeEvent = relatedEvents.find(e => e.sendPayoutsEvent)
    ?.sendPayoutsEvent
  const splitEvents = relatedEvents.filter(e => e.sendPayoutToSplitEvent)

  if (!distributeEvent) return null

  const projectName = data.project?.name ?? null
  const projectHandle = data.project?.handle ?? null

  return {
    ...extractBaseEventData(distributeEvent, projectName, projectHandle),
    chainId: data.chainId,
    type: 'payoutDistributionEvent',
    totalAmount: new Ether(BigInt(distributeEvent.amount)),
    amountPaidOut: new Ether(BigInt(distributeEvent.amountPaidOut)),
    fee: new Ether(BigInt(distributeEvent.fee)),
    numberOfSplits: splitEvents.length,
    rulesetCycleNumber: BigInt(distributeEvent.rulesetCycleNumber),
    rulesetId: BigInt(distributeEvent.rulesetId),
    splits: splitEvents.map(e => ({
      beneficiary: e.sendPayoutToSplitEvent?.beneficiary || '',
      amount: new Ether(BigInt(e.sendPayoutToSplitEvent?.amount || 0)),
      percent: e.sendPayoutToSplitEvent?.percent || 0,
      splitProjectId: e.sendPayoutToSplitEvent?.splitProjectId || 0,
    })),
  }
}

function transformReservedTokenDistributionEvent(
  data: ActivityEventsQuery['activityEvents']['items'][number],
  relatedEvents: ActivityEventsQuery['activityEvents']['items'],
): ReservedTokenDistributionEvent | null {
  const distributeEvent = relatedEvents.find(
    e => e.sendReservedTokensToSplitsEvent,
  )?.sendReservedTokensToSplitsEvent
  const splitEvents = relatedEvents.filter(e => e.sendReservedTokensToSplitEvent)

  if (!distributeEvent) return null

  const projectName = data.project?.name ?? null
  const projectHandle = data.project?.handle ?? null

  return {
    ...extractBaseEventData(distributeEvent, projectName, projectHandle),
    chainId: data.chainId,
    type: 'reservedTokenDistributionEvent',
    totalTokens: distributeEvent.tokenCount,
    numberOfSplits: splitEvents.length,
    rulesetCycleNumber: distributeEvent.rulesetCycleNumber,
    splits: splitEvents.map(e => ({
      beneficiary: e.sendReservedTokensToSplitEvent?.beneficiary || '',
      tokenCount: e.sendReservedTokensToSplitEvent?.tokenCount || BigInt(0),
      percent: e.sendReservedTokensToSplitEvent?.percent || 0,
      splitProjectId: e.sendReservedTokensToSplitEvent?.splitProjectId || 0,
    })),
  }
}
*/
