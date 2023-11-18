import { CV_V3 } from 'constants/cv'
import { WAD_DECIMALS } from 'constants/numbers'
import { loadJBPrices } from 'hooks/JBPrices/loadJBPrices'
import { enableCors } from 'lib/api/nextjs'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { fromWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'

const PRICE_REFRESH_INTERVAL_SECONDS = 5 // 5 seconds

const logger = getLogger('api/juicebox/prices/ethusd')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  enableCors(res)

  if (req.method !== 'GET') {
    return res.status(404)
  }

  try {
    const JBPrices = await loadJBPrices({ cv: CV_V3 })
    const priceRaw = await JBPrices?.priceFor(
      V2V3_CURRENCY_USD,
      V2V3_CURRENCY_ETH,
      WAD_DECIMALS,
    )

    const price = priceRaw ? fromWad(priceRaw) : 0

    res.setHeader(
      'Cache-Control',
      `s-maxage=${PRICE_REFRESH_INTERVAL_SECONDS}, stale-while-revalidate`,
    )
    return res.status(200).json({ price })
  } catch (err) {
    logger.error({ error: err })
    return res.status(500).json({ error: 'failed to fetch price' })
  }
}

export default handler
