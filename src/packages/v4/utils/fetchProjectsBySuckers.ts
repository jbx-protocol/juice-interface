import request from 'graphql-request'
import { SuckerPair } from 'juice-sdk-core'
import { v4SubgraphUri } from 'lib/apollo/subgraphUri'
import {
  ProjectsDocument,
  ProjectsQuery,
} from 'packages/v4/graphql/client/graphql'

export type ProjectSuckerData = {
  data: ProjectsQuery['projects'][0]
  sucker: SuckerPair
}

export const fetchProjectsBySuckers = async (suckers: SuckerPair[]) => {
  return await Promise.allSettled(
    suckers.map(async sucker => {
      const uri = v4SubgraphUri(sucker.peerChainId)
      const result = await request(uri, ProjectsDocument, {
        where: {
          projectId: Number(sucker.projectId),
        },
      })
      return {
        data: result.projects[0],
        sucker,
      }
    }),
  ).then(results => {
    return results.reduce((acc, result) => {
      if (result.status === 'rejected') {
        console.error(result.reason)
        return acc
      }
      acc.push(result.value)
      return acc
    }, [] as ProjectSuckerData[])
  })
}
