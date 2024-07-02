export interface PayoutMod {
  beneficiary?: string
  percent: number
  preferUnstaked?: boolean
  lockedUntil?: number
  projectId?: bigint
  allocator?: string
}

export interface TicketMod {
  preferUnstaked?: boolean
  percent: number
  lockedUntil?: number
  beneficiary?: string
}
