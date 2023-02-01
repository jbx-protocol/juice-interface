import { createContactMessage } from 'lib/discord'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  const { name, contact, contactPlatform, subject, message } = req.body ?? {}
  if (message === undefined) {
    return res.status(400).json({ error: 'a message is required' })
  }

  try {
    await createContactMessage(name, contact, contactPlatform, subject, message)
    return res
      .status(201)
      .json({ name, contact, contactPlatform, subject, message })
  } catch (e) {
    console.error('api::discord::contact::error', e)
    return res.status(500).json({ error: 'failed to send contact message' })
  }
}

export default handler
