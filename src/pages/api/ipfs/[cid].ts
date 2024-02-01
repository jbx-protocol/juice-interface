import { ipfsGatewayFetch } from 'lib/api/ipfs'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'

const logger = getLogger('ipfs/[cid]')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req) {
    res.status(500).end()
  }
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  if (!req.query.cid) {
    return res.status(400).json({ error: 'cid not specified' })
  }

  try {
    const ipfsRes = await ipfsGatewayFetch(req.query.cid as string)
    // cache for 1 day
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    return res.status(200).json(ipfsRes.data)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: 'failed to fetch ipfs data' })
  }
}
