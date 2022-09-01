interface ActivityElementEventBase {
  timestamp: number
  txHash: string
  type: 'beneficiary' | 'caller'
}

interface AEEBBenficiary extends ActivityElementEventBase {
  beneficiary: string
  type: 'beneficiary'
}

interface AEEBCaller extends ActivityElementEventBase {
  caller: string
  type: 'caller'
}

export type ActivityElementEvent = AEEBBenficiary | AEEBCaller
