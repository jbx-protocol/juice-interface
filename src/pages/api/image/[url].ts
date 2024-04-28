import axios from 'axios'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'

// Make sure an image is an accepted media type. Pass image URLs with encodeURIComponent
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logger = getLogger('api/image/[url]')

  logger.info({ data: { query: req.query } })
  const imageUrl = req.query?.url as string
  if (!imageUrl) {
    logger.error({ error: 'Bad Request: Invalid or missing URL.' })
    return res
      .status(400)
      .json({ error: 'Bad Request: Invalid or missing URL.' })
  }

  try {
    // Fetch the first 4 bytes of the image to check its headers and file signature.
    const imageRes = await axios
      .get(imageUrl, {
        headers: {
          Range: 'bytes=0-3',
        },
        responseType: 'arraybuffer',
      })
      .catch(error => {
        logger.error({ error })
        return res
          .status(502)
          .json({ error: `Could not get image headers or file signature.` })
      })

    if (!imageRes || !imageRes.headers) {
      return res.status(500).json({ error: 'Failed to process image.' })
    }

    // Ensure that the header reflects a valid image MIME type
    const contentType = imageRes.headers['content-type']
    const acceptedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/vnd.mozilla.apng',
    ]
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
      ) && // PNG / APNG
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

    return res.redirect(imageUrl).end()
  } catch (error) {
    logger.error({ error })
    return res.status(500).json({ error: 'failed to resolve image' })
  }
}
