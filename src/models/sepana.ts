import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataV5 } from 'models/project-metadata'

import { PID, PV } from './project'

type SepanaEntity<T> = T & { _id: T extends { id: infer ID } ? ID : string }

export type SepanaProject = SepanaEntity<
  {
    id: PID
    projectId: number
    createdAt: number
    pv: PV
    handle: string | null | undefined
    metadataUri: string
    currentBalance: BigNumber
    trendingScore: BigNumber
    totalPaid: BigNumber
    deployer: string | null | undefined
    name?: string
    description?: string
    logoUri?: string
    hasUnresolvedMetadata?: boolean // Helper method to signify if metadata has been successfully resolved from IPFS
  } & Pick<ProjectMetadataV5, 'description' | 'logoUri' | 'name'> & {
      lastUpdated: number
    }
>

export type ProjectTimelinePoint = {
  timestamp: number
  trendingScore: string
  balance: string
  volume: string
}

export type SepanaProjectTimeline = SepanaEntity<{
  id: PID
  timeline365: ProjectTimelinePoint[]
  timeline30: ProjectTimelinePoint[]
  timeline7: ProjectTimelinePoint[]
}>

export type ProjectTimelineWindow = 7 | 30 | 365

export type BlockRef = {
  block: number // block number
  timestamp: number // timestamp in seconds
}

export type ProjectTimelineType = keyof Pick<
  ProjectTimelinePoint,
  'balance' | 'volume' | 'trendingScore'
>

export type SepanaQueryResponse<T> = {
  hits: {
    total: {
      value: number
      relation: string
    }
    max_score: number
    hits: {
      _index: string
      _type: string
      _id: string
      _score: number
      _source: T
    }[]
  }
}
