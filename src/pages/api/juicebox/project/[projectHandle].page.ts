import { PV_V2 } from 'constants/pv'
import { paginateDepleteProjectsQueryCall } from 'lib/apollo'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Get project data from project handle
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { projectHandle } = req.query
  if (!projectHandle)
    return res.status(400).json({ error: 'projectHandle is required' })

  const handleDecoded = decodeURI(projectHandle as string)

  const projects = await paginateDepleteProjectsQueryCall({
    variables: {
      where: { pv: PV_V2, handle: handleDecoded },
    },
  })

  if (!projects.length) {
    return res.status(404).json({ error: 'project not found' })
  }

  const projectId = projects[0].projectId

  // cache for a day
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  return res.status(200).json({ projectId })
}
