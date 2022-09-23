import { V1CurrencyOption } from './v1/currencyOption'
import { V2V3CurrencyOption } from './v2v3/currencyOption'

export type CurrencyOption = V1CurrencyOption | V2V3CurrencyOption
