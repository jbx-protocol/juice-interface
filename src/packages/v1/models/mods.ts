import { BigNumber } from '@ethersproject/bignumber'

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
