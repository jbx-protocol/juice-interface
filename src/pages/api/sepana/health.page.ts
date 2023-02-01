import { queryAll } from 'lib/sepana/api'
import { sepanaLog } from 'lib/sepana/log'
import { Json } from 'models/json'
import { SepanaProject } from 'models/sepana'
import { NextApiHandler } from 'next'
import { querySubgraphExhaustiveRaw } from 'utils/graph'

type ProjectKey =
  | 'id'
  | 'projectId'
  | 'pv'
  | 'handle'
  | 'metadataUri'
  | 'currentBalance'
  | 'totalPaid'
  | 'createdAt'
  | 'trendingScore'
  | 'deployer'

const projectKeys: ProjectKey[] = [
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

// Checks integrity of data in Sepana db against the current subgraph data
const handler: NextApiHandler = async (_, res) => {
  const sepanaResponse = await queryAll<Json<SepanaProject>>()

  const projectsCount = sepanaResponse.data.hits.hits.length

  const isEmpty = !projectsCount

  let report = isEmpty
    ? `Database empty`
    : `Last updated at block: ${Math.max(
        ...sepanaResponse.data.hits.hits.map(
          r => r._source.lastUpdated as number,
        ),
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
        keys: projectKeys,
      })
    ).map(p => ({ ...p, _id: p.id }))

    report += `\n\n${sepanaResponse.data.hits.total.value} projects in database`

    // Check total project counts
    if (subgraphProjects.length !== sepanaResponse.data.hits.total.value) {
      report += `\n\nMismatched project counts. Subgraph: ${subgraphProjects.length}, Sepana: ${sepanaResponse.data.hits.total.value}`

      shouldAlert = true
    }

    // Check for specific mismatched projects
    for (const sepanaProject of sepanaResponse.data.hits.hits) {
      // Ensure that Sepana record IDs are internally consistent
      if (sepanaProject._id !== sepanaProject._source.id) {
        sepanaIdErrors.push(
          `\`[${sepanaProject._id}]\` _source.id: ${sepanaProject._source.id}`,
        )
      }

      if (sepanaProject._source.hasUnresolvedMetadata) {
        projectsMissingMetadata.push(
          `\`[${sepanaProject._source.id}]\` metadataUri: ${sepanaProject._source.metadataUri}`,
        )
      }

      const subgraphProject = subgraphProjects.splice(
        subgraphProjects.findIndex(el => el.id === sepanaProject._source.id),
        1,
      )[0]

      // Ensure that no extra projects exist in Sepana
      if (!subgraphProject) {
        sepanaExtraProjects.push(
          `\`[${sepanaProject._source.id}]\` Name: ${sepanaProject._source.name}`,
        )
      }

      // Ensure that Sepana records accurately reflect Subgraph data
      projectKeys.forEach(k => {
        // TODO bad types here
        if (
          subgraphProject[k as keyof typeof subgraphProject] !==
          sepanaProject._source[k]
        ) {
          mismatchedProjects.push(
            `\`[${sepanaProject._source.id}]\` ${
              sepanaProject._source.name ?? '<no name>'
            } **${k}** Subgraph: ${
              subgraphProject[k as keyof typeof subgraphProject]
            }, Sepana: ${sepanaProject._source[k]}`,
          )
        }
      })
    }

    // Iterate over any subgraphProjects left in array
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
    projectsCount,
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
