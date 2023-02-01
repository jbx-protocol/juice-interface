import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataV5 } from 'models/project-metadata'

import { PV } from './pv'

export type SepanaProject = {
  id: string
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

// Project type stored in Sepana db
export type SepanaProjectJson = Omit<
  SepanaProject,
  'currentBalance' | 'trendingScore' | 'totalPaid'
> & {
  currentBalance: string
  trendingScore: string
  totalPaid: string
}

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
