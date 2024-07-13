import { V1CurrencyOption } from 'packages/v1/models/currencyOption'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'

export type CurrencyOption = V1CurrencyOption | V2V3CurrencyOption
