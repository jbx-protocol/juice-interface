export interface ActivityElementEvent {
  timestamp: number
  txHash: string
  caller?: string // TODO should always be defined
  beneficiary?: string
  terminal?: string
}
