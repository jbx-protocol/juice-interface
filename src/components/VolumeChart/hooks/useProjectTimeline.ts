import { PV_V2, PV_V4 } from 'constants/pv'
import { useProjectTlQuery, useProjectsQuery } from 'generated/graphql'
import { useProjectQuery, useSuckerGroupTlQuery } from 'generated/v4/graphql'
import { daysToMS, minutesToMS } from 'utils/units'
import { ProjectTimelinePoint, ProjectTimelineRange } from '../types'

import { useQuery } from '@tanstack/react-query'
import { readProvider } from 'constants/readProvider'
import { RomanStormVariables } from 'constants/romanStorm'
import EthDater from 'ethereum-block-by-date'
import { useJBChainId } from 'juice-sdk-react'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
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
      skip: pv === PV_V4,
    })

  const { data: project } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      chainId: chainId || 0,
      projectId,
      version: parseInt(pv)
    },
    skip: pv !== PV_V4 || !chainId || !projectId,
  })

  const { data: v4QueryResult } = useSuckerGroupTlQuery({
    client: bendystrawClient,
    skip: pv !== PV_V4 || !project?.project?.suckerGroupId,
    variables: {
      suckerGroupId: project?.project?.suckerGroupId,
      startTimestamp: timestamps?.[0],
      endTimestamp: timestamps?.[timestamps.length - 1],
    },
  })

  const v1v2v3Points = useMemo(() => {
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

  // unlike v1v2v3 points where we always query an arbitrary number of points for a specified time window, we can trust that v4 points only exist where a change has occurred, leaving no need to "fill in the gaps".
  const v4Points: ProjectTimelinePoint[] | undefined = useMemo(() => {
    if (!v4QueryResult || !timestamps || !project?.project) return

    // first point before the current timestamp range. If undefined, assume project was created within timestamp range
    const previous = v4QueryResult.previous.items.length
      ? v4QueryResult.previous.items[0]
      : undefined
    // last point within the timestamp range
    const final = v4QueryResult.range.items.length
      ? v4QueryResult.range.items[v4QueryResult.range.items.length - 1]
      : undefined

    // extrapolate first point. If project was created before timestamp window, use previous point data. Otherwise use project.createdAt
    const firstPoint = previous
      ? {
          timestamp: timestamps[0],
          volume: wadToFloat(previous.volume),
          balance: wadToFloat(previous.balance),
          trendingScore: wadToFloat(previous.trendingScore),
        }
      : {
          timestamp: project.project.createdAt,
          volume: 0,
          balance: 0,
          trendingScore: 0,
        }

    // extrapolate last point to fill in data since last project update.
    // If there's no final point in range, use the previous point data to maintain continuity
    const lastPointData = final || previous
    const lastPoint = {
      timestamp: timestamps?.[timestamps.length - 1],
      volume: wadToFloat(lastPointData?.volume) || firstPoint.volume,
      balance: wadToFloat(lastPointData?.balance) || firstPoint.balance,
      trendingScore:
        wadToFloat(lastPointData?.trendingScore) || firstPoint.trendingScore,
    }

    return [
      firstPoint,
      ...v4QueryResult.range.items.map(
        ({ volume, balance, trendingScore, timestamp }) => ({
          timestamp,
          volume: wadToFloat(volume),
          balance: wadToFloat(balance),
          trendingScore: wadToFloat(trendingScore),
        }),
      ),
      lastPoint,
    ]
  }, [v4QueryResult, timestamps, project?.project])

  return {
    v1v2v3Points,
    v4Points,
    loading: isLoadingBlockNumbers || isLoadingQuery,
  }
}
