import { BigNumber } from '@ethersproject/bignumber'
import { readProvider } from 'constants/readProvider'
import { ipfsGetWithFallback } from 'lib/api/ipfs'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { SepanaProject, SepanaProjectJson } from 'models/sepana'
import { Project, ProjectJson } from 'models/subgraph-entities/vX/project'
import { NextApiHandler } from 'next'
import { querySubgraphExhaustive } from 'utils/graph'

import { queryAllSepanaProjects, sepanaAlert, writeSepanaDocs } from './utils'

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

    const sepanaProjects = (await queryAllSepanaProjects()).data.hits.hits

    const subgraphProjects = await querySubgraphExhaustive({
      entity: 'project',
      keys: projectKeys as (keyof Project)[],
    })

    const keysForChangedProjects: { [k: string]: string } = {}
    const idsOfAddedProjects: Set<string> = new Set()

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

        if (!sepanaProject) idsOfAddedProjects.add(id)

        // Deep compare subgraph project with sepana project to find which projects have changed or not yet been stored on sepana
        return (
          !sepanaProject ||
          (!sepanaProject._source.metadataResolved && retryIPFS) ||
          projectKeys.some(k => {
            if (
              subgraphProject[k as keyof Project] !== sepanaProject._source[k]
            ) {
              keysForChangedProjects[id] = k
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
        ipfsGetWithFallback<ProjectMetadataV5>(p.metadataUri as string)
          .then(({ data: { logoUri, name, description } }) => ({
            project: {
              ...p,
              name,
              description,
              logoUri,
              metadataResolved: true,
              lastUpdated,
            } as SepanaProjectJson,
          }))
          .catch(error => ({
            error,
            project: {
              ...p,
              name: undefined,
              description: undefined,
              logoUri: undefined,
              metadataResolved: false, // If there is an error resolving metadata from IPFS, we'll flag it as `metadataResolved: false`. We'll try getting it again whenever `retryIPFS == true`.
              lastUpdated,
            } as SepanaProjectJson,
          })),
      )
    }

    const promiseResults = await Promise.all(promises)

    const ipfsErrors = promiseResults.filter(x => x.error)

    // Write all projects, even those with metadata errors.
    const { jobs, projects: updatedProjects } = await writeSepanaDocs(
      promiseResults.map(r => r.project),
    )

    const updatedMessage = `Jobs: ${jobs.join(',')}\n\n${promiseResults
      .filter(r => !r.error)
      .map(
        r =>
          `\`[${r.project.id}]\` ${r.project.name} _(${
            keysForChangedProjects[r.project.id]
          })_`,
      )
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
                .join('\n')}\n\n${updatedMessage}`,
            }
          : {
              type: 'notification',
              notif: 'DB_UPDATED',
              body: updatedMessage,
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
