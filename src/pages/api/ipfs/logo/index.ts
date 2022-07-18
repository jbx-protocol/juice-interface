import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      res.status(500).json({
        error: axiosError.message,
      })
    } else {
      res.status(500).json({
        error: error,
      })
    }
  }
}
