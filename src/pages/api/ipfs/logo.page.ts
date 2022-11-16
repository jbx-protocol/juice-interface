import { t } from '@lingui/macro'
import formidable from 'formidable'
import fs from 'fs'
import { pin } from 'lib/infura/ipfs'
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

    incoming.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          error: t`Error parsing form`,
        })
      }
      const file = files.file as formidable.File
      const stream = fs.createReadStream(file.filepath)
      let options
      if (fields.pinataMetadata) {
        const pinataMetadata = JSON.parse(fields.pinataMetadata as string)
        options = {
          pinataMetadata,
        }
      } else {
        options = undefined
      }
      const pinata = getPinata()
      return pinata
        .pinFileToIPFS(stream, options)
        .then(result => {
          // pin on Infura too.
          // TODO eventually we should only pin on Infura.
          try {
            pin(result.IpfsHash)
          } catch (e) {
            console.error(e)
          }
          return res.status(200).json(result)
        })
        .catch(err => {
          return res.status(500).json({
            error: err.message,
          })
        })
    })
  } catch (err) {
    return res.status(500).json({
      error: t`Error uploading file`,
    })
  }
}

export default handler
