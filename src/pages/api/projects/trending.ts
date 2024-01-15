import { PV_V1, PV_V2 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import {
  OrderDirection,
  Project_OrderBy,
  QueryProjectsArgs,
  TrendingProjectsDocument,
  TrendingProjectsQuery,
} from 'generated/graphql'
import { serverClient } from 'lib/apollo/serverClient'
import { NextApiHandler } from 'next'
import { getSubgraphIdForProject } from 'utils/graph'

const CACHE_MAXAGE = 60 * 5 // 5 minutes

const V1_ARCHIVED_SUBGRAPH_IDS = V1ArchivedProjectIds.map(projectId =>
  getSubgraphIdForProject(PV_V1, projectId),
)
const V2_ARCHIVED_SUBGRAPH_IDS = V2ArchivedProjectIds.map(projectId =>
  getSubgraphIdForProject(PV_V2, projectId),
)
const ARCHIVED_SUBGRAPH_IDS = [
  ...V1_ARCHIVED_SUBGRAPH_IDS,
  ...V2_ARCHIVED_SUBGRAPH_IDS,
]

const handler: NextApiHandler = async (req, res) => {
  const rawFirst = req.query.count // TODO probably can use Yup for this
  const first = typeof rawFirst === 'string' ? parseInt(rawFirst) : undefined
  try {
    const projectsRes = await serverClient.query<
      TrendingProjectsQuery,
      QueryProjectsArgs
    >({
      query: TrendingProjectsDocument,
      variables: {
        where: {
          trendingScore_gt: '0' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          ...(ARCHIVED_SUBGRAPH_IDS.length
            ? { id_not_in: ARCHIVED_SUBGRAPH_IDS }
            : {}), // `id_not_in: <empty-array>` will return 0 results
        },
        first,
        orderBy: Project_OrderBy.trendingScore,
        orderDirection: OrderDirection.desc,
      },
    })

    res.setHeader(
      'Cache-Control',
      `s-maxage=${CACHE_MAXAGE}, stale-while-revalidate`,
    )
    return res.status(200).json(projectsRes.data.projects)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

export default handler
