import { PV_V1, PV_V2, PV_V4 } from 'constants/pv'
import { RomanStormVariables } from 'constants/romanStorm'
import { BigNumber } from 'ethers'
import {
  OrderDirection,
  Project_OrderBy,
  QueryProjectsArgs,
  TrendingProjectsDocument,
  TrendingProjectsQuery,
} from 'generated/graphql'
import { serverClient, v4SepoliaServerClient } from 'lib/apollo/serverClient'
import { NextApiHandler } from 'next'
import { V1ArchivedProjectIds } from 'packages/v1/constants/archivedProjects'
import { V2ArchivedProjectIds } from 'packages/v2v3/constants/archivedProjects'
import { TrendingProjectsV4Document } from 'packages/v4/graphql/client/graphql'
import { getSubgraphIdForProject } from 'utils/graph'
import { sepolia } from 'viem/chains'

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
    const [projectsRes, v4SepoliaProjectsRes] = await Promise.all([
      serverClient.query<TrendingProjectsQuery, QueryProjectsArgs>({
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
      }),
      v4SepoliaServerClient.query<TrendingProjectsQuery, QueryProjectsArgs>({
        query: TrendingProjectsV4Document,
        variables: {
          where: {
            trendingScore_gt: '0' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          },
          first,
          orderBy: Project_OrderBy.trendingScore,
          orderDirection: OrderDirection.desc,
        },
      }),
    ])

    const projects = [
      ...projectsRes.data.projects,
      ...v4SepoliaProjectsRes.data.projects.map(p => {
        return { ...p, chainId: sepolia.id, pv: PV_V4 }
      }),
    ]

    try {
      const romanProjectIndex = projects.findIndex(
        el => el.projectId === RomanStormVariables.PROJECT_ID && el.pv === '2',
      )

      if (romanProjectIndex >= 0) {
        const filteredProjects = await serverClient.query<
          TrendingProjectsQuery,
          QueryProjectsArgs
        >({
          fetchPolicy: 'no-cache',
          query: TrendingProjectsDocument,
          variables: {
            where: {
              pv: '2',
              projectId: RomanStormVariables.PROJECT_ID,
            },
            block: {
              number: RomanStormVariables.SNAPSHOT_BLOCK,
            },
          },
        })

        const [romanProjectSnapshot] = filteredProjects.data.projects
        const romanProject = projects[romanProjectIndex]

        projects[romanProjectIndex] = {
          ...projects[romanProjectIndex],
          volume: BigNumber.from(romanProject.volume ?? 0).sub(
            BigNumber.from(romanProjectSnapshot.volume ?? 0),
          ), // Incorrect types are declared
          paymentsCount:
            romanProject.paymentsCount - romanProjectSnapshot.paymentsCount,
        }
      }
    } catch {}

    res.setHeader(
      'Cache-Control',
      `s-maxage=${CACHE_MAXAGE}, stale-while-revalidate`,
    )

    return res.status(200).json(projects)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

export default handler
