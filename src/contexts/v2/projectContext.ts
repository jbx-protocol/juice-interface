import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { V2FundingCycle, V2FundingCycleMetadata } from 'models/v2/fundingCycle'
import { Split } from 'models/v2/splits'
import { createContext } from 'react'

export type V2ProjectContextType = {
  projectId: BigNumber | undefined
  projectMetadata: ProjectMetadataV4 | undefined
  fundingCycleMetadata: V2FundingCycleMetadata | undefined
  fundingCycle: V2FundingCycle | undefined
  queuedFundingCycle: V2FundingCycle | undefined
  distributionLimit: BigNumber | undefined
  queuedDistributionLimit: BigNumber | undefined
  payoutSplits: Split[] | undefined
  queuedPayoutSplits: Split[] | undefined
  reserveTokenSplits: Split[] | undefined
  queuedReserveTokenSplits: Split[] | undefined
  tokenAddress: string | undefined
  tokenSymbol: string | undefined
  terminals: string[] | undefined // array of terminal addresses, 0xABC...
  ETHBalance: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined
  queuedDistributionLimitCurrency: BigNumber | undefined
  balanceInDistributionLimitCurrency: BigNumber | undefined
  projectOwnerAddress: string | undefined
  usedDistributionLimit: BigNumber | undefined
}

export const V2ProjectContext = createContext<V2ProjectContextType>({
  projectId: undefined,
  projectMetadata: undefined,
  fundingCycleMetadata: undefined,
  fundingCycle: undefined,
  queuedFundingCycle: undefined,
  distributionLimit: undefined,
  queuedDistributionLimit: undefined,
  payoutSplits: undefined,
  queuedPayoutSplits: undefined,
  reserveTokenSplits: undefined,
  queuedReserveTokenSplits: undefined,
  tokenAddress: undefined,
  tokenSymbol: undefined,
  terminals: undefined,
  ETHBalance: undefined,
  distributionLimitCurrency: undefined,
  queuedDistributionLimitCurrency: undefined,
  balanceInDistributionLimitCurrency: undefined,
  projectOwnerAddress: undefined,
  usedDistributionLimit: undefined,
})
