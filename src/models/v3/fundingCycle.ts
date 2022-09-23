import { BigNumber } from '@ethersproject/bignumber'
import {
  BaseV2V3FundingCycleMetadata,
  BaseV2V3FundingCycleMetadataGlobal,
} from 'models/v2v3/fundingCycle'

export type V3FundingCycleMetadataGlobal =
  BaseV2V3FundingCycleMetadataGlobal & {
    pauseTransfers?: boolean
  }

export type V3FundingCycleMetadata = BaseV2V3FundingCycleMetadata & {
  global: V3FundingCycleMetadataGlobal
  preferClaimedTokenOverride?: boolean
  metadata?: BigNumber
}
