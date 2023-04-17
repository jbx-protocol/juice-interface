import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { ProjectTagName, projectTagOptions } from 'models/project-tags'
import { NextApiHandler } from 'next'
import { Database } from 'types/database.types'

/**
 * Returns the number of projects that are using each tag.
 *
 * @returns An object containing project counts for all tag options.
 */
const handler: NextApiHandler = async (req, res) => {
  const counts: Partial<Record<ProjectTagName, number>> = {}

  try {
    for (const tag of projectTagOptions) {
      const { count } = await createServerSupabaseClient<Database>({ req, res })
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .not('archived', 'is', true)
        .overlaps('tags', [tag])

      counts[tag] = count ?? 0
    }

    res.status(200).json(counts)
    return
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
