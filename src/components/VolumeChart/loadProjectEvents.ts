import { SGWhereArg } from 'models/graph'
import { PV } from 'models/pv'
import { Project } from 'models/subgraph-entities/vX/project'
import { fromWad } from 'utils/format/formatNumber'
import { querySubgraph } from 'utils/graph'

import { BlockRef, EventRef, ShowGraph } from './types'

export const loadProjectEvents = async ({
  blockRefs,
  showGraph,
  projectId,
  pv,
}: {
  blockRefs: BlockRef[]
  showGraph: ShowGraph
  projectId: number
  pv: PV
}) => {
  const newEvents: EventRef[] = []
  const promises: Promise<void>[] = []

  if (!blockRefs.length) return

  let queryKeys: (keyof Project)[]

  switch (showGraph) {
    case 'volume':
      queryKeys = ['totalPaid']
      break
    case 'balance':
      queryKeys = ['currentBalance']
      break
  }

  // Query balance of project for interval blocks
  blockRefs.forEach(blockRef => {
    const whereOpts: SGWhereArg<'project'>[] = []
    if (projectId) {
      whereOpts.push({ key: 'projectId', value: projectId })
    }
    if (pv) {
      whereOpts.push({ key: 'pv', value: pv })
    }

    // For block == null, don't specify block param
    const block =
      blockRef.block !== null ? { block: { number: blockRef.block } } : {}

    promises.push(
      querySubgraph({
        entity: 'project',
        keys: queryKeys,
        ...block,
        where: whereOpts,
      }).then(projects => {
        if (!projects.length) return

        let value: number | undefined = undefined

        const project = projects[0]

        if (!project) return
        projects.forEach(project => {
          switch (showGraph) {
            case 'volume':
              value = parseFloat(
                parseFloat(fromWad(project.totalPaid)).toFixed(4),
              )
              break
            case 'balance':
              value = parseFloat(
                parseFloat(fromWad(project.currentBalance)).toFixed(4),
              )
              break
          }

          if (value !== undefined) {
            newEvents.push({
              timestamp: blockRef.timestamp,
              value,
            })
          }
        })
      }),
    )
  })

  await Promise.allSettled(promises)
  return newEvents
}
