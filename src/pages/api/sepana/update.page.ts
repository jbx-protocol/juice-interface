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
const handler: NextApiHandler = async (_, res) => {
  try {
    const sepanaProjects = (await queryAllSepanaProjects()).data.hits.hits

    const subgraphProjects = await querySubgraphExhaustive({
      entity: 'project',
      keys: projectKeys as (keyof Project)[],
    })

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
        const sepanaProject = sepanaProjects.find(
          p => subgraphProject.id === p._source.id,
        )

        // Deep compare subgraph project with sepana project to find which projects have changed or not yet been stored on sepana
        return (
          !sepanaProject ||
          // If any values resolved from metadataURI are undefined it may be due to a previous IPFS error, so we want to mark the project as changed and try again
          sepanaProject._source.name === undefined ||
          sepanaProject._source.description === undefined ||
          sepanaProject._source.logoUri === undefined ||
          projectKeys.some(
            k =>
              subgraphProject[k as keyof Project] !== sepanaProject._source[k],
          )
        )
      })

    const latestBlock = await readProvider.getBlockNumber()

    const promises: Promise<
      | { type: 'project'; data: SepanaProjectJson }
      | {
          type: 'error'
          data: { id?: string; metadataURI?: string; error?: string }
        }
    >[] = []

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
            type: 'project' as const,
            data: {
              ...p,
              // If any values resolved from metadata are empty or undefined, we put null in their place
              name: name || null,
              description: description || null,
              logoUri: logoUri || null,
              lastUpdated: latestBlock,
            } as SepanaProjectJson,
          }))
          .catch(error => ({
            type: 'error' as const,
            data: {
              id: p.id,
              metadataURI: p.metadataUri,
              error,
            },
          })),
      )
    }

    // Write updated projects
    const promiseResults = await Promise.all(promises)

    const updatedSepanaProjects = promiseResults
      .filter(x => x.type === 'project')
      .map(x => x.data) as SepanaProjectJson[]

    if (updatedSepanaProjects.length) {
      await writeSepanaDocs(updatedSepanaProjects)

      const numToAlert = 20 // Discord will error if message is too big

      sepanaAlert({
        type: 'notification',
        notif: 'DB_UPDATED',
        subject: `Updated ${
          updatedSepanaProjects.length
        } projects: \n${updatedSepanaProjects
          .slice(0, numToAlert)
          .map(p => `\`[${p.id}]\` ${p.name}`)
          .join('\n')}${
          updatedSepanaProjects.length > numToAlert
            ? `\n...and ${updatedSepanaProjects.length - numToAlert} more`
            : ''
        }`,
      })
    }

    const ipfsErrors = promiseResults
      .filter(x => x.type === 'error')
      .map(x => x.data) as {
      id?: string
      metadataURI?: string
      error?: string
    }[]

    if (ipfsErrors.length) {
      sepanaAlert({
        type: 'alert',
        alert: 'DB_UPDATE_ERROR',
        subject: `Failed to resolve IPFS data for ${
          ipfsErrors.length
        } projects:\n${ipfsErrors
          .map(
            p => `\`[${p.id}]\` metadataURI: \`${p.metadataURI}\` _${p.error}_`,
          )
          .join('\n')}`,
      })
    }

    res
      .status(200)
      .send(
        `${process.env.NEXT_PUBLIC_INFURA_NETWORK}\n${updatedSepanaProjects.length}/${subgraphProjects.length} projects updated\n${ipfsErrors.length} projects with IPFS errors`,
      )
  } catch (error) {
    sepanaAlert({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      subject: JSON.stringify(error),
    })

    res.status(500).send({
      message: `Error updating Sepana projects on ${process.env.NEXT_PUBLIC_INFURA_NETWORK}`,
      error,
    })
  }
}

export default handler
