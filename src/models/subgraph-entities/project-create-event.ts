import { CV } from './cv'

export type ProjectCreateEvent = {
  id: string
  cv: CV
  projectId: number
  timestamp: number
  txHash: string
  caller: string
}
