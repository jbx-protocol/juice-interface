import { useJBChainId } from 'juice-sdk-react'
import { getBendystrawClient } from 'lib/apollo/bendystrawClient'
import { useProjectQuery, useSuckerGroupTlQuery } from 'generated/v4v5/graphql'
import { useMemo } from 'react'
import { wadToFloat } from 'utils/format/formatNumber'
import { ProjectTimelinePoint, ProjectTimelineRange } from 'components/VolumeChart/types'

/**
 * Convert volume/balance value from token decimals to float
 * Volume in Bendystraw is stored in the token's native decimals (6 for USDC, 18 for ETH)
 */
function formatVolumeValue(value: string | bigint, decimals: number = 18): number {
  const num = typeof value === 'string' ? BigInt(value) : value
  const divisor = BigInt(10) ** BigInt(decimals)
  // Convert to float with proper decimal places
  return Number(num) / Number(divisor)
}

export function useV4V5ProjectTimeline({
  projectId,
  range,
  version,
}: {
  projectId: number
  range: ProjectTimelineRange
  version: number
}) {
  const chainId = useJBChainId()

  // Query project data first to get creation date
  const { data: project, loading: isLoadingProject } = useProjectQuery({
    client: getBendystrawClient(chainId),
    variables: {
      chainId: chainId || 0,
      projectId,
      version,
    },
    skip: !chainId || !projectId || projectId === 0,
  })

  // Generate clean day-boundary timestamps (no blockchain queries needed)
  const timestamps = useMemo(() => {
    const now = new Date()
    now.setHours(23, 59, 59, 999) // End of today

    let start = new Date(now)
    start.setDate(start.getDate() - range + 1)
    start.setHours(0, 0, 0, 0) // Start of first day

    // If project was created after the calculated start date, use creation date instead
    if (project?.project?.createdAt) {
      const projectCreated = new Date(project.project.createdAt * 1000)
      projectCreated.setHours(0, 0, 0, 0)
      if (projectCreated > start) {
        start = projectCreated
      }
    }

    const timestamps: number[] = []
    const currentDate = new Date(start)

    // Calculate actual number of days in the range
    const actualDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Determine count and increment based on actual range
    let count: number
    let increment: number

    if (actualDays <= 30) {
      // For ranges up to 30 days, show daily points
      count = actualDays
      increment = 1
    } else {
      // For longer ranges, show 30 points evenly distributed
      count = 30
      increment = Math.floor(actualDays / 30)
    }

    for (let i = 0; i < count; i++) {
      timestamps.push(Math.floor(currentDate.getTime() / 1000))
      currentDate.setDate(currentDate.getDate() + increment)
    }

    return timestamps
  }, [range, project?.project?.createdAt])

  // Query timeline data
  const { data: queryResult, loading: isLoadingTimeline } = useSuckerGroupTlQuery({
    client: getBendystrawClient(chainId),
    skip: !project?.project?.suckerGroupId || projectId === 0,
    variables: {
      suckerGroupId: project?.project?.suckerGroupId,
      startTimestamp: timestamps[0],
      endTimestamp: timestamps[timestamps.length - 1],
    },
  })

  // Build chart points
  const points: ProjectTimelinePoint[] | undefined = useMemo(() => {
    if (!timestamps || !project?.project) return
    if (queryResult === undefined) return // Still loading

    // Get project decimals for proper volume/balance conversion
    const decimals = project.project.decimals ? Number(project.project.decimals) : 18

    const previous = queryResult.previous.items.length
      ? queryResult.previous.items[0]
      : undefined

    const rangeItems = queryResult.range.items.map(item => ({
      timestamp: item.timestamp,
      volume: formatVolumeValue(item.volume, decimals),
      balance: formatVolumeValue(item.balance, decimals),
      trendingScore: wadToFloat(item.trendingScore), // Trending score is always in wad
    }))

    // Base values to use when no data exists
    const baseValues = previous ? {
      volume: formatVolumeValue(previous.volume, decimals),
      balance: formatVolumeValue(previous.balance, decimals),
      trendingScore: wadToFloat(previous.trendingScore),
    } : {
      volume: 0,
      balance: 0,
      trendingScore: 0,
    }

    // Build points array with all timestamps for smooth hover
    const points: ProjectTimelinePoint[] = []

    if (rangeItems.length > 0) {
      // We have actual data - use it and fill gaps
      for (let i = 0; i < timestamps.length; i++) {
        // Find the most recent data point before or at this timestamp
        const relevantData = rangeItems
          .filter(item => item.timestamp <= timestamps[i])
          .sort((a, b) => b.timestamp - a.timestamp)[0]

        if (relevantData) {
          points.push({
            timestamp: timestamps[i], // Use our generated timestamp, not the moment's timestamp
            volume: relevantData.volume,
            balance: relevantData.balance,
            trendingScore: relevantData.trendingScore,
          })
        } else {
          // Before any data exists, use base values
          points.push({
            timestamp: timestamps[i],
            ...baseValues,
          })
        }
      }
    } else {
      // No data in range - create flat line with base values
      for (let i = 0; i < timestamps.length; i++) {
        points.push({
          timestamp: timestamps[i],
          ...baseValues,
        })
      }
    }

    return points
  }, [queryResult, timestamps, project?.project])

  return {
    points,
    loading: isLoadingProject || isLoadingTimeline,
    projectToken: project?.project?.token ?? undefined,
    projectDecimals: project?.project?.decimals ? Number(project.project.decimals) : undefined,
  }
}
