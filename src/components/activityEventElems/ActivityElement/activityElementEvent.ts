export interface ActivityElementEvent {
  timestamp: number
  txHash: string
<<<<<<< HEAD
  from: string
=======
  from?: string // TODO should always be defined
>>>>>>> 71c3d8837 (wip)
  beneficiary?: string
  terminal?: string
}
