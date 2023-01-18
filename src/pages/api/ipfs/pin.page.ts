import { PinataMetadata } from '@pinata/sdk'
import { pin } from 'lib/infura/ipfs'
import { getPinata } from 'lib/pinata'
import { NextApiRequest, NextApiResponse } from 'next'

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
  if (req.method !== 'POST') res.status(405).end()

  try {
    const { data, options } = req.body

    const pinata = getPinata()
    // pin on Pinata
    const pinData = await pinata.pinJSONToIPFS(data, options)

    // pin on Infura too.
    // TODO eventually we should only pin on Infura.
    try {
      await pin(data).then(_res =>
        res.status(200).json({
          message: 'Pinned to Infura',
          cid: _res.Hash,
        }),
      )
    } catch (e) {
      console.error(e)
    }

    return res.status(200).json({
      message: 'Pinned to Pinata',
      pinData,
    })
  } catch (error) {
    return res.status(500).end()
  }
}

export default handler
