/**
 * Base type for entities that correspond to a contract event
 */
export interface BaseEventEntity {
  id: string
  timestamp: number
  txHash: string
  caller: string
  from: string
}
