import { NextApiRequest, NextApiResponse } from 'next'
import { getPinata } from 'utils/pinata'

interface ApiRequest extends NextApiRequest {
  query: {
    cid: string
  }
}

export const handler = async (req: ApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { cid } = req.query

    try {
      const pinata = getPinata()
      const data = await pinata.hashMetadata(cid, req.body)
      return res.json(data)
    } catch (e) {
      console.error(e)
      return res.status(500)
    }
  }
}
