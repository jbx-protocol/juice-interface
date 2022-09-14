import { getPinata } from 'lib/pinata'
import { NextApiRequest, NextApiResponse } from 'next'

interface ApiRequest extends NextApiRequest {
  query: {
    cid: string
  }
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { cid } = req.query

    try {
      const pinata = getPinata()
      const data = await pinata.hashMetadata(cid, req.body)
      return res.json(data)
    } catch (e) {
      return res.status(500)
    }
  }
}

export default handler
