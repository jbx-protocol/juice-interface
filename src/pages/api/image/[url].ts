import axios from 'axios'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'

// Make sure an image is an accepted media type. Pass image URLs with encodeURIComponent
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logger = getLogger('api/image/[url]')

  const imageUrl = req.query?.url as string
  if (!imageUrl) {
    res.status(400).send('Bad Request: url not provided')
    return
  }

  try {
    const imageRes = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    })

    // Ensure that the header reflects a valid image MIME type
    const contentType = imageRes.headers['content-type']
    const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!acceptedTypes.includes(contentType)) {
      return res.status(403).json({ error: 'Forbidden. Invalid content-type.' })
    }

    // Check the file signature (magic numbers) https://en.wikipedia.org/wiki/List_of_file_signatures
    const data = new Uint8Array(imageRes.data)
    if (
      !(data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) && // JPEG
      !(
        data[0] === 0x89 &&
        data[1] === 0x50 &&
        data[2] === 0x4e &&
        data[3] === 0x47
      ) && // PNG
      !(
        data[0] === 0x47 &&
        data[1] === 0x49 &&
        data[2] === 0x46 &&
        data[3] === 0x38
      ) // GIF
    ) {
      return res
        .status(403)
        .json({ error: 'Forbidden. Invalid file signature.' })
    }

    res.setHeader('Content-Type', contentType)
    return res.end(imageRes.data, 'binary')
  } catch (error) {
    logger.error({ error })
    return res.status(500).json({ error: 'failed to resolve image' })
  }
}
