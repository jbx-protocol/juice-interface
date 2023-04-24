export interface ActivityElementEvent {
  timestamp: number
  txHash: string
  from: string
  beneficiary?: string
  terminal?: string
}
