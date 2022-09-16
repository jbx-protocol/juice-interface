import { BigNumber } from '@ethersproject/bignumber'
import { V2BallotState } from 'models/ballot'
import { Split } from 'models/splits'
import {
  V2FundingCycleMetadata,
  V2V3FundingCycle,
} from 'models/v2/fundingCycle'
import { createContext } from 'react'

type V2ProjectLoadingStates = {
  ETHBalanceLoading: boolean
  balanceInDistributionLimitCurrencyLoading: boolean
  distributionLimitLoading: boolean
  fundingCycleLoading: boolean
  usedDistributionLimitLoading: boolean
}

export type V2V3ProjectContextType = {
  isPreviewMode?: boolean

  handle: string | undefined
  createdAt: number | undefined
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

  fundingCycleMetadata: V2FundingCycleMetadata | undefined
  fundingCycle: V2V3FundingCycle | undefined
  ballotState: V2BallotState | undefined

  distributionLimit: BigNumber | undefined
  distributionLimitCurrency: BigNumber | undefined

  payoutSplits: Split[] | undefined
  reservedTokensSplits: Split[] | undefined

  primaryTerminalCurrentOverflow: BigNumber | undefined
  totalTokenSupply: BigNumber | undefined

  loading: V2ProjectLoadingStates
}

export const V2V3ProjectContext = createContext<V2V3ProjectContextType>({
  isPreviewMode: false,

  handle: undefined,
  createdAt: undefined,
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
  },
})
