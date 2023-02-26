import { broadcastMessage, getListID } from 'lib/listmonk'
import { NextApiRequest, NextApiResponse } from 'next'
import verifyV1OwnerSignature from 'utils/v1/verifyOwnerSignature'
import verifyV2V3OwnerSignature from 'utils/v2v3/verifyOwnerSignature'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  const { messageData, signature } = req.body ?? {}

  // Return error if messageData or signature is undefined.
  if (messageData === undefined) {
    return res.status(400).json({ error: 'messageData is required' })
  }

  if (signature === undefined) {
    return res.status(400).json({ error: 'A signature is required' })
  }

  // Return error if messageData is malformed
  const { body, subject, send_at, projectId, pv } = messageData

  if (!body || !subject || !send_at || !projectId || !pv) {
    return res
      .status(400)
      .json({ error: 'Malformed messageData: missing field(s).' })
  }

  if (send_at < Date.now()) {
    return res
      .status(400)
      .json({ error: 'Malformed messageData: send_at must be in the future.' })
  }

  if (pv !== '1' && pv !== '2') {
    return res
      .status(400)
      .json({ error: 'Malformed messageData: pv must be "1" or "2".' })
  }

  const verifiedOwner =
    pv === '1'
      ? verifyV1OwnerSignature(
          projectId,
          JSON.stringify(messageData),
          signature,
        )
      : verifyV2V3OwnerSignature(
          projectId,
          JSON.stringify(messageData),
          signature,
        )

  if (!verifiedOwner) {
    return res.status(403).json({
      error: `Failed to verify owner signature for ${pv} project ${projectId}`,
    })
  }

  try {
    const listId = await getListID(projectId, pv)
    if (!listId) {
      return res
        .status(400)
        .json({ error: `No list found for v${pv}p${projectId}.` })
    }

    await broadcastMessage([listId], messageData)
    return res.status(201).json({ messageData })
  } catch (e) {
    console.error('api::listmonk::broadcast::error', e)
    return res.status(500).json({ error: 'failed to broadcast message' })
  }
}

export default handler
