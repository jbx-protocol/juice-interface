export interface ActivityElementEvent {
  timestamp: number
  txHash: string
  from?: string // TODO should always be defined
  beneficiary?: string
  terminal?: string
}
