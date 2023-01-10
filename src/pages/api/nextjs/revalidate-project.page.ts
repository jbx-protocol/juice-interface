import axios from 'axios'
import { PV_V1, PV_V1_1, PV_V2 } from 'constants/pv'
import { PV } from 'models/pv'
import { NextApiRequest, NextApiResponse } from 'next'

const VALID_PVS = [PV_V1, PV_V1_1, PV_V2]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { project } = req.body

  const pv = project?.pv
  let projectId: string | undefined
  let handle: string | undefined
  switch (pv) {
    case PV_V1:
    case PV_V1_1:
      handle = project?.handle
      break
    case PV_V2:
      projectId = project?.projectId
      break
  }

  if (!pv) {
    console.error('missing project pv', { status: 400 })
    return res.status(400).send('Missing project pv')
  }
  if (!VALID_PVS.includes(pv)) {
    console.error('invalid pv', { status: 400 })
    return res.status(400).send('invalid Pv')
  }
  if (!projectId && !handle) {
    console.error('no projectId or handle', { status: 400 })
    return res.status(400).send('No projectId or handle')
  }

  const path = calculatePath({ pv, projectId, handle })

  console.info(`[Next.js] Revalidating ${path}`)
  await res.revalidate(path)

  // Update sepana database whenever a project needs revalidating
  // Note: This won't work if it takes too long for project data to become available in the subgraph
  await axios.get('/api/sepana/update')

  return res.status(200).send('Success!')
}

function calculatePath({
  pv,
  projectId,
  handle,
}: {
  pv: PV
  projectId: string | undefined
  handle: string | undefined
}) {
  switch (pv) {
    case PV_V1:
    case PV_V1_1:
      return `/p/${handle}`
    case PV_V2:
      return `/v2/p/${projectId}`
    default:
      throw new Error(`Unsupported pv: ${pv}`)
  }
}
