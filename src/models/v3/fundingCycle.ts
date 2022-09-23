import { BigNumber } from '@ethersproject/bignumber'
import { V2V3FundingCycleMetadataGlobal } from 'models/v2/fundingCycle'
import { BaseV2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'

export type V3FundingCycleMetadataGlobal = V2V3FundingCycleMetadataGlobal & {
  pauseTransfers?: boolean
}

export type V3FundingCycleMetadata = BaseV2V3FundingCycleMetadata & {
  global: V3FundingCycleMetadataGlobal
  preferClaimedTokenOverride?: boolean
  metadata?: BigNumber
}
