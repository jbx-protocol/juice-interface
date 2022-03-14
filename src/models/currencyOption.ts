import { V1CurrencyOption } from './v1/currencyOption'
import { V2CurrencyOption } from './v2/currencyOption'

export type CurrencyOption = V1CurrencyOption | V2CurrencyOption
