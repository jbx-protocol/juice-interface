import axios from 'axios'
import { readProvider } from 'constants/readProvider'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { Project } from 'models/subgraph-entities/vX/project'
import { querySubgraphExhaustive } from 'utils/graph'
import { openIpfsUrl } from 'utils/ipfs'
import { SepanaProject } from './models'
import { deleteSepanaIds, querySepanaProjects, writeSepanaDocs } from './utils'

const projectKeys: (keyof Project)[] = [
  'id',
  'projectId',
  'pv',
  'handle',
  'metadataUri',
  'currentBalance',
  'totalPaid',
  'createdAt',
  'trendingScore',
  'deployer',
]

// Synchronizes the Sepana engine with the latest Juicebox Subgraph/IPFS data
const handler = async () => {
  const sepanaProjects = (await querySepanaProjects()).data.hits.hits

  const subgraphProjects = await querySubgraphExhaustive({
    entity: 'project',
    keys: projectKeys,
  })

  const changedSubgraphProjects = subgraphProjects.filter(p => {
    const sepanaProject = sepanaProjects.find(
      _p => p.id === _p._source.id,
    )?._source

    // Deep compare subgraph project with sepana project to find which projects have changed or not yet been stored on sepana
    return !sepanaProject || projectKeys.some(k => p[k] !== sepanaProject[k])
  })

  const updatedSepanaProjects: SepanaProject[] = []
  const latestBlock = await readProvider.getBlockNumber()

  await Promise.all(
    changedSubgraphProjects.map(async (p, i) => {
      if (i && i % 100 === 0) {
        // Arbitrary delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 750))
      }

      try {
        const {
          data: { name, description, logoUri },
        } = await axios.get<ProjectMetadataV5>(openIpfsUrl(p.metadataUri))

        updatedSepanaProjects.push({
          ...p,
          name,
          description,
          logoUri,
          lastUpdated: latestBlock,
        })
      } catch (e) {
        throw new Error(`Error with CID ${p.metadataUri}: ${e}`)
      }
    }),
  )

  // Delete projects that need updating
  await deleteSepanaIds(changedSubgraphProjects.map(e => e.id))

  // Write updated projects
  await writeSepanaDocs(updatedSepanaProjects)
}

export default handler
