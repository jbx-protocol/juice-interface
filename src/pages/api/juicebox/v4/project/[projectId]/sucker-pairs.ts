import { resolveSuckers } from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'
import { enableCors } from 'lib/api/nextjs'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { wagmiConfig } from 'packages/v4/wagmiConfig'

const logger = getLogger('api/v4/project/[projectId]/sucker-pairs')

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

    const suckers = await resolveSuckers({
      config: wagmiConfig,
      chainId,
      projectId: BigInt(projectId as string),
    })

    // cache for 1 week
    res.setHeader(
      'Cache-Control',
      `s-maxage=${86400 * 7}, stale-while-revalidate`,
    )
    const data = { suckers }
    logger.info({ data })
    return res.status(200).json(data)
  } catch (err) {
    logger.error({ error: err })
    return res.status(500).json({ error: 'failed to resolve suckers' })
  }
}

export default handler
