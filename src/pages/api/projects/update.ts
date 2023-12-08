import { updateDBProjects } from 'lib/api/supabase/projects'
import { NextApiHandler } from 'next'

// Synchronizes projects in the database with the latest Juicebox Subgraph/IPFS data
const handler: NextApiHandler = async (req, res) => {
  const { forceUpdateAll } = req.query
  const _forceUpdateAll = forceUpdateAll === 'true' ? true : false
  await updateDBProjects(res, false, _forceUpdateAll)
}

export default handler
