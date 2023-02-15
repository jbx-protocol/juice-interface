import { t } from '@lingui/macro'
import formidable from 'formidable'
import fs from 'fs'
import * as infuraIpfsApi from 'lib/infura/ipfs'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

export interface IpfsPinFileResponse {
  IpfsHash: string
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IpfsPinFileResponse | { error: string }>,
) => {
  if (req.method !== 'POST') res.status(405).end()

  try {
    const incoming = new formidable.IncomingForm()

    const result = await new Promise<infuraIpfsApi.InfuraPinFileResponse>(
      (resolve, reject) => {
        incoming.parse(req, async (err, fields, files) => {
          if (err) {
            reject(err)
          }

          const file = files.file as formidable.File
          const stream = fs.createReadStream(file.filepath)

          const infuraRes = await infuraIpfsApi.pinFile(stream) // pin to infura
          resolve(infuraRes)
        })
      },
    )

    return res.status(200).json({ IpfsHash: result.Hash })
  } catch (err) {
    console.error(err)

    return res.status(500).json({
      error: t`Error uploading file`,
    })
  }
}

export default handler
