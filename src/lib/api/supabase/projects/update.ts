import { DBProject } from 'models/dbProject'
import { Json } from 'models/json'
import { NextApiResponse } from 'next'
import { isBigNumberish } from 'utils/bigNumbers'
import { formatError } from 'utils/format/formatError'
import { formatWad } from 'utils/format/formatNumber'
import {
  formatSgProjectsForUpdate,
  formatWithMetadata,
} from 'utils/sgDbProjects'
import { dbpQueryAll, queryAllSGProjectsForServer, writeDBProjects } from '.'
import { dbpLog } from './logger'

export async function updateDBProjects(
  res: NextApiResponse,
  retryIpfs: boolean,
  forceUpdateAll?: boolean,
) {
  try {
    // Load all database projects
    const { data, error: queryError } = await dbpQueryAll()

    if (queryError) {
      throw new Error('Error querying projects: ' + queryError.message)
    }

    // Store database projects in a dict for more performant access
    const dbProjects = (data as Json<DBProject>[])?.reduce(
      (acc, p) => ({
        ...acc,
        [p.id]: p,
      }),
      {} as Record<string, Json<DBProject>>,
    )

    // Load all projects from Subgraph
    const sgProjects = await queryAllSGProjectsForServer()

    // Determine which subgraph projects should be updated
    const {
      subgraphProjects: sgProjectsToUpdate,
      retryMetadataCount,
      updatedProperties,
      idsOfNewProjects,
    } = formatSgProjectsForUpdate({
      sgProjects,
      dbProjects,
      retryIpfs,
      returnAllProjects: forceUpdateAll,
    })

    // Append metadata props to all changed subgraph projects, and re-resolve metadata where needed
    const resolveMetadataResults = await Promise.all(
      sgProjectsToUpdate.map(sgProject =>
        formatWithMetadata({
          sgProject,
          dbProject: dbProjects[sgProject.id],
        }),
      ),
    )

    const ipfsErrors = resolveMetadataResults.filter(r => r.error)

    // Write all updated projects (even those with missing metadata)
    const { error, data: updatedDBProjects } = await writeDBProjects(
      resolveMetadataResults.map(r => r.project),
    )

    if (error) {
      throw new Error('Error writing projects to database: ' + error.message)
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
    if (updatedDBProjects.length) {
      await dbpLog(
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
        count: updatedDBProjects.length,
        projects: updatedDBProjects,
      },
      errors: { ipfsErrors, count: ipfsErrors.length },
    })
  } catch (error) {
    const _error = formatError(error)

    await dbpLog({
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
