import { BigNumber } from 'ethers'

export interface PayoutMod {
  beneficiary?: string
  percent: number
  preferUnstaked?: boolean
  lockedUntil?: number
  projectId?: BigNumber
  allocator?: string
}

export interface TicketMod {
  preferUnstaked?: boolean
  percent: number
  lockedUntil?: number
  beneficiary?: string
}
