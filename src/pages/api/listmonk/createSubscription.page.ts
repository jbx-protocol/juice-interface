import { createSubscription, getListID } from 'lib/listmonk'
import { NextApiRequest, NextApiResponse } from 'next'
import { JUICEBOX_LISTMONK_ID } from 'constants/listmonk'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  const { subscriptionData, subscribeToJBUpdates } = req.body ?? {}

  if (subscriptionData === undefined) {
    return res.status(400).json({ error: 'subscriptionData is required' })
  }

  // Return error if subscriptionData is malformed
  const { name, email, projectId, pv } = subscriptionData

  if (!name || !email || !projectId || !pv) {
    return res
      .status(400)
      .json({ error: 'Malformed subscriptionData: missing field(s)' })
  }

  if (pv !== '1' && pv !== '2') {
    return res
      .status(400)
      .json({ error: 'Malformed subscriptionData: pv must be "1" or "2".' })
  }

  try {
    const listId = await getListID(projectId, pv)
    if (!listId) {
      return res
        .status(400)
        .json({ error: `No list found for v${pv}p${projectId}.` })
    }

    await createSubscription(
      subscribeToJBUpdates ? [JUICEBOX_LISTMONK_ID, listId] : [listId],
      subscriptionData,
    )
    return res.status(201).json({ subscriptionData, subscribeToJBUpdates })
  } catch (e) {
    console.error('api::listmonk::createSubscription:error', e)
    return res.status(500).json({ error: 'failed to create subscription' })
  }
}

export default handler
