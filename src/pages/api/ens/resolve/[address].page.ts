import { resolveAddress } from 'lib/ens/resolver'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404)
  }

  // cache for a day
  res.setHeader('Cache-Control', 's-maxage=86400')

  try {
    const { address } = req.query

    console.info('api::ens::resolve::resolving address=>', address)
    const name = await resolveAddress(address as string)

    return res.status(200).json({ name, address })
  } catch (err) {
    return res.status(500)
  }
}

export default handler
