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
  console.log('body', req.method, JSON.parse(req.body))

  // This flag will let us know we should retry resolving IPFS data for projects that are missing it
  const retryIPFS =
    req.method === 'POST' && JSON.parse(req.body)['retryIPFS'] === true

  let missingMetadataCount = 0

  try {
    const sepanaProjects = (await queryAllSepanaProjects()).data.hits.hits

    const subgraphProjects = await querySubgraphExhaustive({
      entity: 'project',
      keys: projectKeys as (keyof Project)[],
    })

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
        const sepanaProject = sepanaProjects.find(
          p => subgraphProject.id === p._source.id,
        )

        if (sepanaProject?._source.metadataResolved === false) {
          missingMetadataCount++
        }

        // Deep compare subgraph project with sepana project to find which projects have changed or not yet been stored on sepana
        return (
          !sepanaProject ||
          (!sepanaProject._source.metadataResolved && retryIPFS) ||
          projectKeys.some(
            k =>
              subgraphProject[k as keyof Project] !== sepanaProject._source[k],
          )
        )
      })

    const latestBlock = await readProvider.getBlockNumber()

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
              // If any values resolved from metadata are empty or undefined, we put null in their place
              name,
              description,
              logoUri,
              lastUpdated: latestBlock,
              metadataResolved: true,
            } as SepanaProjectJson,
          }))
          .catch(error => ({
            error,
            project: {
              ...p,
              lastUpdated: latestBlock,
              metadataResolved: false, // If there is an error resolving metadata from IPFS, we'll flag it as `metadataResolved: false`. We'll try getting it again whenever `retryIPFS == true`.
            } as SepanaProjectJson,
          })),
      )
    }

    const promiseResults = await Promise.all(promises)

    const ipfsErrors = promiseResults.filter(x => x.error)

    if (promiseResults.length) {
      // Write all projects, even those without metadata resolved from IPFS.
      await writeSepanaDocs(promiseResults.map(r => r.project))

      const sepanaAlertRowCount = 30 // sepanaAlert will get error response from Discord if message is too big

      await sepanaAlert(
        ipfsErrors.length
          ? {
              type: 'alert',
              alert: 'DB_UPDATE_ERROR',
              body: `Updated ${
                promiseResults.length - ipfsErrors.length
              } projects.${
                retryIPFS ? ` Retried IPFS for ${missingMetadataCount}.` : ''
              } Failed to resolve IPFS data for ${
                ipfsErrors.length
              }:\n${ipfsErrors
                .slice(0, sepanaAlertRowCount)
                .map(
                  e =>
                    `\`[${e.project.id}]\` metadataURI: \`${e.project.metadataUri}\` _${e.error}_`,
                )
                .join('\n')}${
                ipfsErrors.length > sepanaAlertRowCount
                  ? `\n...and ${ipfsErrors.length - sepanaAlertRowCount} more`
                  : ''
              }`,
            }
          : {
              type: 'notification',
              notif: 'DB_UPDATED',
              body: `Updated ${promiseResults.length} projects${
                retryIPFS ? ` (retried IPFS for ${missingMetadataCount})` : ''
              }: \n${promiseResults
                .slice(0, sepanaAlertRowCount)
                .map(r => `\`[${r.project.id}]\` ${r.project.name}`)
                .join('\n')}${
                promiseResults.length > sepanaAlertRowCount
                  ? `\n...and ${
                      promiseResults.length - sepanaAlertRowCount
                    } more`
                  : ''
              }`,
            },
      )
    }

    res
      .status(200)
      .send(
        `${process.env.NEXT_PUBLIC_INFURA_NETWORK}\n${promiseResults.length}/${
          subgraphProjects.length
        } projects updated\n${ipfsErrors.length} projects with IPFS errors${
          retryIPFS
            ? `\n${missingMetadataCount} retries to resolve metadata`
            : `\n${missingMetadataCount} projects missing metadata`
        }`,
      )
  } catch (error) {
    await sepanaAlert({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      body: JSON.stringify(error),
    })

    res.status(500).send({
      message: `Error updating Sepana projects on ${process.env.NEXT_PUBLIC_INFURA_NETWORK}`,
      error,
    })
  }
}

export default handler
