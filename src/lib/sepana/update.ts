import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { Json } from 'models/json'
import { SepanaProject } from 'models/sepana'
import { NextApiResponse } from 'next'
import { formatError } from 'utils/format/formatError'
import { formatWad } from 'utils/format/formatNumber'
import { querySubgraphExhaustiveRaw } from 'utils/graph'
import {
  getChangedSubgraphProjects,
  sgSepanaCompareKeys,
  tryResolveMetadata,
} from 'utils/sepana'
import { queryAll, writeSepanaRecords } from './api'
import { sepanaLog } from './log'

export async function sepanaUpdate(res: NextApiResponse, retryIpfs: boolean) {
  try {
    // Load all projects from Sepana, store in dict
    const sepanaProjects = (await queryAll<Json<SepanaProject>>()).hits.reduce(
      (acc, curr) => ({ ...acc, [curr._source.id]: curr._source }),
      {} as Record<string, Json<SepanaProject>>,
    )

    // Load all projects from Subgraph
    const subgraphProjects = await querySubgraphExhaustiveRaw({
      entity: 'project',
      keys: sgSepanaCompareKeys,
    })

    const {
      changedSubgraphProjects,
      retryMetadataCount,
      updatedProperties,
      idsOfNewProjects,
    } = getChangedSubgraphProjects({
      subgraphProjects,
      sepanaProjects,
      retryIpfs,
    })

    const resolveMetadataResults = await Promise.all(
      changedSubgraphProjects.map(subgraphProject => {
        const sepanaProject = sepanaProjects[subgraphProject.id]

        return tryResolveMetadata({
          subgraphProject,
          ...sepanaProject,
        })
      }),
    )

    const _lastUpdated = Date.now()

    const sepanaProjectResults = resolveMetadataResults.map(r => ({
      ...r,
      project: {
        ...r.project,
        _lastUpdated, // add _lastUpdated to all projects
      },
    }))

    const ipfsErrors = sepanaProjectResults.filter(r => r.error)

    // Write all updated projects (even those with missing metadata)
    const { jobs, written: updatedSepanaProjects } = await writeSepanaRecords(
      sepanaProjectResults.map(r => r.project),
    )

    // Formatted message used for log reporting
    const reportString = `Jobs: ${jobs.join(',')}${
      retryMetadataCount
        ? `\nRetried resolving metadata for ${retryMetadataCount}`
        : ''
    }\n\n${sepanaProjectResults
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
                ?.map(
                  prop =>
                    `${prop.key}: ${formatBigNumberish(
                      prop.oldVal,
                    )} -> ${formatBigNumberish(prop.newVal)}`,
                )
                .join(', ') ?? 'no changes'
        })_`
      })
      .join('\n')}`

    // Log if any projects were updated
    if (updatedSepanaProjects.length) {
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
                    `\`[${e.project.id}]\` metadataURI: \`${e.project.metadataUri}\`, ${e.retriesRemaining} retries remaining. _${e.error}_`,
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
        projects: updatedSepanaProjects,
        count: updatedSepanaProjects.length,
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
