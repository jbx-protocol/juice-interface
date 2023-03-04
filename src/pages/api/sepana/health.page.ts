import { queryAll } from 'lib/sepana/api'
import { sepanaLog } from 'lib/sepana/log'
import { Json } from 'models/json'
import { SepanaProject } from 'models/sepana'
import { NextApiHandler } from 'next'
import { querySubgraphExhaustiveRaw } from 'utils/graph'
import { sgSepanaCompareKeys } from 'utils/sepana'

// Checks integrity of data in Sepana db against the current subgraph data
const handler: NextApiHandler = async (_, res) => {
  const { hits: sepanaProjects, total: sepanaProjectsCount } = await queryAll<
    Json<SepanaProject>
  >()

  const isEmpty = !sepanaProjectsCount

  let report = isEmpty
    ? `Database empty`
    : `Last updated at block: ${Math.max(
        ...sepanaProjects.map(p => p._source._lastUpdated),
      )}`

  let shouldAlert = isEmpty

  const sepanaIdErrors: string[] = []
  const sepanaExtraProjects: string[] = []
  const sepanaMissingProjects: string[] = []
  const mismatchedProjects: string[] = []
  const projectsMissingMetadata: string[] = []

  if (!isEmpty) {
    const subgraphProjects = (
      await querySubgraphExhaustiveRaw({
        entity: 'project',
        keys: sgSepanaCompareKeys,
      })
    ).map(p => ({ ...p, _id: p.id }))

    report += `\n\n${sepanaProjectsCount} projects in database`

    // Check total project counts
    if (subgraphProjects.length !== sepanaProjectsCount) {
      report += `\n\nMismatched project counts. Subgraph: ${subgraphProjects.length}, Sepana: ${sepanaProjectsCount}`

      shouldAlert = true
    }

    // Check for specific mismatched projects
    for (const sepanaProject of sepanaProjects) {
      const { _source } = sepanaProject
      const {
        id,
        name,
        metadataUri,
        _hasUnresolvedMetadata,
        _metadataRetriesLeft,
      } = _source

      // Ensure that Sepana record IDs are internally consistent
      if (sepanaProject._id !== id) {
        sepanaIdErrors.push(`\`[${sepanaProject._id}]\` _source.id: ${id}`)
      }

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
        sepanaExtraProjects.push(`\`[${id}]\` Name: ${name}`)
      } else {
        // Ensure that Sepana records accurately reflect Subgraph data
        sgSepanaCompareKeys.forEach(k => {
          // TODO bad types here
          if (
            subgraphProject[k as keyof typeof subgraphProject] !== _source[k]
          ) {
            mismatchedProjects.push(
              `\`[${id}]\` ${name ?? '<no name>'} **${k}** Subgraph: ${
                subgraphProject[k as keyof typeof subgraphProject]
              }, Sepana: ${_source[k]}`,
            )
          }
        })
      }
    }

    // Record projects that exist in subgraph but not in sepana
    subgraphProjects.forEach(p =>
      sepanaMissingProjects.push(`ID: ${p.id}, Handle: ${p.handle}`),
    )

    if (sepanaIdErrors.length) {
      report += `\n\n${sepanaExtraProjects.length} Sepana project records with bad IDs:`
      sepanaIdErrors.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }

    if (sepanaExtraProjects.length) {
      report += `\n\n${sepanaExtraProjects.length} Sepana projects missing from Subgraph:`
      sepanaExtraProjects.forEach(e => (report += `\n${e}`))

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

    if (sepanaMissingProjects.length) {
      report += `\n\n${sepanaMissingProjects.length} Subgraph projects missing from Sepana:`
      sepanaMissingProjects.forEach(e => (report += `\n${e}`))

      shouldAlert = true
    }
  }

  await sepanaLog(
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
    sepanaProjectsCount,
    sepanaIdErrors: {
      data: sepanaIdErrors,
      count: sepanaIdErrors.length,
    },
    sepanaExtraProjects: {
      data: sepanaExtraProjects,
      count: sepanaExtraProjects.length,
    },
    sepanaMissingProjects: {
      data: sepanaMissingProjects,
      count: sepanaMissingProjects.length,
    },
    mismatchedProjects: {
      data: mismatchedProjects,
      count: sepanaMissingProjects.length,
    },
    projectsMissingMetadata: {
      data: projectsMissingMetadata,
      count: projectsMissingMetadata.length,
    },
  })
}

export default handler
