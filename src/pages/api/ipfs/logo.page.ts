import { NextApiRequest, NextApiResponse } from 'next'

import { pinFileToIpfs, UploadFormData } from 'utils/pinata'

interface ApiRequest extends NextApiRequest {
  body: {
    data: UploadFormData
  }
}

export const handler = async (req: ApiRequest, res: NextApiResponse) => {
  try {
    const { data } = req.body

    const pinData = await pinFileToIpfs(data)

    res.status(200).json({
      pinData,
    })
  } catch (error) {
    console.error(error)
    return res.status(500)
  }
}
