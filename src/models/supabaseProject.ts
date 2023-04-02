import { BigNumber } from '@ethersproject/bignumber'
import { ProjectTag } from './project-tags'
import { ProjectMetadata } from './projectMetadata'

import { PV } from './pv'
import { Project } from './subgraph-entities/vX/project'

export type SGSBCompareKey = Extract<keyof Project, keyof SBProject>

/**
 * @param text Text to use for string search
 * @param tags Array of project tags
 * @param archived If true, return only archived projects. Otherwise archived projects are omitted
 * @param orderBy Property used to sort returned projects
 * @param orderDirection `asc` ascending or `desc` descending
 * @param page Page number
 * @param pageSize Number of results to return in single page
 */
export type SBProjectQueryOpts = {
  text?: string
  tags?: ProjectTag[]
  archived?: boolean
  pv?: PV[]
  orderBy?: 'totalPaid' | 'createdAt' | 'currentBalance' | 'paymentsCount'
  orderDirection?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export type SBProject = {
  id: string
  projectId: number
  createdAt: number
  pv: PV
  handle: string | null
  metadataUri: string
  currentBalance: BigNumber
  trendingScore: BigNumber
  totalPaid: BigNumber
  paymentsCount: number
  deployer: string | null
  terminal: string | null

  // Helper properties
  _hasUnresolvedMetadata?: boolean // Indicates if metadata has not been successfully resolved from IPFS
  _metadataRetriesLeft?: number // Allows us to only retry resolving metadata a finite number of times. Useful for invalid metadataUris or uris pointing to unpinned content
  _lastUpdated: number // Millis timestamp of last updated
  _v: string
} & Partial<
  Pick<
    ProjectMetadata,
    'description' | 'logoUri' | 'name' | 'tags' | 'archived'
  >
>
