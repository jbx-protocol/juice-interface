import { fromWad } from 'utils/format/formatNumber'

import { daysToMillis } from './daysToMillis'

import {
  QueryTapEventsArgs,
  TapEventsProjectTlDocument,
  TapEventsProjectTlQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { paginateDepleteQuery } from 'lib/apollo/paginateDepleteQuery'
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
  const tapEvents = await paginateDepleteQuery<
    TapEventsProjectTlQuery,
    QueryTapEventsArgs
  >({
    client,
    document: TapEventsProjectTlDocument,
    variables: {
      where: {
        projectId,
        timestamp_gte: Math.round((now - daysToMillis(duration)) / 1000),
      },
    },
  })

  return tapEvents.map(event => ({
    ...event,
    tapped: parseFloat(parseFloat(fromWad(event.netTransferAmount)).toFixed(4)),
    timestamp: event.timestamp ?? 0,
  }))
}
