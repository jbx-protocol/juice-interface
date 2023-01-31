import { SECONDS_IN_DAY } from 'constants/numbers'
import { readProvider } from 'constants/readProvider'
import EthDater from 'ethereum-block-by-date'
import { PV } from 'models/project'
import { BlockRef, ProjectTimelinePoint } from 'models/sepana'
import { querySubgraphRaw } from 'utils/graph'

export async function projectTimelinePointsForBlocks({
  blockRefs,
  projectId,
  createdAt,
  pv,
}: {
  blockRefs: BlockRef[]
  projectId: number
  createdAt: number
  pv: PV
}) {
  const timeline: ProjectTimelinePoint[] = []

  // Using single promise array allows us to await concurrent requests
  const promises: Promise<void>[] = []

  let queryNumber = 0

  // Query project volume and balance at each block
  for (let i = 0; i < blockRefs.length; i++) {
    const { block: number, timestamp } = blockRefs[i]

    if (timestamp < createdAt) continue

    queryNumber++

    if (queryNumber % 20 === 0) {
      // Arbitrary delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 250))
    }

    promises.push(
      querySubgraphRaw(
        {
          entity: 'project',
          keys: ['totalPaid', 'currentBalance', 'trendingScore'],
          where: [
            {
              key: 'projectId',
              value: projectId,
            },
            {
              key: 'pv',
              value: pv,
            },
          ],
          block: { number },
        },
        { retry: true },
      ).then(data => {
        if (!data?.projects.length) return

        const { currentBalance, totalPaid, trendingScore } = data.projects[0]

        timeline.push({
          balance: currentBalance,
          volume: totalPaid,
          trendingScore: trendingScore,
          timestamp,
        })
      }),
    )
  }

  await Promise.all(promises)

  return timeline.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
}

export async function getBlockRefs({
  durationDays,
  count,
}: {
  durationDays: number
  count: number
}) {
  const startMillis = Date.now() - durationDays * SECONDS_IN_DAY * 1000

  const dater = new EthDater(readProvider)

  // Get block refs at start and end date
  const [start, end]: [BlockRef, BlockRef] = await Promise.all([
    dater.getDate(new Date(startMillis).toISOString()),
    dater.getDate(new Date(Date.now() - 5 * 60 * 1000).toISOString()), // 5 min ago, avoids getting block that was mined too recently
  ])

  const blockRefs: BlockRef[] = []

  // Calculate evenly distributed `count` (arbitrary) steps in between start and end. Block numbers and timestamps aren't guaranteed to match, but this is good enough to show a trend.
  for (let coeff = 0; coeff < 1; coeff += 1 / count) {
    blockRefs.push({
      block: Math.round((end.block - start.block) * coeff + start.block),
      timestamp: Math.round(
        (end.timestamp - start.timestamp) * coeff + start.timestamp,
      ),
    })
  }

  return blockRefs
}
