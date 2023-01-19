import { createSubscription } from 'lib/api/juicenews'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  if (req.body.email === undefined) {
    return res.status(400).json({ error: 'email is required' })
  }

  try {
    await createSubscription(req.body.email)
    return res.status(200)
  } catch (e) {
    console.error('api::juicenews::subscription::error', e)
    return res.status(500).json({ error: 'failed to create subscription' })
  }
}

export default handler
