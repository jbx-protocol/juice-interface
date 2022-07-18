import { NextApiRequest, NextApiResponse } from 'next'

import { pinFileToIpfs, UploadFormData } from 'utils/pinata'

interface ApiRequest extends NextApiRequest {
  body: {
    data: UploadFormData
  }
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  try {
    const { data } = req.body

    const pinData = await pinFileToIpfs(data)

    res.status(200).json({
      pinData,
    })
  } catch (error) {
    return res.status(500)
  }
}

export default handler
