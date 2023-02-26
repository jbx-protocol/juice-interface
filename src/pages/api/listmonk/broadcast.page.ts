import { broadcastMessage } from 'lib/listmonk'
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyMessage } from 'ethers/lib/utils'
import useProjectOwner from 'hooks/v2v3/contractReader/ProjectOwner'
import useOwnerOfProject from 'hooks/v1/contractReader/OwnerOfProject'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  const { message, signature } = req.body ?? {}

  // Return error if message or signature is undefined.
  if (message === undefined) {
    return res.status(400).json({ error: 'A message is required' })
  }

  if (signature === undefined) {
    return res.status(400).json({ error: 'A signature is required' })
  }

  // Return error if message is malformed
  const { body, subject, send_at, projectId, pv } = message

  if (!body || !subject || !send_at || !projectId || !pv) {
    return res
      .status(400)
      .json({ error: 'Malformed message: missing field(s).' })
  }

  if (send_at < Date.now()) {
    return res
      .status(400)
      .json({ error: 'Malformed message: send_at must be in the future.' })
  }

  if (pv !== '1' && pv !== '2') {
    return res
      .status(400)
      .json({ error: 'Malformed message: pv must be "1" or "2".' })
  }

  // Find project owner, and return an error if the project owner cannot be found.
  const projectOwner =
    pv === '1'
      ? useOwnerOfProject(projectId) // v1 hook
      : useProjectOwner(projectId).data // v2v3 hook

  if (!projectOwner) {
    return res
      .status(400)
      .json({ error: `Could not find project owner for v${pv}p${projectId}.` })
  }

  const signatureAddress = verifyMessage(JSON.stringify(message), signature)
  if (!signatureAddress) {
    return res.status(400).json({ error: `Failed to verify message.` })
  }

  // Return an error the verified signature does not match the project creator.
  if ((projectOwner as unknown as string) !== signatureAddress) {
    return res.status(403).json({
      error: `Failed to verify signature.\nProject owner address: ${projectOwner}\nSignature address: ${signatureAddress}`,
    })
  }

  try {
    await broadcastMessage(message)
    return res.status(201).json({ message })
  } catch (e) {
    console.error('api::listmonk::broadcast::error', e)
    return res.status(500).json({ error: 'failed to broadcast message' })
  }
}

export default handler
