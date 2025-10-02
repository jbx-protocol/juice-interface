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
  weightCutPercent: number // "Discount / issuance cut percent"
  cashOutTaxRate: number
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
    mustStartAtOrAfter?: number // timestamp in seconds, optional for omni Safe projects
  }
