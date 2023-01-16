import { NextApiHandler } from 'next'
import { queryAllSepanaProjects, sepanaAlert } from './utils'
import { querySubgraphExhaustive } from 'utils/graph'
import { SepanaProject } from 'models/sepana'
import { Project, ProjectJson } from 'models/subgraph-entities/vX/project'
import { BigNumber } from '@ethersproject/bignumber'

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

// Returns search database health report
const handler: NextApiHandler = async (_, res) => {
  const sepanaResponse = await queryAllSepanaProjects()

  let report = `⏰ Sepana last updated at block ${Math.max(
    ...sepanaResponse.data.hits.hits.map(r => r._source.lastUpdated),
  )}.`

  let shouldError = false

  const subgraphProjects = (
    await querySubgraphExhaustive({
      entity: 'project',
      keys: projectKeys as (keyof Project)[],
    })
  )
    .map(p => ({ ...p, _id: p.id }))
    .map(p =>
      Object.entries(p).reduce(
        (acc, [k, v]) => ({
          ...acc,
          // TODO avoid formatting the response in querySubgraphExhaustive? we only need the json
          [k]: BigNumber.isBigNumber(v) ? v.toString() : v, // Convert BigNumbers to strings
        }),
        {} as ProjectJson,
      ),
    )

  // Check total project counts
  if (subgraphProjects.length !== sepanaResponse.data.hits.total.value) {
    report += `\n🛑 Mismatched lengths: ${subgraphProjects.length} Subgraph projects, ${sepanaResponse.data.hits.total.value} Sepana projects`

    shouldError = true
  }

  const sepanaIdErrors: string[] = []
  const sepanaExtraProjects: string[] = []
  const sepanaMissingProjects: string[] = []
  const mismatchedProjects: string[] = []

  // Check for specific mismatched projects
  for (const sepanaProject of sepanaResponse.data.hits.hits) {
    // Ensure that Sepana record IDs are internally consistent
    if (sepanaProject._id !== sepanaProject._source.id) {
      sepanaIdErrors.push(
        `ID: ${sepanaProject._id}, _source.id: ${sepanaProject._source.id}`,
      )
    }

    const subgraphProject = subgraphProjects.splice(
      subgraphProjects.findIndex(el => el.id === sepanaProject._source.id),
      1,
    )[0]

    // Ensure that no extra projects exist in Sepana
    if (!subgraphProject) {
      sepanaExtraProjects.push(
        `ID: ${sepanaProject._source.id}, Name: ${sepanaProject._source.name}`,
      )
    }

    // Ensure that Sepana records accurately reflect Subgraph data
    projectKeys.forEach(k => {
      // TODO bad types here
      const property = subgraphProject[k as keyof typeof subgraphProject]

      mismatchedProjects.push(
        `ID: ${subgraphProject.id}, Property: ${k} || Subgraph: ${property}, Sepana: ${sepanaProject._source[k]}`,
      )
    })
  }

  // Iterate over any subgraphProjects left in array
  subgraphProjects.forEach(p =>
    sepanaMissingProjects.push(
      `PV: ${p.pv}, ProjectId: ${p.id}, Handle: ${p.handle}`,
    ),
  )

  if (sepanaIdErrors.length) {
    report += `\n\n🛑 ${sepanaExtraProjects.length} Sepana project records with bad IDs`
    sepanaIdErrors.forEach(e => (report += `\n${e}`))

    shouldError = true
  }

  if (sepanaExtraProjects.length) {
    report += `\n\n🛑 ${sepanaExtraProjects.length} Sepana projects missing from Subgraph`
    sepanaExtraProjects.forEach(e => (report += `\n${e}`))

    shouldError = true
  }

  if (mismatchedProjects.length) {
    report += `\n\n🛑 ${mismatchedProjects.length} Sepana projects not matching Subgraph`
    mismatchedProjects.forEach(e => (report += `\n${e}`))

    shouldError = true
  }

  if (sepanaMissingProjects.length) {
    report += `\n\n🛑 ${sepanaMissingProjects.length} Subgraph projects missing from Sepana`
    sepanaMissingProjects.forEach(e => (report += `\n${e}`))

    shouldError = true
  }

  if (shouldError) {
    sepanaAlert({ type: 'alert', alert: 'BAD_DB_HEALTH', subject: report })
  }

  res
    .status(200)
    .send(
      `Sepana DB status (${process.env.NEXT_PUBLIC_INFURA_NETWORK}):\n${report}`,
    )
}

export default handler
