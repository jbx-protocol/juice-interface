import { NextApiRequest, NextApiResponse } from 'next'

const VALID_CVS = ['1', '1.1', '2']

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { project } = req.body

  const cv = project?.cv
  let projectId: string | undefined
  let handle: string | undefined
  switch (cv) {
    case '1':
    case '1.1':
      handle = project?.handle
      break
    case '2':
      projectId = project?.projectId
      break
  }

  if (!cv) {
    console.error('missing project cv', { status: 400 })
    return res.status(400).send('Missing project cv')
  }
  if (!VALID_CVS.includes(cv)) {
    console.error('invalid cv', { status: 400 })
    return res.status(400).send('invalid cv')
  }
  if (!projectId && !handle) {
    console.error('no projectId or handle', { status: 400 })
    return res.status(400).send('No projectId or handle')
  }

  const path = calculatePath({ cv, projectId, handle })

  console.info(`[Next.js] Revalidating ${path}`)
  await res.revalidate(path)

  return res.status(200).send('Success!')
}

function calculatePath({
  cv,
  projectId,
  handle,
}: {
  cv: string
  projectId: string | undefined
  handle: string | undefined
}) {
  switch (cv) {
    case '1':
    case '1.1':
      return `/p/${handle}`
    case '2':
      return `/v2/p/${projectId}`
    default:
      throw new Error(`Unsupported cv: ${cv}`)
  }
}
