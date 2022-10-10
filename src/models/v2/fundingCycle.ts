import { BaseV2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'

export type V2FundingCycleMetadata = BaseV2V3FundingCycleMetadata & {
  allowChangeToken: boolean
}
