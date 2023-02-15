import { pinHash } from 'lib/infura/ipfs'
import { getPinata } from 'lib/pinata'
import { NextApiRequest, NextApiResponse } from 'next'

interface ApiRequest extends NextApiRequest {
  query: {
    tag: string
  }
  body: {
    data: string
  }
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') res.status(405).end()

  try {
    const { data } = req.body

    const pinata = getPinata()
    // pin on Pinata
    const pinData = await pinata.pinJSONToIPFS(data)

    // pin on Infura too.
    // TODO eventually we should only pin on Infura.
    try {
      pinHash(pinData.IpfsHash)
    } catch (e) {
      console.error(e)
    }

    return res.status(200).json({
      ...pinData,
    })
  } catch (error) {
    return res.status(500)
  }
}

export default handler
