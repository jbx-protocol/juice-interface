import { createSubscription } from 'lib/beehiiv'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  const { email } = req.body ?? {}
  if (email === undefined) {
    return res.status(400).json({ error: 'email is required' })
  }

  try {
    await createSubscription(email)
    return res.status(201).json({ email })
  } catch (e) {
    console.error('api::juicenews::subscription::error', e)
    return res.status(500).json({ error: 'failed to create subscription' })
  }
}

export default handler
