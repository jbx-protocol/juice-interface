import { readProvider } from 'constants/readProvider'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404)
  }

  // cache for a day
  res.setHeader('Cache-Control', 's-maxage=86400')

  try {
    const { address } = req.query

    if (!address) {
      return res.status(400).json({ error: 'address is required' })
    }

    console.info('api::ens::resolve::resolving address', address)
    const name = await readProvider.lookupAddress(address as string)

    return res.status(200).json({ name, address })
  } catch (err) {
    console.error('api::ens::resolve::error', err)

    return res.status(500)
  }
}

export default handler
