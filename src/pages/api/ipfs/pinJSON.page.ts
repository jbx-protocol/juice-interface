import { InfuraPinResponse, pinFile } from 'lib/infura/ipfs'
import { NextApiRequest, NextApiResponse } from 'next'

interface ApiRequest extends NextApiRequest {
  body: {
    data: string
  }
}

const handler = async (
  req: ApiRequest,
  res: NextApiResponse<InfuraPinResponse | { error: string }>,
) => {
  if (req.method !== 'POST') res.status(405).end()

  try {
    const { data } = req.body

    const pinJson = await pinFile(JSON.stringify(data))

    return res.status(200).json(pinJson)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'failed to pin data' })
  }
}

export default handler
