import { DurationOption } from 'components/inputs/DurationInput'
import { CurrencyName } from 'constants/currency'
import { JBSplit } from 'juice-sdk-core'

type DetailsSectionFields = {
  duration: number
  durationUnit: DurationOption
  approvalHook: `0x${string}`
  allowSetTerminals: boolean
  allowSetController: boolean
  allowTerminalMigration: boolean
  pausePay: boolean
}

type PayoutsSectionFields = {
  payoutSplits: JBSplit[]
  payoutLimit: number | undefined // undefined = infinite limit
  payoutLimitCurrency: CurrencyName
  holdFees: boolean
}

type TokenSectionFields = {
  issuanceRate: number
  reservedPercent: number // percentage
  reservedTokensSplits: JBSplit[]
  decayPercent: number // "Discount / Issuance reduction rate"
  redemptionRate: number
  allowOwnerMinting: boolean
  tokenTransfers: boolean 
}

// type NftSectionFields = {
//   nftRewards: NftRewardsData | undefined
//   useDataSourceForRedeem: boolean
// }

export type EditCycleFormFields = DetailsSectionFields &
  PayoutsSectionFields &
  TokenSectionFields //&
  // NftSectionFields 
  & {
    memo: string | undefined
  }
