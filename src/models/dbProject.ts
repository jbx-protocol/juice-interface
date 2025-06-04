import { BigNumber } from '@ethersproject/bignumber'
import { Database } from 'types/database.types'

import { Project } from 'generated/graphql'
import { JBChainId } from 'juice-sdk-core'
import { ProjectTagName } from './project-tags'
import { PV } from './pv'
type P = Project & { chainId: number; suckerGroupId: string }
export type SGSBCompareKey = Extract<keyof P, keyof DBProject>

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
  chainIds?: JBChainId[]
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
  suckerGroupId: string | null
  chainId: JBChainId
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

export type DBProjectsAggregate = Omit<
  DBProject,
  '_hasUnresolvedMetadata' | '_metadataRetriesLeft' | '_updatedAt'
> & { chainIds?: JBChainId[] } // we type chainIds as optional only for compatibility with DBProject type in certain components

export type DBProjectRow = Omit<
  Database['public']['Tables']['projects']['Row'],
  'project_search'
>

type _NotNullProjectsAggregateCols =
  | 'chain_id'
  | 'chain_ids'
  | 'contributors_count'
  | 'created_at'
  | 'creator'
  | 'current_balance'
  | 'deployer'
  | 'id'
  | 'nfts_minted_count'
  | 'owner'
  | 'payments_count'
  | 'project_id'
  | 'pv'
  | 'redeem_count'
  | 'redeem_volume'
  | 'redeem_volume_usd'
  | 'trending_payments_count'
  | 'trending_score'
  | 'trending_volume'
  | 'volume'
  | 'volume_usd'

type NotNulls<T> = {
  [P in keyof T]: T[P] extends infer Z | null ? Z : T[P]
}

// manually cast some properties as not null. not null should be runtime enforced in sql view
export type DBProjectsAggregateRow = NotNulls<
  Pick<
    Database['public']['Views']['projects_aggregate']['Row'],
    _NotNullProjectsAggregateCols
  >
> &
  Omit<
    Database['public']['Views']['projects_aggregate']['Row'],
    _NotNullProjectsAggregateCols
  >
