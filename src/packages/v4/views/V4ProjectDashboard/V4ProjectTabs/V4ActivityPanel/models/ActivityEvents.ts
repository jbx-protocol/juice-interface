import { Ether, JBProjectToken } from 'juice-sdk-core'
import { Address } from 'viem'

export type PayEvent = {
  id: string
  amount: Ether
  amountUSD: Ether | undefined
  beneficiary: Address
  beneficiaryTokenCount?: JBProjectToken
  timestamp: number
  txHash: string
}

export type ActivityEvents = {
  payEvents: PayEvent[]
  // TODO: other event types
}
