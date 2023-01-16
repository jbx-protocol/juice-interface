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

    const changedSubgraphProjects = (
      await querySubgraphExhaustive({
        entity: 'project',
        keys: projectKeys as (keyof Project)[],
      })
    )
      // Upserting data in Sepana requires the `_id` param to be included, so we include it here
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
          projectKeys.some(
            k =>
              subgraphProject[k as keyof Project] !== sepanaProject._source[k],
          )
        )
      })

    const latestBlock = await readProvider.getBlockNumber()
    const updatedSepanaProjects: Promise<SepanaProjectJson>[] = []
    const sepanaProjectsWithIPFSErrors: {
      id?: string
      metadataURI?: string
      error?: string
    }[] = []

    for (let i = 0; i < changedSubgraphProjects.length; i++) {
      // Update metadata & `lastUpdated` for each sepana project

      const p = changedSubgraphProjects[i]

      if (i && i % 100 === 0) {
        // Arbitrary delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 750))
      }

      try {
        if (!p.metadataUri) {
          throw new Error(`Missing metadataUri for project with id: ${p.id}`)
        }

        updatedSepanaProjects.push(
          ipfsGetWithFallback<ProjectMetadataV5>(p.metadataUri)
            .then(
              ({ data: { logoUri, name, description } }) =>
                ({
                  ...p,
                  name,
                  description,
                  logoUri,
                  lastUpdated: latestBlock,
                } as SepanaProjectJson),
            )
            .catch(error => {
              sepanaProjectsWithIPFSErrors.push({
                id: p.id,
                metadataURI: p.metadataUri,
                error,
              })

              return p as SepanaProjectJson
            }),
        )
      } catch (error) {
        res.status(500).send({
          message: `Error fetching ${p.metadataUri} from IPFS`,
          error,
        })
      }
    }

    if (updatedSepanaProjects.length) {
      // Write updated projects
      const _updatedSepanaProjects = await Promise.all(updatedSepanaProjects)

      if (sepanaProjectsWithIPFSErrors.length) {
        sepanaAlert({
          type: 'alert',
          alert: 'IPFS_RESOLUTION_ERROR',
          subject: `Failed to resolve IPFS data for some projects`,
          body: {
            projects: sepanaProjectsWithIPFSErrors
              .map(
                p =>
                  `ID: \`${p.id}\`, metadataURI: \`${p.metadataURI}\`, Error: \`${p.error}\``,
              )
              .join('\n'),
          },
        })

        throw new Error('Failed to resolve IPFS data for some Sepana projects')
      }

      await writeSepanaDocs(_updatedSepanaProjects)

      sepanaAlert({
        type: 'notification',
        notif: 'DB_UPDATED',
        subject: `Updated ${
          _updatedSepanaProjects.length
        } projects: \n${_updatedSepanaProjects
          .map(p => `\n\`[${p.id}]\` ${p.name}`)
          .join('')}`,
      })
    }

    res
      .status(200)
      .send(
        `Updated ${updatedSepanaProjects.length} projects on ${process.env.NEXT_PUBLIC_INFURA_NETWORK}`,
      )
  } catch (error) {
    sepanaAlert({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      subject: typeof error === 'string' ? error : undefined,
    })

    res.status(500).send({
      message: `Error updating Sepana projects on ${process.env.NEXT_PUBLIC_INFURA_NETWORK}`,
      error,
    })
  }
}

export default handler
