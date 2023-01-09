// import { NextApiHandler } from 'next'
// import { queryAllSepanaProjects } from './utils'
// import { querySubgraphExhaustive } from 'utils/graph'
// import { SepanaProject } from 'models/sepana'
// import { Project, ProjectJson } from 'models/subgraph-entities/vX/project'
// import { BigNumber } from '@ethersproject/bignumber'

// const projectKeys: (keyof SepanaProject)[] = [
//   'id',
//   'projectId',
//   'pv',
//   'handle',
//   'metadataUri',
//   'currentBalance',
//   'totalPaid',
//   'createdAt',
//   'trendingScore',
//   'deployer',
// ]

// // Returns search database health report
// const handler: NextApiHandler = async (_, res) => {
//   let report = ''
//   const sepanaResponse = await queryAllSepanaProjects()
//   const subgraphProjects = (
//     await querySubgraphExhaustive({
//       entity: 'project',
//       keys: projectKeys as (keyof Project)[],
//     })
//   )
//     .map(p => ({ ...p, _id: p.id }))
//     .map(p =>
//       Object.entries(p).reduce(
//         (acc, [k, v]) => ({
//           ...acc,
//           [k]: BigNumber.isBigNumber(v) ? v.toString() : v, // Store BigNumbers as strings
//         }),
//         {} as ProjectJson,
//       ),
//     )

//   report += `\nSepana last updated at block ${Math.max(
//     ...sepanaResponse.data.hits.hits.map(r => r._source.lastUpdated),
//   )}.`

//   if (subgraphProjects.length + 1 !== sepanaResponse.data.hits.total.value)
//     report += `\nMismatched lengths: ${
//       subgraphProjects.length + 1
//     } Subgraph projects, ${
//       sepanaResponse.data.hits.total.value
//     } Sepana projects.`

//   for (const r of sepanaResponse.data.hits.hits) {
//     // Ensure that Sepana record IDs are internally consistent
//     if (r._id !== r._source.id)
//       report += `\n_id !== id in Sepana record: ` + JSON.stringify(r)
//     const subgraphProject = subgraphProjects.splice(
//       subgraphProjects.findIndex(el => el.id === r._source.id),
//       1,
//     )[0]
//     // Ensure that all Sepana records can be found in the Subgraph
//     if (!subgraphProject)
//       report += `\nSepana record not found on Subgraph: ` + JSON.stringify(r)
//     // Ensure that Sepana records accurately reflect Subgraph data
//     projectKeys.forEach(k => {
//       //@ts-ignore
//       report +=
//         subgraphProject[k] !== r._source[k]
//           ? `\n${k} mismatched for project ${r._id}. Sepana: ${r._source[k]}, Subgraph: ${subgraphProject[k]}`
//           : ''
//     })
//   }
//   subgraphProjects.forEach(
//     p =>
//       (report += `\nSubgraph record not found on Sepana: ` + JSON.stringify(p)),
//   )

//   res.status(200).send(`ENGINE HEALTH REPORT:` + report)
// }

// export default handler
