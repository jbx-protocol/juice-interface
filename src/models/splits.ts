import { BigNumber } from 'ethers'

export type Split = {
  beneficiary: string | undefined // address
  percent: number
  preferClaimed: boolean | undefined
  lockedUntil: number | undefined
  projectId: string | undefined
  allocator: string | undefined // address, If an allocator is specified, funds will be sent to the allocator contract along with the projectId, beneficiary, preferClaimed properties.
  totalValue?: BigNumber
}

// Splits as they are given to transactions such as reconfigureFundingCyclesOf
// Used when interpreting data from Gnosis Safe transactions
export type SplitParams = {
  beneficiary: string | undefined // address
  percent: BigNumber
  preferClaimed: boolean | undefined
  lockedUntil: number | undefined
  projectId: string | undefined
  allocator: string | undefined
}

export const defaultSplit = {
  beneficiary: undefined,
  percent: 0,
  preferClaimed: undefined,
  lockedUntil: undefined,
  projectId: undefined,
  allocator: undefined,
}

export type ETHPayoutSplitGroup = 1
export type ReservedTokensSplitGroup = 2
export type SplitGroup = ETHPayoutSplitGroup | ReservedTokensSplitGroup

export interface GroupedSplits<G> {
  group: G
  splits: Split[]
}

export type ETHPayoutGroupedSplits = GroupedSplits<ETHPayoutSplitGroup>
export type ReservedTokensGroupedSplits =
  GroupedSplits<ReservedTokensSplitGroup>
