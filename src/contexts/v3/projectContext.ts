import { BigNumber } from '@ethersproject/bignumber'
import { V3BallotState } from 'models/ballot'
import { CV } from 'models/cv'
import { NftRewardTier } from 'models/nftRewardTier'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { Split } from 'models/splits'
import { V3FundingCycle, V3FundingCycleMetadata } from 'models/v3/fundingCycle'
import { createContext } from 'react'

type V3ProjectLoadingStates = {
  ETHBalanceLoading: boolean
  balanceInDistributionLimitCurrencyLoading: boolean
  distributionLimitLoading: boolean
  fundingCycleLoading: boolean
  usedDistributionLimitLoading: boolean
}

export type V3ProjectContextType = {
  isPreviewMode?: boolean

  projectId: number | undefined
  handle: string | undefined
  createdAt: number | undefined
  cv: CV | undefined
  projectMetadata: ProjectMetadataV4 | undefined
  tokenAddress: string | undefined
  tokenSymbol: string | undefined
  tokenName: string | undefined
  terminals: string[] | undefined // array of terminal addresses, 0xABC...
  primaryTerminal: string | undefined
  ETHBalance: BigNumber | undefined
  totalVolume: BigNumber | undefined
  projectOwnerAddress: string | undefined
  balanceInDistributionLimitCurrency: BigNumber | undefined
  usedDistributionLimit: BigNumber | undefined // how much has been distributed
  isArchived: boolean | undefined

  fundingCycleMetadata: V3FundingCycleMetadata | undefined
  fundingCycle: V3FundingCycle | undefined
  ballotState: V3BallotState | undefined

  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined

  payoutSplits: Split[] | undefined
  reservedTokensSplits: Split[] | undefined

  primaryTerminalCurrentOverflow: BigNumber | undefined
  totalTokenSupply: BigNumber | undefined

  nftRewards: {
    CIDs: string[] | undefined
    rewardTiers: NftRewardTier[] | undefined
    loading: boolean | undefined
  }

  veNft: {
    contractAddress: string | undefined
    uriResolver: string | undefined
  }

  loading: V3ProjectLoadingStates
}

export const V3ProjectContext = createContext<V3ProjectContextType>({
  isPreviewMode: false,

  projectId: undefined,
  handle: undefined,
  createdAt: undefined,
  cv: undefined,
  projectMetadata: undefined,
  tokenAddress: undefined,
  tokenSymbol: undefined,
  tokenName: undefined,
  terminals: undefined,
  primaryTerminal: undefined,
  ETHBalance: undefined,
  totalVolume: undefined,
  projectOwnerAddress: undefined,
  balanceInDistributionLimitCurrency: undefined,
  usedDistributionLimit: undefined,
  isArchived: undefined,

  fundingCycleMetadata: undefined,
  fundingCycle: undefined,
  ballotState: undefined,

  distributionLimit: undefined,
  distributionLimitCurrency: undefined,

  payoutSplits: undefined,
  reservedTokensSplits: undefined,

  primaryTerminalCurrentOverflow: undefined,
  totalTokenSupply: undefined,

  nftRewards: {
    CIDs: undefined,
    rewardTiers: undefined,
    loading: undefined,
  },

  veNft: {
    contractAddress: undefined,
    uriResolver: undefined,
  },

  loading: {
    ETHBalanceLoading: false,
    balanceInDistributionLimitCurrencyLoading: false,
    distributionLimitLoading: false,
    fundingCycleLoading: false,
    usedDistributionLimitLoading: false,
  },
})
