import { updateSBProjects } from 'lib/api/supabase/projects'
import { NextApiHandler } from 'next'

// Synchronizes the Supabase db with the latest Juicebox Subgraph/IPFS data
const handler: NextApiHandler = async (_, res) => {
  await updateSBProjects(res, false)
}

export default handler
