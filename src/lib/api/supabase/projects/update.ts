import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { Json } from 'models/json'
import { SBProject } from 'models/supabaseProject'
import { NextApiResponse } from 'next'
import { formatError } from 'utils/format/formatError'
import { formatWad } from 'utils/format/formatNumber'
import { querySubgraphExhaustiveRaw } from 'utils/graph'
import {
  getChangedSubgraphProjects,
  sgSbCompareKeys,
  tryResolveMetadata,
} from 'utils/subgraphSupabaseProjects'
import { sbpQueryAll, writeSBProjects } from '.'
import { sbpLog } from './logger'

export async function updateSBProjects(
  res: NextApiResponse,
  retryIpfs: boolean,
) {
  try {
    // // TODO for testing
    // await sbProjects
    //   .delete({ count: 'exact' })
    //   .filter('id', 'not.eq', null)
    //   .then(res => {
    //     console.log('deleted all', { res })
    //   })

    // Load all projects from Supabase, store in dict
    const { data, error: queryError } = await sbpQueryAll()

    if (queryError) {
      throw new Error('Error querying projects: ' + queryError.message)
    }

    const sbProjects = (data as Json<SBProject>[])?.reduce(
      (acc, p) => ({
        ...acc,
        [p.id]: p,
      }),
      {} as Record<string, Json<SBProject>>,
    )

    // Load all projects from Subgraph
    const sgProjects = await querySubgraphExhaustiveRaw({
      entity: 'project',
      keys: sgSbCompareKeys,
    })

    const {
      changedSubgraphProjects,
      retryMetadataCount,
      updatedProperties,
      idsOfNewProjects,
    } = getChangedSubgraphProjects({
      sgProjects,
      sbProjects,
      retryIpfs,
    })

    const resolveMetadataResults = await Promise.all(
      changedSubgraphProjects.map(sgProject =>
        tryResolveMetadata({
          sgProject,
          ...sbProjects[sgProject.id],
        }),
      ),
    )

    const ipfsErrors = resolveMetadataResults.filter(r => r.error)

    // Write all updated projects (even those with missing metadata)
    const { error, data: updatedSBProjects } = await writeSBProjects(
      resolveMetadataResults.map(r => r.project),
    )

    if (error) {
      throw new Error('Error writing projects to Supabase: ' + error.message)
    }

    // Formatted message used for log reporting
    const reportString = `${
      retryMetadataCount
        ? `\nRetried resolving metadata for ${retryMetadataCount}`
        : ''
    }\n\n${resolveMetadataResults
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
    if (updatedSBProjects.length) {
      await sbpLog(
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
        count: updatedSBProjects.length,
        projects: updatedSBProjects,
      },
      errors: { ipfsErrors, count: ipfsErrors.length },
    })
  } catch (error) {
    const _error = formatError(error)

    await sbpLog({
      type: 'alert',
      alert: 'DB_UPDATE_ERROR',
      body: _error,
    })

    res.status(500).json({
      network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
      message: 'Error updating Supabase projects',
      error: _error,
    })
  }
}
