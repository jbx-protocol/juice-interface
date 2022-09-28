import { BigNumber } from '@ethersproject/bignumber'
import { OutgoingSplit } from './splits'
import { V2FundingCycleMetadata } from './v2/fundingCycle'
import { V2V3FundAccessConstraint, V2V3FundingCycle } from './v2v3/fundingCycle'

export type OutgoingGroupedSplit = {
  splits: OutgoingSplit[]
}
// Data pertaining to a project object that is sent in a reconfig tx
// Used to intepret data from Gnosis Safe transactions
export type OutgoingProjectData = {
  _metadata: V2FundingCycleMetadata
  _memo: string
  _data: V2V3FundingCycle
  _fundAccessConstraints: V2V3FundAccessConstraint[]
  _groupedSplits: OutgoingGroupedSplit[]
  _projectId: BigNumber
  _mustStartAtOrAfter: BigNumber
}
