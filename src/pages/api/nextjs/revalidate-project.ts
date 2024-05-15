import axios from 'axios'
import { PV_V1, PV_V2 } from 'constants/pv'
import { SiteBaseUrl } from 'constants/url'
import { PV } from 'models/pv'
import { NextApiRequest, NextApiResponse } from 'next'

const VALID_PVS = [PV_V1, PV_V2]

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

  // Update database projects whenever a project needs revalidating. However, database will only get updated if the new project data is already available in the subgraph, which can sometimes take a couple minutes
  await axios
    .get(`${SiteBaseUrl}api/projects/update`)
    // can throw error when env isnt set correctly
    .catch(err => console.error('Database projects update failed', err))

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
      return `/p/${handle}`
    case PV_V2:
      return `/v2/p/${projectId}`
    default:
      throw new Error(`Unsupported pv: ${pv}`)
  }
}
