import {
  BaseV2V3FundingCycleMetadata,
  BaseV2V3FundingCycleMetadataGlobal,
} from 'models/v2v3/fundingCycle'

export type V2FundingCycleMetadataGlobal = BaseV2V3FundingCycleMetadataGlobal

export type V2FundingCycleMetadata = BaseV2V3FundingCycleMetadata & {
  global: BaseV2V3FundingCycleMetadataGlobal
  allowChangeToken: boolean
}
