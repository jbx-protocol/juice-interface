import { createServerSupabaseClient } from '@supabase/auth-helpers-shared'
import { ipfsGet } from 'lib/api/ipfs'
import { consolidateMetadata, ProjectMetadata } from 'models/projectMetadata'
import { NextApiRequest, NextApiResponse } from 'next'
import { querySubgraphExhaustiveRaw } from 'utils/graph'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res })

  // Load all projects from Subgraph
  const subgraphProjects = await querySubgraphExhaustiveRaw({
    entity: 'project',
    keys: ['handle', 'projectId', 'metadataUri'],
  })

  // TODO this will certainly get rate-limited. We need to batch these requests.
  const projectsWithMetadata = await Promise.all(
    subgraphProjects.map(async subgraphProject => {
      const { data: metadata } = await ipfsGet<ProjectMetadata>(
        subgraphProject.metadataUri,
      )

      const { name, description, tags, archived } =
        consolidateMetadata(metadata)

      return {
        ...subgraphProject,
        name,
        description,
        tags,
        archived,
      }
    }),
  )

  const { error } = await supabase
    .from('countries')
    .upsert(projectsWithMetadata)
    .select()

  if (error) {
    res.status(400).send(error)
    return
  }

  return res.status(201).send('ok')
}

export default handler
