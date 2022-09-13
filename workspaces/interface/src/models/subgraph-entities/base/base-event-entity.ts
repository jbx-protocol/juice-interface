export interface BaseEventEntity {
  id: string
  timestamp: number
  txHash: string
  caller: string
}

export type BaseEventEntityJson = Partial<Record<keyof BaseEventEntity, string>>

export const parseBaseEventEntityJson = (
  j: BaseEventEntityJson,
): Partial<BaseEventEntity> => ({
  id: j.id,
  timestamp: j.timestamp ? parseInt(j.timestamp) : undefined,
  txHash: j.txHash,
  caller: j.caller,
})
