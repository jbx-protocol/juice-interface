import { BigNumber } from 'ethers'
import { V2FundingCycleMetadata } from 'packages/v2/models/fundingCycle'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycle,
} from 'packages/v2v3/models/fundingCycle'
import { SplitParams } from 'packages/v2v3/models/splits'

type OutgoingGroupedSplit = {
  splits: SplitParams[]
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
