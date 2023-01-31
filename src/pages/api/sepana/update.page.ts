import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { readProvider } from 'constants/readProvider'
import { infuraApi } from 'lib/infura/ipfs'
import { queryAll, writeSepanaRecords } from 'lib/sepana/api'
import { sepanaLog } from 'lib/sepana/log'
import {
  getBlockRefs,
  projectTimelinePointsForBlocks,
} from 'lib/sepana/utils/timeline'
import { Json } from 'models/json'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { SepanaProject, SepanaProjectTimeline } from 'models/sepana'
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
    const sepanaProjects = (await queryAll<Json<SepanaProject>>('projects'))
      .data.hits.hits

    console.info(`${sepanaProjects.length} Sepana projects`)

    // Load all projects from Subgraph
    const subgraphProjects = await querySubgraphExhaustiveRaw({
      entity: 'project',
      keys: projectKeys,
    })

    console.info(`${subgraphProjects.length} Subgraph projects`)

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
      const { id } = subgraphProject

      const sepanaProject = sepanaProjects.find(p => id === p._source.id)

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

    console.info(`${changedSubgraphProjects.length} changed`)

    const lastUpdated = await readProvider.getBlockNumber()

    const count = 40
    const [blockRefs365, blockRefs30, blockRefs7] = await Promise.all([
      getBlockRefs({ durationDays: 365, count }),
      getBlockRefs({ durationDays: 30, count }),
      getBlockRefs({ durationDays: 7, count }),
    ])

    console.info('Got blockRefs')

    let lastTimestampMillis = Date.now()
    let elapsedMillis = 0
    let avgPerProjectMillis = 0

    const projectUpdates: ReturnType<typeof tryProjectUpdate>[] = []
    for (let i = 0; i < changedSubgraphProjects.length; i++) {
      if (i % 10 === 0) {
        const now = Date.now()
        const tookMillis = Math.round(now - lastTimestampMillis)
        elapsedMillis += tookMillis
        lastTimestampMillis = now
        avgPerProjectMillis = Math.round(elapsedMillis / i)

        console.info(
          `${i} - ${((100 * i) / changedSubgraphProjects.length).toFixed(
            1,
          )}% - ${tookMillis}ms - ${avgPerProjectMillis}ms/project avg - ${Math.round(
            elapsedMillis / 1000,
          )}s elapsed - ${(
            ((changedSubgraphProjects.length - i) * avgPerProjectMillis) /
            1000 /
            60
          ).toFixed(1)}m remaining`,
        )
      }

      const project = changedSubgraphProjects[i]
      const { projectId, pv, createdAt, id } = project

      // Sequentially await getting all timeline points for each project to avoid rate limits
      const [timeline365, timeline30, timeline7] = await Promise.all([
        projectTimelinePointsForBlocks({
          blockRefs: blockRefs365,
          createdAt,
          projectId,
          pv,
        }),
        projectTimelinePointsForBlocks({
          blockRefs: blockRefs30,
          createdAt,
          projectId,
          pv,
        }),
        projectTimelinePointsForBlocks({
          blockRefs: blockRefs7,
          createdAt,
          projectId,
          pv,
        }),
      ])

      projectUpdates.push(
        tryProjectUpdate({
          project,
          lastUpdated,
          timeline: {
            id,
            _id: id,
            timeline365,
            timeline30,
            timeline7,
          },
        }),
      )
    }

    const projectUpdateResults = await Promise.all(projectUpdates)

    const ipfsErrors = projectUpdateResults.filter(x => x.error)

    // Write all updated projects (even those with missing metadata)
    const { jobs: projectJobs, written: writtenProjects } =
      await writeSepanaRecords(
        'projects',
        projectUpdateResults.map(r => r.project),
      )

    // Write all updated timelines (even those with missing metadata)
    const { jobs: timelineJobs, written: writtenTimelines } =
      await writeSepanaRecords(
        'timelines',
        projectUpdateResults.map(r => r.timeline),
      )

    // Formatted message used for log reporting
    const reportString = `Project jobs: ${projectJobs.join(
      ',',
    )}. Timeline jobs: ${timelineJobs.join(',')}${
      retryIPFS
        ? `\nRetried resolving metadata for ${missingMetadataCount}`
        : ''
    }\n\n${projectUpdateResults
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
    if (writtenProjects.length) {
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
        projects: writtenProjects,
        timelines: writtenTimelines,
        projectsCount: writtenProjects.length,
        timelinesCount: writtenTimelines.length,
        projectJobs,
        timelineJobs,
      },
      ipfsErrors: {
        errors: ipfsErrors,
        count: ipfsErrors.length,
      },
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

async function tryProjectUpdate({
  project,
  lastUpdated,
  timeline,
}: {
  project: Json<Pick<Project, ProjectKey>>
  lastUpdated: number
  timeline: SepanaProjectTimeline
}) {
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
      timeline,
    }
  }

  try {
    const {
      data: { logoUri, name, description },
    } = await infuraApi.get<ProjectMetadataV5>(openIpfsUrl(metadataUri), {
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

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
      timeline,
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
      timeline,
    }
  }
}

export default handler
