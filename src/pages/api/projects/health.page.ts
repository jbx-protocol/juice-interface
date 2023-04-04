import { dbpLog, dbpQueryAll } from 'lib/api/supabase/projects'
import { NextApiHandler } from 'next'
import { querySubgraphExhaustiveRaw } from 'utils/graph'
import { sgDbCompareKeys } from 'utils/sgDbProjects'

// Checks integrity of data in Supabase db against the current subgraph data
const handler: NextApiHandler = async (_, res) => {
  const { data: dbProjects } = await dbpQueryAll()

  const dbProjectsCount = dbProjects?.length

  const isEmpty = !dbProjectsCount

  let report = isEmpty
    ? `Database empty`
    : `Last updated at block: ${Math.max(...dbProjects.map(p => p._updatedAt))}`

  let shouldAlert = isEmpty

  const dbExtraProjects: string[] = []
  const dbMissingProjects: string[] = []
  const mismatchedProjects: string[] = []
  const projectsMissingMetadata: string[] = []

  if (!isEmpty) {
    const subgraphProjects = (
      await querySubgraphExhaustiveRaw({
        entity: 'project',
        keys: sgDbCompareKeys,
      })
    ).map(p => ({ ...p, _id: p.id }))

    report += `\n\n${dbProjectsCount} projects in database`

    // Check total project counts
    if (subgraphProjects.length !== dbProjectsCount) {
      report += `\n\nMismatched project counts. Subgraph: ${subgraphProjects.length}, Supabase: ${dbProjectsCount}`

      shouldAlert = true
    }

    // Check for specific mismatched projects
    for (const dbProject of dbProjects) {
      const {
        id,
        name,
        metadataUri,
        _hasUnresolvedMetadata,
        _metadataRetriesLeft,
      } = dbProject

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
        // Record projects that exist in Supabase but not in Subgraph
        dbExtraProjects.push(`\`[${id}]\` Name: ${name}`)
      } else {
        // Ensure that Supabase records accurately reflect Subgraph data
        sgDbCompareKeys.forEach(k => {
          // TODO bad types here
          if (
            subgraphProject[k as keyof typeof subgraphProject] !== dbProject[k]
          ) {
            mismatchedProjects.push(
              `\`[${id}]\` ${name ?? '<no name>'} **${k}** Subgraph: ${
                subgraphProject[k as keyof typeof subgraphProject]
              }, Supabase: ${dbProject[k]}`,
            )
          }
        })
      }
    }

    // Record projects that exist in Subgraph but not in Supabase
    subgraphProjects.forEach(p =>
      dbMissingProjects.push(`ID: ${p.id}, Handle: ${p.handle}`),
    )

    if (dbExtraProjects.length) {
      report += `\n\n${dbExtraProjects.length} Supabase projects missing from Subgraph:`
      dbExtraProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (mismatchedProjects.length) {
      report += `\n\n${mismatchedProjects.length} Supabase projects not matching Subgraph:`
      mismatchedProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (projectsMissingMetadata.length) {
      report += `\n\n${projectsMissingMetadata.length} Supabase projects missing metadata:`
      projectsMissingMetadata.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (dbMissingProjects.length) {
      report += `\n\n${dbMissingProjects.length} Subgraph projects missing from Supabase:`
      dbMissingProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }
  }

  await dbpLog(
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
    dbProjectsCount,
    dbExtraProjects: {
      data: dbExtraProjects,
      count: dbExtraProjects.length,
    },
    dbMissingProjects: {
      data: dbMissingProjects,
      count: dbMissingProjects.length,
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
