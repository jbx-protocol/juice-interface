import { BaseV2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'

export type V2V3FundingCycleMetadataGlobal = {
  allowSetController: boolean
  allowSetTerminals: boolean
}

export type V2FundingCycleMetadata = BaseV2V3FundingCycleMetadata & {
  global: V2V3FundingCycleMetadataGlobal
  allowChangeToken: boolean
}
