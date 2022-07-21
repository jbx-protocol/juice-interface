import { NextApiRequest, NextApiResponse } from 'next'
import { getPinata, getPinnedListByTag } from 'utils/pinata'
import { PinataMetadata } from '@pinata/sdk'

interface ApiRequest extends NextApiRequest {
  query: {
    tag: string
  }
  body: {
    data: string
    options: {
      pinataMetadata: PinataMetadata
    }
  }
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { tag } = req.query
    if (!tag) return res.status(400)

    try {
      const data = await getPinnedListByTag(tag)
      return res.json(data)
    } catch (e) {
      return res.status(500)
    }
  }

  if (req.method === 'POST') {
    try {
      const { data, options } = req.body

      const pinata = getPinata()
      const pinData = await pinata.pinJSONToIPFS(data, options)

      res.status(200).json({
        ...pinData,
      })
    } catch (error) {
      return res.status(500)
    }
  }
}

export default handler
