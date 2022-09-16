import { BigNumber } from '@ethersproject/bignumber'
import {
  BaseV2FundingCycleMetadata,
  V2FundingCycleMetadataGlobal,
} from 'models/v2/fundingCycle'

export type V3FundingCycleMetadataGlobal = V2FundingCycleMetadataGlobal & {
  pauseTransfers: boolean
}
export type V3FundingCycleMetadata = BaseV2FundingCycleMetadata & {
  global: V3FundingCycleMetadataGlobal
  preferClaimedTokenOverride: boolean
  metadata: BigNumber
}
