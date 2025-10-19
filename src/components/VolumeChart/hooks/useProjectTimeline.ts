import { PV_V2, PV_V4 } from 'constants/pv'
import { useProjectTlQuery, useProjectsQuery } from 'generated/graphql'
import { daysToMS, minutesToMS } from 'utils/units'
import { ProjectTimelinePoint, ProjectTimelineRange } from '../types'

import { useQuery } from '@tanstack/react-query'
import { readProvider } from 'constants/readProvider'
import { RomanStormVariables } from 'constants/romanStorm'
import EthDater from 'ethereum-block-by-date'
import { useJBChainId } from 'juice-sdk-react'
import { client } from 'lib/apollo/client'
import { PV } from 'models/pv'
import { useMemo } from 'react'
import { wadToFloat } from 'utils/format/formatNumber'
import { getSubgraphIdForProject } from 'utils/graph'

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
  const chainId = useJBChainId()

  const exceptionTimestamp = useMemo(() => {
    return RomanStormVariables.PROJECT_ID === projectId
      ? RomanStormVariables.SNAPSHOT_TIMESTAMP
      : null
  }, [projectId])

  const { data: romanStormData } = useProjectsQuery({
    client,
    fetchPolicy: 'no-cache',
    skip: projectId !== RomanStormVariables.PROJECT_ID || pv === PV_V4,
    variables: {
      where: {
        projectId,
        pv: PV_V2,
      },
      block: { number: RomanStormVariables.SNAPSHOT_BLOCK },
    },
  })

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

  const { data: v1v2v3QueryResult, loading: isLoadingQuery } =
    useProjectTlQuery({
      client,
      variables: {
        id: blocks ? getSubgraphIdForProject(pv, projectId) : '',
        ...blocks,
      },
    })

  const points = useMemo(() => {
    if (!v1v2v3QueryResult || !timestamps) return

    const points: ProjectTimelinePoint[] = []

    for (let i = 0; i < COUNT; i++) {
      const point = v1v2v3QueryResult[`p${i}` as keyof typeof v1v2v3QueryResult]

      if (!point) continue
      if (exceptionTimestamp && exceptionTimestamp > timestamps[i]) {
        points.push({
          timestamp: timestamps[i],
          trendingScore: 0,
          balance: 0,
          volume: 0,
        })
      } else {
        const volume =
          projectId === RomanStormVariables.PROJECT_ID
            ? point.volume.sub(romanStormData?.projects[0].volume || 0)
            : point.volume

        points.push({
          timestamp: timestamps[i],
          trendingScore: wadToFloat(point.trendingScore),
          balance: wadToFloat(point.currentBalance),
          volume: wadToFloat(volume),
        })
      }
    }

    return points
  }, [
    timestamps,
    v1v2v3QueryResult,
    projectId,
    exceptionTimestamp,
    romanStormData?.projects,
  ])

  return {
    v1v2v3Points: points,
    loading: isLoadingBlockNumbers || isLoadingQuery,
  }
}
