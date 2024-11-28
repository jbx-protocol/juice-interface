import { BigNumber } from 'ethers/lib/ethers'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'

export interface ReduxDistributionLimit {
  amount: BigNumber
  currency: V2V3CurrencyOption
}
