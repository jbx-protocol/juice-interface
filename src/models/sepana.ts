import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataV5 } from 'models/project-metadata'

import { PV } from './pv'

type SepanaProjectMetadataProps = Pick<
  ProjectMetadataV5,
  'description' | 'logoUri' | 'name'
> & {
  lastUpdated: number
}

type BaseSepanaProject = {
  id: string
  projectId: number
  pv: PV
  handle: string | null | undefined
  metadataUri: string
  currentBalance: string
  totalPaid: string
  createdAt: number
  trendingScore: string
  deployer: string | null | undefined
  name?: string
  description?: string
  logoUri?: string
}

// Project type stored in Sepana db
export type SepanaProjectJson = BaseSepanaProject & SepanaProjectMetadataProps

export type SepanaProject = Omit<
  BaseSepanaProject,
  'currentBalance' | 'trendingScore' | 'totalPaid'
> & {
  currentBalance: BigNumber
  trendingScore: BigNumber
  totalPaid: BigNumber
} & SepanaProjectMetadataProps

export type SepanaSearchResponse<T> = {
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

export type SepanaBigNumber = { type: 'BigNumber'; hex: string }
