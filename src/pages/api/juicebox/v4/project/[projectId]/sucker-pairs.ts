import { JBVersion, resolveSuckers } from '@bananapus/nana-sdk-core'
import { JBChainId } from '@bananapus/nana-sdk-react'
import { enableCors } from 'lib/api/nextjs'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { wagmiConfig } from 'contexts/Para/Providers'

const logger = getLogger('api/v4/project/[projectId]/sucker-pairs')

/**
 * All the chains that the project is on. For single chain projects, that chain is included (length=1).
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  enableCors(res)

  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const { projectId } = req.query
    const chainId = Number(req.query.chainId as string) as JBChainId

    if (!projectId || !chainId) {
      return res
        .status(400)
        .json({ error: 'projectId and chainId is required' })
    }

    // Defaults to 4 for backwards compatibility with older clients.
    const version = req.query.version ? Number(req.query.version as string) : 4
    if (version !== 4 && version !== 5 && version !== 6) {
      return res.status(400).json({ error: 'version must be 4, 5 or 6' })
    }

    const suckers = await resolveSuckers({
      config: wagmiConfig,
      chainId,
      projectId: BigInt(projectId as string),
      version: version as JBVersion,
    })

    // cache for 1 week
    res.setHeader(
      'Cache-Control',
      `s-maxage=${86400 * 7}, stale-while-revalidate`,
    )

    const normalisedSuckers: {
      projectId: number
      peerChainId: JBChainId
    }[] =
      suckers?.map(s => {
        return {
          ...s,
          projectId: Number(s.projectId),
        }
      }) ?? []

    // add the current chain if it's not already in there
    if (!normalisedSuckers.find(s => s.peerChainId === chainId)) {
      normalisedSuckers.push({
        projectId: Number(projectId),
        peerChainId: chainId,
      })
    }
    const data = {
      suckers: normalisedSuckers,
    }
    logger.info({ data })
    return res.status(200).json(data)
  } catch (err) {
    logger.error({ error: err })
    return res.status(500).json({ error: 'failed to resolve suckers' })
  }
}

export default handler
