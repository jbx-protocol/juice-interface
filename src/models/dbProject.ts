import { BigNumber } from 'ethers'
import { Database } from 'types/database.types'

import { Project } from 'generated/graphql'
import { ProjectTagName } from './project-tags'
import { PV } from './pv'

export type SGSBCompareKey = Extract<keyof Project, keyof DBProject>

/**
 * @param text Text to use for string search
 * @param tags Array of project tags
 * @param archived If true, return only archived projects. Otherwise archived projects are omitted
 * @param orderBy Property used to sort returned projects
 * @param orderDirection `asc` ascending or `desc` descending
 * @param page Page number
 * @param pageSize Number of results to return in single page
 */
export type DBProjectQueryOpts = {
  text?: string
  tags?: ProjectTagName[]
  archived?: boolean
  projectId?: number
  ids?: string[]
  pv?: PV[]
  owner?: string
  creator?: string
  orderBy?: 'volume' | 'created_at' | 'current_balance' | 'payments_count'
  orderDirection?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export type DBProject = {
  id: string
  projectId: number
  createdAt: number
  pv: PV
  handle: string | null
  metadataUri: string | null

  currentBalance: BigNumber
  trendingScore: BigNumber
  volume: BigNumber
  volumeUSD: BigNumber
  redeemVolume: BigNumber
  redeemVolumeUSD: BigNumber
  trendingVolume: BigNumber

  paymentsCount: number
  trendingPaymentsCount: number
  contributorsCount: number
  nftsMintedCount: number
  redeemCount: number
  createdWithinTrendingWindow: boolean | null

  owner: string
  creator: string
  deployer: string | null
  terminal: string | null

  description: string | null
  logoUri: string | null
  name: string | null
  tags: ProjectTagName[] | null
  archived: boolean | null

  // Helper properties
  _hasUnresolvedMetadata?: boolean | null // Indicates if metadata has not been successfully resolved from IPFS
  _metadataRetriesLeft?: number | null // Allows us to only retry resolving metadata a finite number of times. Useful for invalid metadataUris or uris pointing to unpinned content
  _updatedAt: number // Millis timestamp of last updated
}

export type DBProjectRow = Omit<
  Database['public']['Tables']['projects']['Row'],
  'project_search'
>
