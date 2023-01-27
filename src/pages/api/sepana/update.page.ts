import { BigNumber } from '@ethersproject/bignumber'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { readProvider } from 'constants/readProvider'
import { infuraApi } from 'lib/infura/ipfs'
import { queryAll, writeSepanaRecords } from 'lib/sepana'
import { sepanaAlert } from 'lib/sepana/log'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { SepanaProject, SepanaProjectJson } from 'models/sepana'
import { Project, ProjectJson } from 'models/subgraph-entities/vX/project'
import { NextApiHandler } from 'next'
import { formatWad } from 'utils/format/formatNumber'
import { querySubgraphExhaustive } from 'utils/graph'
import { openIpfsUrl } from 'utils/ipfs'

const projectKeys: (keyof SepanaProject)[] = [
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

    const sepanaProjects = (await queryAll<SepanaProjectJson>()).data.hits.hits

    const subgraphProjects = await querySubgraphExhaustive({
      entity: 'project',
      keys: projectKeys as (keyof Project)[],
    })

    const updatedProperties: {
      [id: string]: {
        key: string
        oldVal: string | undefined | null
        newVal: string | undefined | null
      }
    } = {}
    const idsOfNewProjects: Set<string> = new Set()
    let missingMetadataCount = 0

    // Get list of projects that have changed in Subgraph and no longer match Sepana
    const changedSubgraphProjects = subgraphProjects
      // Upserting data in Sepana requires the `_id` param to be included, so we always include it here and use the subgraph ID
      // https://docs.sepana.io/sepana-search-api/web3-search-cloud/search-api#request-example-2
      .map(p => ({ ...p, _id: p.id }))
      .map(p =>
        Object.entries(p).reduce(
          (acc, [k, v]) => ({
            ...acc,
            [k]: BigNumber.isBigNumber(v) ? v.toString() : v, // Store BigNumbers as strings
          }),
          {} as ProjectJson,
        ),
      )
      .filter(subgraphProject => {
        const id = subgraphProject.id

        if (!id) return false

        const sepanaProject = sepanaProjects.find(
          p => subgraphProject.id === p._source.id,
        )

        if (!sepanaProject) {
          idsOfNewProjects.add(id)
        } else if (sepanaProject._source.metadataResolved === false) {
          missingMetadataCount++
        }

        // Deep compare subgraph project with sepana project to find which projects have changed or not yet been stored on sepana
        // Return true to indicate new data should be fetched for this project in sepana db
        return (
          !sepanaProject ||
          (retryIPFS && !sepanaProject._source.metadataResolved) ||
          projectKeys.some(k => {
            const oldVal = sepanaProject?._source[k]
            const newVal = subgraphProject[k as keyof Project]

            if (oldVal !== newVal) {
              updatedProperties[id] = {
                key: k,
                oldVal: oldVal?.toString(),
                newVal: newVal?.toString(),
              }
              return true
            }
            return false
          })
        )
      })

    const lastUpdated = await readProvider.getBlockNumber()

    const promises: Promise<{ error?: string; project: SepanaProjectJson }>[] =
      []

    for (let i = 0; i < changedSubgraphProjects.length; i++) {
      // Update metadata & `lastUpdated` for each sepana project

      const p = changedSubgraphProjects[i]

      if (i && i % 100 === 0) {
        // Arbitrary delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 750))
      }

      promises.push(
        infuraApi
          .get<ProjectMetadataV5>(openIpfsUrl(p.metadataUri), {
            responseType: 'json',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
          .then(({ data: { logoUri, name, description } }) => ({
            project: {
              ...p,
              name,
              description,
              logoUri,
              lastUpdated,
              metadataResolved: true,
            } as SepanaProjectJson,
          }))
          .catch(error => ({
            error,
            project: {
              ...p,
              lastUpdated,
              metadataResolved: false, // If there is an error resolving metadata from IPFS, we'll flag it as `metadataResolved: false`. We'll try getting it again whenever `retryIPFS == true`.
            } as SepanaProjectJson,
          })),
      )
    }

    const promiseResults = await Promise.all(promises)

    const ipfsErrors = promiseResults.filter(x => x.error)

    // Write all updated projects (even those with missing metadata)
    const { jobs, written: updatedProjects } = await writeSepanaRecords(
      promiseResults.map(r => r.project),
    )

    // Formatted message used for log reporting
    const reportString = `Jobs: ${jobs.join(',')}${
      retryIPFS
        ? `\nRetried resolving metadata for ${missingMetadataCount}`
        : ''
    }\n\n${promiseResults
      .filter(r => !r.error)
      .map(r => {
        const {
          project: { id, name },
        } = r

        const { key, oldVal, newVal } = updatedProperties[id]

        const formatBigNumberish = (b: unknown) =>
          isBigNumberish(b) ? formatWad(b, { precision: 6 }) : b

        return `\`[${id}]\` ${name} _(${
          idsOfNewProjects.has(id)
            ? 'New'
            : `${key}: ${formatBigNumberish(oldVal)} -> ${formatBigNumberish(
                newVal,
              )}`
        })_`
      })
      .join('\n')}`

    if (promises.length) {
      await sepanaAlert(
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
    await sepanaAlert({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      body: JSON.stringify(error),
    })

    res.status(500).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      message: 'Error updating Sepana projects',
      error,
    })
  }
}

export default handler
