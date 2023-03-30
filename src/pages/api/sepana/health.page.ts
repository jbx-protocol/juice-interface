import { sbpQueryAll } from 'lib/sepana/api'
import { sbpLog } from 'lib/sepana/log'
import { NextApiHandler } from 'next'
import { querySubgraphExhaustiveRaw } from 'utils/graph'
import { sgSbCompareKeys } from 'utils/subgraphSupabaseProjects'

// Checks integrity of data in Supabase db against the current subgraph data
const handler: NextApiHandler = async (_, res) => {
  const { data: sbProjects } = await sbpQueryAll()

  const sbProjectsCount = sbProjects?.length

  const isEmpty = !sbProjectsCount

  let report = isEmpty
    ? `Database empty`
    : `Last updated at block: ${Math.max(
        ...sbProjects.map(p => p._lastUpdated),
      )}`

  let shouldAlert = isEmpty

  const sbExtraProjects: string[] = []
  const sbMissingProjects: string[] = []
  const mismatchedProjects: string[] = []
  const projectsMissingMetadata: string[] = []

  if (!isEmpty) {
    const subgraphProjects = (
      await querySubgraphExhaustiveRaw({
        entity: 'project',
        keys: sgSbCompareKeys,
      })
    ).map(p => ({ ...p, _id: p.id }))

    report += `\n\n${sbProjectsCount} projects in database`

    // Check total project counts
    if (subgraphProjects.length !== sbProjectsCount) {
      report += `\n\nMismatched project counts. Subgraph: ${subgraphProjects.length}, Sepana: ${sbProjectsCount}`

      shouldAlert = true
    }

    // Check for specific mismatched projects
    for (const sbProject of sbProjects) {
      const {
        id,
        name,
        metadataUri,
        _hasUnresolvedMetadata,
        _metadataRetriesLeft,
      } = sbProject

      if (_hasUnresolvedMetadata && _metadataRetriesLeft) {
        projectsMissingMetadata.push(
          `\`[${id}]\` metadataUri: ${metadataUri}. ${_metadataRetriesLeft} retries left`,
        )
      }

      const subgraphProject = subgraphProjects.splice(
        subgraphProjects.findIndex(el => el.id === id),
        1,
      )[0]

      if (!subgraphProject) {
        // Record projects that exist in sepana but not in subgraph
        sbExtraProjects.push(`\`[${id}]\` Name: ${name}`)
      } else {
        // Ensure that Sepana records accurately reflect Subgraph data
        sgSbCompareKeys.forEach(k => {
          // TODO bad types here
          if (
            subgraphProject[k as keyof typeof subgraphProject] !== sbProject[k]
          ) {
            mismatchedProjects.push(
              `\`[${id}]\` ${name ?? '<no name>'} **${k}** Subgraph: ${
                subgraphProject[k as keyof typeof subgraphProject]
              }, Supabase: ${sbProject[k]}`,
            )
          }
        })
      }
    }

    // Record projects that exist in subgraph but not in sepana
    subgraphProjects.forEach(p =>
      sbMissingProjects.push(`ID: ${p.id}, Handle: ${p.handle}`),
    )

    if (sbExtraProjects.length) {
      report += `\n\n${sbExtraProjects.length} Sepana projects missing from Subgraph:`
      sbExtraProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (mismatchedProjects.length) {
      report += `\n\n${mismatchedProjects.length} Sepana projects not matching Subgraph:`
      mismatchedProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (projectsMissingMetadata.length) {
      report += `\n\n${projectsMissingMetadata.length} Sepana projects missing metadata:`
      projectsMissingMetadata.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (sbMissingProjects.length) {
      report += `\n\n${sbMissingProjects.length} Subgraph projects missing from Sepana:`
      sbMissingProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }
  }

  await sbpLog(
    shouldAlert
      ? {
          type: 'alert',
          alert: 'BAD_DB_HEALTH',
          body: report,
        }
      : {
          type: 'notification',
          notif: 'DB_OK',
        },
  )

  res.status(200).json({
    network: process.env.NEXT_PUBLIC_INFURA_NETWORK,
    status: shouldAlert ? 'ERROR' : 'OK',
    message: report,
    sbProjectsCount,
    sbExtraProjects: {
      data: sbExtraProjects,
      count: sbExtraProjects.length,
    },
    sbMissingProjects: {
      data: sbMissingProjects,
      count: sbMissingProjects.length,
    },
    mismatchedProjects: {
      data: mismatchedProjects,
      count: mismatchedProjects.length,
    },
    projectsMissingMetadata: {
      data: projectsMissingMetadata,
      count: projectsMissingMetadata.length,
    },
  })
}

export default handler
