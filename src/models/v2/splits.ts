import { BigNumber } from '@ethersproject/bignumber'

export type Split = {
  beneficiary?: string // address
  percent: BigNumber
  preferClaimed?: boolean
  lockedUntil?: BigNumber
  projectId?: BigNumber
  allocator?: string // address, If an allocator is specified, funds will be sent to the allocator contract along with the projectId, beneficiary, preferClaimed properties.
}

export type ETHPayoutSplitGroup = 1
export type ReserveTokenSplitGroup = 2
export type SplitGroup = ETHPayoutSplitGroup | ReserveTokenSplitGroup

export type GroupedSplits = {
  group: BigNumber
  splits: Split[]
}
