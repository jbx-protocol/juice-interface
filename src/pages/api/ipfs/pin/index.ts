import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'
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

export const handler = async (req: ApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { tag } = req.query
    if (!tag) return res.status(400)

    try {
      const data = await getPinnedListByTag(tag)
      return res.json(data)
    } catch (e) {
      console.error(e)
      return res.status(500)
    }
  }

  if (req.method === 'POST') {
    try {
      const { data, options } = req.body

      const pinata = getPinata()
      const pinData = await pinata.pinJSONToIPFS(data, options)

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
}
