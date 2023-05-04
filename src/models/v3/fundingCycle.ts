import { BigNumber } from 'ethers'
import {
  BaseV2V3FundingCycleMetadata,
  BaseV2V3FundingCycleMetadataGlobal,
} from 'models/v2v3/fundingCycle'

export type BaseV3FundingCycleMetadataGlobal =
  BaseV2V3FundingCycleMetadataGlobal & {
    pauseTransfers?: boolean
  }

export type V3FundingCycleMetadata = BaseV2V3FundingCycleMetadata & {
  global: BaseV3FundingCycleMetadataGlobal
  preferClaimedTokenOverride?: boolean
  metadata?: BigNumber
}
