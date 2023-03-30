import { updateSBProjects } from 'lib/sepana/update'
import { NextApiHandler } from 'next'

// Synchronizes the Sepana engine with the latest Juicebox Subgraph/IPFS data
const handler: NextApiHandler = async (_, res) => {
  await updateSBProjects(res, false)
}

export default handler
