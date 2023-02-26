import { createList, getListId } from 'lib/listmonk'
import { NextApiRequest, NextApiResponse } from 'next'
import verifyV1OwnerSignature from 'utils/v1/verifyOwnerSignature'
import verifyV2V3OwnerSignature from 'utils/v2v3/verifyOwnerSignature'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  const { listData, signature } = req.body ?? {}

  // Return error if listData or signature is undefined.
  if (listData === undefined) {
    return res.status(400).json({ error: 'List data is required' })
  }

  if (signature === undefined) {
    return res.status(400).json({ error: 'A signature is required' })
  }

  // Return error if listData is malformed
  const { name, projectId, pv } = listData

  if (!name || !projectId || !pv) {
    return res
      .status(400)
      .json({ error: 'Malformed listData: missing field(s).' })
  }

  if (pv !== '1' && pv !== '2') {
    return res
      .status(400)
      .json({ error: 'Malformed listData: pv must be "1" or "2".' })
  }

  const verifiedOwner =
    pv === '1'
      ? verifyV1OwnerSignature(projectId, JSON.stringify(listData), signature)
      : verifyV2V3OwnerSignature(projectId, JSON.stringify(listData), signature)

  if (!verifiedOwner) {
    return res.status(403).json({
      error: `Failed to verify owner signature for ${pv} project ${projectId}`,
    })
  }

  try {
    const listId = await getListId(projectId, pv)
    if (listId) {
      return res
        .status(400)
        .json({ error: `List already exists for v${pv}p${projectId}.` })
    }

    await createList(listData)
    return res.status(201).json({ listData })
  } catch (e) {
    console.error('api::listmonk::newlist::error', e)
    return res.status(500).json({ error: 'failed to create list' })
  }
}

export default handler
