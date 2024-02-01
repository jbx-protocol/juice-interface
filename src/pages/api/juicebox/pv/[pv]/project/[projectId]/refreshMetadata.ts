import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'
import { getProjectMetadata } from 'utils/server/metadata'

/**
 * Force refresh a given project's metadata in the database.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }

  try {
    const { projectId, pv } = req.query
    if (!projectId || !pv) {
      return res.status(400).json({ error: 'projectId is required' })
    }

    const supabase = createServerSupabaseClient<Database>({ req, res })

    const metadata = await getProjectMetadata(projectId as string)
    await supabase
      .from('projects')
      .update({ archived: metadata?.archived }) // TODO add more
      .eq('id', projectId)

    return res.status(204).end()
  } catch (error) {
    return res.status(500).end()
  }
}
export default handler
