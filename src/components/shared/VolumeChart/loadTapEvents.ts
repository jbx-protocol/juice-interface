import { fromWad } from 'utils/formatNumber'
import { querySubgraph } from 'utils/graph'

import { daysToMillis } from './daysToMillis'

import { Duration } from './types'

export const loadTapEvents = async ({
  projectId,
  duration,
  now,
}: {
  projectId: number
  duration: Duration
  now: number
}) => {
  const tapEvents = await querySubgraph({
    entity: 'tapEvent',
    keys: ['netTransferAmount', 'timestamp'],
    where: projectId
      ? [
          {
            key: 'project',
            value: projectId.toString(),
          },
          {
            key: 'timestamp',
            value: Math.round((now - daysToMillis(duration)) / 1000),
            operator: 'gte',
          },
        ]
      : undefined,
  })

  return tapEvents.map(event => ({
    ...event,
    tapped: parseFloat(parseFloat(fromWad(event.netTransferAmount)).toFixed(4)),
    timestamp: event.timestamp ?? 0,
  }))
}
