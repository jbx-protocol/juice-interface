import { BigNumber } from '@ethersproject/bignumber'
import { BallotState } from 'models/ballot'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { V2FundingCycle, V2FundingCycleMetadata } from 'models/v2/fundingCycle'
import { Split } from 'models/v2/splits'
import { createContext } from 'react'

export type V2ProjectContextType = {
  isPreviewMode?: boolean

  projectId: BigNumber | undefined
  projectMetadata: ProjectMetadataV4 | undefined
  tokenAddress: string | undefined
  tokenSymbol: string | undefined
  terminals: string[] | undefined // array of terminal addresses, 0xABC...
  ETHBalance: BigNumber | undefined
  projectOwnerAddress: string | undefined
  balanceInDistributionLimitCurrency: BigNumber | undefined
  usedDistributionLimit: BigNumber | undefined // how much has been distributed

  fundingCycleMetadata: V2FundingCycleMetadata | undefined
  queuedFundingCycleMetadata: V2FundingCycleMetadata | undefined
  fundingCycle: V2FundingCycle | undefined
  queuedFundingCycle: V2FundingCycle | undefined
  ballotState: BallotState | undefined

  distributionLimit: BigNumber | undefined // previously funding target
  distributionLimitCurrency: BigNumber | undefined
  queuedDistributionLimit: BigNumber | undefined
  queuedDistributionLimitCurrency: BigNumber | undefined

  payoutSplits: Split[] | undefined
  queuedPayoutSplits: Split[] | undefined

  reservedTokensSplits: Split[] | undefined
  queuedReservedTokensSplits: Split[] | undefined

  primaryTerminalCurrentOverflow: BigNumber | undefined
  totalTokenSupply: BigNumber | undefined
}

export const V2ProjectContext = createContext<V2ProjectContextType>({
  isPreviewMode: false,

  projectId: undefined,
  projectMetadata: undefined,
  tokenAddress: undefined,
  tokenSymbol: undefined,
  terminals: undefined,
  ETHBalance: undefined,
  projectOwnerAddress: undefined,
  balanceInDistributionLimitCurrency: undefined,
  usedDistributionLimit: undefined,

  fundingCycleMetadata: undefined,
  queuedFundingCycleMetadata: undefined,
  fundingCycle: undefined,
  queuedFundingCycle: undefined,
  ballotState: undefined,

  distributionLimit: undefined,
  distributionLimitCurrency: undefined,
  queuedDistributionLimit: undefined,
  queuedDistributionLimitCurrency: undefined,

  payoutSplits: undefined,
  queuedPayoutSplits: undefined,

  reservedTokensSplits: undefined,
  queuedReservedTokensSplits: undefined,

  primaryTerminalCurrentOverflow: undefined,
  totalTokenSupply: undefined,
})
