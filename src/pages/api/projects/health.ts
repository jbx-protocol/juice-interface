import { DbProjectsDocument, DbProjectsQuery, Project } from 'generated/graphql'
import { dbpLog, dbpQueryAll } from 'lib/api/supabase/projects'
import { paginateDepleteQuery } from 'lib/apollo/paginateDepleteQuery'
import { serverClient } from 'lib/apollo/serverClient'
import { SGSBCompareKey } from 'models/dbProject'
import { Json } from 'models/json'
import { NextApiHandler } from 'next'
import { formatSGProjectForDB, sgDbCompareKeys } from 'utils/sgDbProjects'

// Checks integrity of projects data in database against the current subgraph data
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
      (await paginateDepleteQuery<DbProjectsQuery>({
        client: serverClient,
        document: DbProjectsDocument,
      })) as unknown as Json<Pick<Project, SGSBCompareKey>>[]
    ).map(formatSGProjectForDB)

    report += `\n\n${dbProjectsCount} projects in database`

    // Check total project counts
    if (subgraphProjects.length !== dbProjectsCount) {
      report += `\n\nMismatched project counts. Subgraph: ${subgraphProjects.length}, Database: ${dbProjectsCount}`

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
        // Record projects that exist in database but not in Subgraph
        dbExtraProjects.push(`\`[${id}]\` Name: ${name}`)
      } else {
        // Ensure that database projects accurately reflect Subgraph projects
        sgDbCompareKeys.forEach(k => {
          // TODO bad types here
          if (
            subgraphProject[k as keyof typeof subgraphProject] !== dbProject[k]
          ) {
            mismatchedProjects.push(
              `\`[${id}]\` ${name ?? '<no name>'} **${k}** Subgraph: ${
                subgraphProject[k as keyof typeof subgraphProject]
              }, Database: ${dbProject[k]}`,
            )
          }
        })
      }
    }

    // Record projects that exist in Subgraph but not in database
    subgraphProjects.forEach(p =>
      dbMissingProjects.push(`ID: ${p.id}, Handle: ${p.handle}`),
    )

    if (dbExtraProjects.length) {
      report += `\n\n${dbExtraProjects.length} Database projects missing from Subgraph:`
      dbExtraProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (mismatchedProjects.length) {
      report += `\n\n${mismatchedProjects.length} Database projects not matching Subgraph:`
      mismatchedProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (projectsMissingMetadata.length) {
      report += `\n\n${projectsMissingMetadata.length} Database projects missing metadata:`
      projectsMissingMetadata.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (dbMissingProjects.length) {
      report += `\n\n${dbMissingProjects.length} Subgraph projects missing from database:`
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
