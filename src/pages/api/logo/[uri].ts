import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

// Make sure a project logo is an accepted media type
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const imageUri = req.query?.uri as string
  if (!imageUri) {
    res.status(400).send('Bad Request: uri not provided')
    return
  }

  try {
    const response = await axios.head(imageUri)
    const contentType = response.headers['content-type']
    const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']

    if (!acceptedTypes.includes(contentType)) {
      res.status(403).send('Forbidden')
      return
    }

    const image = await axios.get(imageUri, { responseType: 'arraybuffer' })
    res.setHeader('Content-Type', contentType)
    res.send(image.data)
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
}
