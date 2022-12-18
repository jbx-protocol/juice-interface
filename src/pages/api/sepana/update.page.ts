import axios from 'axios'
import { readProvider } from 'constants/readProvider'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { Project } from 'models/subgraph-entities/vX/project'
import { querySubgraphExhaustive } from 'utils/graph'
import { openIpfsUrl } from 'utils/ipfs'
import { deleteSepanaIds, querySepanaProjects, writeSepanaDocs } from './utils'

export type SepanaProject = Project & {
  name?: string
  description?: string
  logoUri?: string
  lastUpdated?: number
}

const compareKeys: (keyof Project)[] = [
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
  const sepanaProjects = await querySepanaProjects()

  const subgraphProjects = (
    await querySubgraphExhaustive({
      entity: 'project',
      keys: compareKeys,
    })
  ).filter(el => {
    const sepanaProject = sepanaProjects.data.hits.hits.find(
      p => el.id === p._source.id,
    )?._source

    // Deep compare subgraph project with sepana project to find which projects have changed
    return !sepanaProject || compareKeys.some(k => el[k] !== sepanaProject[k])
  })

  const updatedProjects: SepanaProject[] = []

  const ipfsPromises: Promise<void>[] = []
  const latestBlock = await readProvider.getBlockNumber()

  subgraphProjects.forEach(async (subgraphProject, i) => {
    const updatedProject: SepanaProject = {
      ...subgraphProject,
      lastUpdated: latestBlock,
    }

    ipfsPromises.push(
      axios
        .get<ProjectMetadataV5>(openIpfsUrl(subgraphProject.metadataUri))
        .then(res => {
          updatedProject.name = res.data.name
          updatedProject.description = res.data.description
          updatedProject.logoUri = res.data.logoUri

          updatedProjects.push(updatedProject)
        })
        .catch(e => {
          throw new Error(`Error with CID ${subgraphProject.metadataUri}: ${e}`)
        }),
    )

    if (i % 100 === 0) {
      // Arbitrary delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 750))
    }
  })

  await Promise.all(ipfsPromises)
  // Delete original subgraph entities
  await deleteSepanaIds(subgraphProjects.map(e => e.id))
  await writeSepanaDocs(updatedProjects)
}

export default handler
