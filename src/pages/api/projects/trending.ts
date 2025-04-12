import { BigNumber } from '@ethersproject/bignumber'
import { PV_V1, PV_V2, PV_V4 } from 'constants/pv'
import { RomanStormVariables } from 'constants/romanStorm'
import {
  QueryProjectsArgs,
  TrendingProjectsDocument,
  TrendingProjectsQuery,
} from 'generated/graphql'
import { JBChainId } from 'juice-sdk-core'
import { sudoPublicDbClient } from 'lib/api/supabase/clients'
import { serverClient } from 'lib/apollo/serverClient'
import { NextApiHandler } from 'next'
import { V1ArchivedProjectIds } from 'packages/v1/constants/archivedProjects'
import { V2ArchivedProjectIds } from 'packages/v2v3/constants/archivedProjects'
import { getSubgraphIdForProject } from 'utils/graph'
import { parseDBProjectsRow } from 'utils/sgDbProjects'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'viem/chains'

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
  const rawFirst = req.query.count
  const limit = typeof rawFirst === 'string' ? parseInt(rawFirst) : undefined

  try {
    // Query trending projects from Supabase database
    const { data: projectsData, error } = await sudoPublicDbClient
      .from('projects')
      .select('*')
      .gt('trending_score', '0')
      // .not('id', 'in', ARCHIVED_SUBGRAPH_IDS)
      // .not('id', 'in', V2_BLOCKLISTED_PROJECTS)
      .not('archived', 'is', true)
      .order('trending_score', { ascending: false })
      .limit(limit || 100)

    if (error) {
      throw error
    }

    // Parse DB projects into the format expected by the frontend
    let projects = projectsData.map(parseDBProjectsRow)
    if (process.env.NEXT_PUBLIC_V4_ENABLED === 'true') {
      projects = projects.filter(p => p.pv === PV_V4)
    } else {
      projects = projects.filter(p => p.pv !== PV_V4)
    }
    if (process.env.NEXT_PUBLIC_TESTNET === 'true') {
      projects = projects.filter(p =>
        (
          [
            sepolia.id,
            optimismSepolia.id,
            baseSepolia.id,
            arbitrumSepolia.id,
          ] as JBChainId[]
        ).includes(p.chainId as JBChainId),
      )
    } else {
      projects = projects.filter(p =>
        (
          [mainnet.id, optimism.id, base.id, arbitrum.id] as JBChainId[]
        ).includes(p.chainId as JBChainId),
      )
    }

    try {
      // Handle the Roman Storm special case
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
          volume: BigNumber.from(romanProject.volume ?? 0)
            .sub(BigNumber.from(romanProjectSnapshot.volume ?? 0))
            .toString(), // Incorrect types are declared
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
