export interface ActivityElementEvent {
  timestamp: number
  txHash: string
  caller: string
  beneficiary?: string
  terminal?: string
}
