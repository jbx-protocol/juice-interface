import { createSubscription } from 'lib/beehiiv'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'

const logger = getLogger('api/juicenews/subscription')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404).json('not found')
  }

  const { email } = req.body ?? {}
  logger.info({ email }, 'api::juicenews::subscription::create')

  if (email === undefined) {
    return res.status(400).json({ error: 'email is required' })
  }

  try {
    const subscriptionRes = await createSubscription(email)
    if (subscriptionRes?.data.toast?.status === 'error') {
      logger.error(
        { email, error: subscriptionRes.data.toast },
        'api::juicenews::subscription::error',
      )

      throw new Error(subscriptionRes.data.toast.message)
    }
    res.status(201).json({ email })

    logger.info({ email }, 'api::juicenews::subscription::created')
    return
  } catch (e) {
    logger.error({ email, error: e }, 'api::juicenews::subscription::error')
    return res.status(500).json({ error: 'failed to create subscription' })
  }
}

export default handler
