import { BigNumber } from '@ethersproject/bignumber'
import { AnyProjectMetadata } from 'models/projectMetadata'

import { ProjectTag } from './project-tags'
import { PV } from './pv'
import { Project } from './subgraph-entities/vX/project'

export type SGSepanaCompareKey = Extract<keyof Project, keyof SepanaProject>

export type SepanaProject = {
  id: string
  projectId: number
  createdAt: number
  pv: PV
  handle: string | null
  metadataUri: string
  currentBalance: BigNumber
  trendingScore: BigNumber
  totalPaid: BigNumber
  deployer: string | null
  terminal: string | null
  name?: string
  description?: string
  logoUri?: string
  tags?: ProjectTag[]
  _hasUnresolvedMetadata?: boolean // Helper property to signify if metadata has been successfully resolved from IPFS
  _metadataRetriesLeft?: number // Helper property allowing us to only retry resolving metadata a finite number of times. Useful for invalid metadataUris or uris pointing to unpinned content
  _v?: string
} & Pick<AnyProjectMetadata, 'description' | 'logoUri' | 'name'> & {
    _lastUpdated: number // Millis timestamp of last updated
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
