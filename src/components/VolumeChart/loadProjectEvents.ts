import { PV } from 'models/pv'
import { fromWad } from 'utils/format/formatNumber'

import {
  ProjectsTlDocument,
  ProjectsTlQuery,
  QueryProjectsArgs,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
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

  // Query balance of project for interval blocks
  blockRefs.forEach(blockRef => {
    // For block == null, don't specify block param
    const block =
      blockRef.block !== null ? { block: { number: blockRef.block } } : {}

    promises.push(
      client
        .query<ProjectsTlQuery, QueryProjectsArgs>({
          query: ProjectsTlDocument,
          variables: {
            where: {
              projectId,
              pv,
            },
            ...block,
          },
        })
        .then(data => {
          const { projects } = data.data

          let value: number | undefined = undefined

          const project = projects[0]

          if (!project) return
          projects.forEach(project => {
            switch (showGraph) {
              case 'volume':
                value = parseFloat(
                  parseFloat(fromWad(project.volume)).toFixed(4),
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
