import { useQuery } from '@tanstack/react-query'
import { PV_V4 } from 'constants/pv'
import { readProvider } from 'constants/readProvider'
import EthDater from 'ethereum-block-by-date'
import { ProjectTlQuery, useProjectTlQuery } from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { PV } from 'models/pv'
import { ProjectTlDocument } from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import { useMemo } from 'react'
import { wadToFloat } from 'utils/format/formatNumber'
import { getSubgraphIdForProject } from 'utils/graph'
import { daysToMS, minutesToMS } from 'utils/units'
import { ProjectTimelinePoint, ProjectTimelineRange } from '../types'

const COUNT = 30

export function useProjectTimeline({
  projectId,
  pv,
  range,
}: {
  projectId: number
  pv: PV
  range: ProjectTimelineRange
}) {
  const { data: blockData, isLoading: isLoadingBlockNumbers } = useQuery({
    queryKey: ['block-numbers', range],
    queryFn: async () => {
      const dater = new EthDater(readProvider)

      const now = Date.now().valueOf() - minutesToMS(5)
      const startMS = now - daysToMS(range)

      return Promise.all([
        dater.getDate(new Date(startMS).toISOString()),
        dater.getDate(new Date(now).toISOString()),
      ]) as Promise<
        [
          { block: number; timestamp: number },
          { block: number; timestamp: number },
        ]
      >
    },
    staleTime: minutesToMS(5),
  })

  const { blocks, timestamps } = useMemo(() => {
    if (!blockData) return {}

    const [start, end] = blockData

    const blocks: Record<`block${number}`, number> = {
      block0: start.block,
    }
    const timestamps: number[] = [start.timestamp]

    // Calculate evenly distributed `count` (arbitrary) steps in between start and end. Timestamps are estimated and not guaranteed to match the actual timestamp for a block number, but this is good enough to show a trend.
    for (let i = 1; i < COUNT; i++) {
      const coeff = i / (COUNT - 1)

      blocks[`block${i}`] = Math.round(
        (end.block - start.block) * coeff + start.block,
      )
      timestamps.push(
        Math.round((end.timestamp - start.timestamp) * coeff + start.timestamp),
      )
    }

    return { blocks, timestamps }
  }, [blockData])

  const { data: v1v2v3QueryResult, loading: isLoadingQuery } = useProjectTlQuery({
    client,
    variables: {
      id: blocks ? getSubgraphIdForProject(pv, projectId) : '',
      ...blocks,
    },
    skip: pv === PV_V4
  })

  const { data: v4QueryResult } = useSubgraphQuery({
    document: ProjectTlDocument, 
    variables: {
      id: blocks ? projectId.toString() : '',
      ...blocks,
    },
    enabled: pv === PV_V4
  })

  const points = useMemo(() => {
    const queryResult = pv === PV_V4 ? v4QueryResult : v1v2v3QueryResult
    if (!queryResult || !timestamps) return

    const points: ProjectTimelinePoint[] = []

    for (let i = 0; i < COUNT; i++) {
      const point = (queryResult as ProjectTlQuery)[`p${i}` as keyof typeof queryResult]

      if (!point) continue

      points.push({
        timestamp: timestamps[i],
        trendingScore: wadToFloat(point.trendingScore),
        balance: wadToFloat(point.currentBalance),
        volume: wadToFloat(point.volume),
      })
    }

    return points
  }, [timestamps, v1v2v3QueryResult, v4QueryResult, pv])

  return {
    points,
    loading: isLoadingBlockNumbers || isLoadingQuery,
  }
}
