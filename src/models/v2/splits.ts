export type Split = {
  beneficiary: string | undefined // address
  percent: number
  preferClaimed: boolean | undefined
  lockedUntil: number | undefined
  projectId: string | undefined
  allocator: string | undefined // address, If an allocator is specified, funds will be sent to the allocator contract along with the projectId, beneficiary, preferClaimed properties.
}

export type ETHPayoutSplitGroup = 1
export type ReserveTokenSplitGroup = 2
export type SplitGroup = ETHPayoutSplitGroup | ReserveTokenSplitGroup

export interface GroupedSplits<G> {
  group: G
  splits: Split[]
}

export type ETHPayoutGroupedSplits = GroupedSplits<ETHPayoutSplitGroup>
export type ReserveTokenGroupedSplits = GroupedSplits<ReserveTokenSplitGroup>
