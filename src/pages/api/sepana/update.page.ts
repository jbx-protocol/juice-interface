import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { readProvider } from 'constants/readProvider'
import { infuraApi } from 'lib/infura/ipfs'
import { queryAll, writeSepanaRecords } from 'lib/sepana/api'
import { sepanaLog } from 'lib/sepana/log'
import { Json } from 'models/json'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { SepanaProject } from 'models/sepana'
import { Project } from 'models/subgraph-entities/vX/project'
import { NextApiHandler } from 'next'
import { formatError } from 'utils/format/formatError'
import { formatWad } from 'utils/format/formatNumber'
import { querySubgraphExhaustiveRaw } from 'utils/graph'
import { openIpfsUrl } from 'utils/ipfs'

type ProjectKey =
  | 'id'
  | 'projectId'
  | 'pv'
  | 'handle'
  | 'metadataUri'
  | 'currentBalance'
  | 'totalPaid'
  | 'createdAt'
  | 'trendingScore'
  | 'deployer'

const projectKeys: ProjectKey[] = [
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
const handler: NextApiHandler = async (req, res) => {
  try {
    // This flag will let us know we should retry resolving IPFS data for projects that are missing it
    const retryIPFS = req.method === 'POST' && req.body['retryIPFS'] === true

    // Load all projects from Sepana
    const sepanaProjects = (await queryAll<Json<SepanaProject>>()).data.hits
      .hits

    // Load all projects from Subgraph
    const subgraphProjects = await querySubgraphExhaustiveRaw({
      entity: 'project',
      keys: projectKeys,
    })

    // Store record of Sepana project properties that need updating
    const updatedProperties: {
      [id: string]: {
        key: string
        oldVal: string | undefined | null
        newVal: string | undefined | null
      }[]
    } = {}
    const idsOfNewProjects: Set<string> = new Set()
    let missingMetadataCount = 0

    // Get a list of Subgraph projects that aren't found in Sepana or don't match Sepana record
    const changedSubgraphProjects = subgraphProjects.filter(subgraphProject => {
      const id = subgraphProject.id

      const sepanaProject = sepanaProjects.find(
        p => subgraphProject.id === p._source.id,
      )

      if (!sepanaProject) {
        idsOfNewProjects.add(id)
        return true
      }

      if (sepanaProject._source.hasUnresolvedMetadata) {
        missingMetadataCount++
        if (retryIPFS) return true
      }

      // Deep compare Subgraph project vs. Sepana project and find any discrepancies
      const propertiesToUpdate = projectKeys.filter(k => {
        const oldVal = sepanaProject?._source[k]
        const newVal = subgraphProject[k]

        // Store a record of properties that need updating
        if (oldVal !== newVal) {
          updatedProperties[id] = [
            ...(updatedProperties[id] ?? []),
            {
              key: k,
              oldVal: oldVal?.toString(),
              newVal: newVal?.toString(),
            },
          ]
          return true
        }

        return false
      })

      // Return true if any properties are out of date
      return propertiesToUpdate.length
    })

    const lastUpdated = await readProvider.getBlockNumber()

    const metadataResults = await Promise.all(
      changedSubgraphProjects.map(p => tryResolveMetadata(p, lastUpdated)),
    )

    const ipfsErrors = metadataResults.filter(r => r.error)

    // Write all updated projects (even those with missing metadata)
    const { jobs, written: updatedProjects } = await writeSepanaRecords(
      metadataResults.map(r => r.project),
    )

    // Formatted message used for log reporting
    const reportString = `Jobs: ${jobs.join(',')}${
      retryIPFS
        ? `\nRetried resolving metadata for ${missingMetadataCount}`
        : ''
    }\n\n${metadataResults
      .filter(r => !r.error)
      .map(r => {
        const {
          project: { id, name },
        } = r

        const formatBigNumberish = (b: unknown) =>
          isBigNumberish(b) ? formatWad(b, { precision: 6 }) : b

        return `\`[${id}]\` ${name} _(${
          idsOfNewProjects.has(id as string)
            ? 'New'
            : updatedProperties[id]
                .map(
                  prop =>
                    `${prop.key}: ${formatBigNumberish(
                      prop.oldVal,
                    )} -> ${formatBigNumberish(prop.newVal)}`,
                )
                .join(', ')
        })_`
      })
      .join('\n')}`

    // Log if any projects were updated
    if (updatedProjects.length) {
      await sepanaLog(
        ipfsErrors.length
          ? {
              type: 'alert',
              alert: 'DB_UPDATE_ERROR',
              body: `Failed to resolve IPFS data for ${
                ipfsErrors.length
              } projects:\n${ipfsErrors
                .map(
                  e =>
                    `\`[${e.project.id}]\` metadataURI: \`${e.project.metadataUri}\` _${e.error}_`,
                )
                .join('\n')}\n\n${reportString}`,
            }
          : {
              type: 'notification',
              notif: 'DB_UPDATED',
              body: reportString,
            },
      )
    }

    res.status(200).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      updates: {
        projects: updatedProjects,
        count: updatedProjects.length,
        jobs,
      },
      errors: { ipfsErrors, count: ipfsErrors.length },
    })
  } catch (error) {
    const _error = formatError(error)

    await sepanaLog({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      body: _error,
    })

    res.status(500).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      message: 'Error updating Sepana projects',
      error: _error,
    })
  }
}

async function tryResolveMetadata(
  project: Json<Pick<Project, ProjectKey>>,
  lastUpdated: number,
) {
  // Upserting data in Sepana requires the `_id` param to be included, so we always include it here and use the subgraph ID
  // https://docs.sepana.io/sepana-search-api/web3-search-cloud/search-api#request-example-2
  const { id: _id, metadataUri } = project

  if (!metadataUri) {
    return {
      project: {
        ...project,
        _id,
        name: undefined,
        description: undefined,
        logoUri: undefined,
        lastUpdated,
        hasUnresolvedMetadata: false,
      },
    }
  }

  try {
    const {
      data: { logoUri, name, description },
    } = await infuraApi.get<ProjectMetadataV5>(
      openIpfsUrl(project.metadataUri),
      {
        responseType: 'json',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    return {
      project: {
        ...project,
        _id,
        name,
        description,
        logoUri,
        lastUpdated,
        hasUnresolvedMetadata: false,
      },
    }
  } catch (error) {
    return {
      error: formatError(error),
      project: {
        ...project,
        _id,
        name: undefined,
        description: undefined,
        logoUri: undefined,
        lastUpdated,
        hasUnresolvedMetadata: true, // If there is an error resolving metadata from IPFS, we'll flag it as `hasUnresolvedMetadata: true`. We'll try getting it again whenever `retryIPFS == true`.
      },
    }
  }
}

export default handler
