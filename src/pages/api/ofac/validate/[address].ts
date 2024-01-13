import axios from 'axios'
import { isAddress } from 'ethers/lib/utils'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'

const OFAC_API = 'https://api.wewantjusticedao.org/donation/validate'

const logger = getLogger('api/ofac/validate/[address]')

/**
 * Get project data from project handle
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { address } = req.query as { address: string }
  if (!address || !isAddress(address)) {
    return res.status(400).json({ error: 'address is required' })
  }

  const {
    data: { isGoodAddress },
  } = await axios.get<{ isGoodAddress: boolean }>(
    `${OFAC_API}?address=${address}`,
  )

  // cache for a day
  // res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  logger.info({ data: { address, isGoodAddress } })
  return res.status(200).json({ isGoodAddress })
}
