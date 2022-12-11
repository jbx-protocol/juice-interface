import { t } from '@lingui/macro'
import formidable from 'formidable'
import fs from 'fs'
import { getPinata } from 'lib/pinata'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const incoming = new formidable.IncomingForm()

    const result = await new Promise((resolve, reject) => {
      incoming.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err)
        }

        const file = files.file as formidable.File
        const stream = fs.createReadStream(file.filepath)

        let options = undefined
        if (fields.pinataMetadata) {
          const pinataMetadata = JSON.parse(fields.pinataMetadata as string)
          options = {
            pinataMetadata,
          }
        }

        const pinata = getPinata()

        const pinResult = await pinata.pinFileToIPFS(stream, options) // pin to pinata

        resolve(pinResult)
      })
    })

    return res.status(200).json(result)
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: t`Error uploading file`,
    })
  }
}

export default handler
