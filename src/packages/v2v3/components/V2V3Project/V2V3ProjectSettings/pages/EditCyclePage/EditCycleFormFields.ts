import { DurationOption } from 'components/inputs/DurationInput'
import { CurrencyName } from 'constants/currency'
import { Split } from 'models/splits'
import { NftRewardsData } from 'redux/slices/editingV2Project/types'

type DetailsSectionFields = {
  duration: number
  durationUnit: DurationOption
  ballot: string
  allowSetTerminals: boolean
  allowSetController: boolean
  allowControllerMigration: boolean
  allowTerminalMigration: boolean
  pausePay: boolean
}

type PayoutsSectionFields = {
  payoutSplits: Split[]
  distributionLimit: number | undefined // undefined = infinite limit
  distributionLimitCurrency: CurrencyName
  holdFees: boolean
}

type TokenSectionFields = {
  mintRate: number
  reservedTokens: number // percentage
  reservedSplits: Split[]
  discountRate: number // "Issuance reduction rate"
  redemptionRate: number
  allowTokenMinting: boolean
  pauseTransfers: boolean // "Disable project token transfers"
}

type NftSectionFields = {
  nftRewards: NftRewardsData | undefined
  useDataSourceForRedeem: boolean
}

export type EditCycleFormFields = DetailsSectionFields &
  PayoutsSectionFields &
  TokenSectionFields &
  NftSectionFields & {
    memo: string | undefined
  }
