import { PV } from 'models/pv'

export interface ActivityElementEvent {
  timestamp: number
  txHash: string
  from: string
  beneficiary?: string
  terminal?: string
  projectId?: number
  project?: {
    handle?: string | null
  }
  pv?: PV
}
