import { BaseV2V3FundingCycleMetadata } from 'packages/v2v3/models/fundingCycle'

export type V2FundingCycleMetadata = BaseV2V3FundingCycleMetadata & {
  allowChangeToken: boolean
}
