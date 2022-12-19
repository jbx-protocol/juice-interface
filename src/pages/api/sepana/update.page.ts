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
  const sepanaProjects = (await querySepanaProjects()).data.hits.hits.map(
    p => p._source,
  )

  const changedSubgraphProjects = (
    await querySubgraphExhaustive({
      entity: 'project',
      keys: projectKeys,
    })
  ).filter(subgraphProject => {
    const sepanaProject = sepanaProjects.find(p => subgraphProject.id === p.id)

    // Deep compare subgraph project with sepana project to find which projects have changed or not yet been stored on sepana
    return (
      !sepanaProject ||
      projectKeys.some(k => subgraphProject[k] !== sepanaProject[k])
    )
  })

  const latestBlock = await readProvider.getBlockNumber()

  const updatedSepanaProjects = await changedSubgraphProjects.reduce(
    async (acc, curr, i) => {
      if (i && i % 100 === 0) {
        // Arbitrary delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 750))
      }

      try {
        // update metadata & `lastUpdated` for each sepana project
        const {
          data: { name, description, logoUri },
        } = await axios.get<ProjectMetadataV5>(openIpfsUrl(curr.metadataUri))

        return [
          ...(await acc),
          {
            ...curr,
            name,
            description,
            logoUri,
            lastUpdated: latestBlock,
          },
        ]
      } catch (e) {
        throw new Error(`Error with CID ${curr.metadataUri}: ${e}`)
      }
    },
    Promise.resolve([] as SepanaProject[]),
  )

  // Delete projects that need updating
  await deleteSepanaIds(changedSubgraphProjects.map(e => e.id))

  // Write updated projects
  await writeSepanaDocs(updatedSepanaProjects)
}

export default handler
