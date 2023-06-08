import { BigNumber } from 'ethers'
import { V2BallotState } from 'models/ballot'
import { Split } from 'models/splits'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { createContext } from 'react'

interface V2V3ProjectLoadingStates {
  ETHBalanceLoading: boolean
  balanceInDistributionLimitCurrencyLoading: boolean
  distributionLimitLoading: boolean
  fundingCycleLoading: boolean
  usedDistributionLimitLoading: boolean
  primaryETHTerminalLoading: boolean
}

export type V2V3ProjectContextType = {
  handle: string | undefined
  createdAt: number | undefined
  tokenAddress: string | undefined
  tokenSymbol: string | undefined
  tokenName: string | undefined
  terminals: string[] | undefined // array of terminal addresses, 0xABC...
  primaryETHTerminal: string | undefined
  primaryETHTerminalFee: BigNumber | undefined
  ETHBalance: BigNumber | undefined

  totalVolume: BigNumber | undefined
  trendingVolume: BigNumber | undefined
  paymentsCount: number | undefined

  projectOwnerAddress: string | undefined
  balanceInDistributionLimitCurrency: BigNumber | undefined
  usedDistributionLimit: BigNumber | undefined // how much has been distributed

  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined
  fundingCycle: V2V3FundingCycle | undefined
  ballotState: V2BallotState | undefined

  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined

  payoutSplits: Split[] | undefined
  reservedTokensSplits: Split[] | undefined

  primaryTerminalCurrentOverflow: BigNumber | undefined
  totalTokenSupply: BigNumber | undefined

  loading: V2V3ProjectLoadingStates
}

export const V2V3ProjectContext = createContext<V2V3ProjectContextType>({
  handle: undefined,
  createdAt: undefined,
  tokenAddress: undefined,
  tokenSymbol: undefined,
  tokenName: undefined,
  terminals: undefined,
  primaryETHTerminal: undefined,
  primaryETHTerminalFee: undefined,
  ETHBalance: undefined,

  totalVolume: undefined,
  trendingVolume: undefined,
  paymentsCount: undefined,

  projectOwnerAddress: undefined,
  balanceInDistributionLimitCurrency: undefined,
  usedDistributionLimit: undefined,

  fundingCycleMetadata: undefined,
  fundingCycle: undefined,
  ballotState: undefined,

  distributionLimit: undefined,
  distributionLimitCurrency: undefined,

  payoutSplits: undefined,
  reservedTokensSplits: undefined,

  primaryTerminalCurrentOverflow: undefined,
  totalTokenSupply: undefined,

  loading: {
    ETHBalanceLoading: false,
    balanceInDistributionLimitCurrencyLoading: false,
    distributionLimitLoading: false,
    fundingCycleLoading: false,
    usedDistributionLimitLoading: false,
    primaryETHTerminalLoading: false,
  },
})
