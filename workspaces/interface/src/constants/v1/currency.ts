import {
  V1CurrencyETH,
  V1CurrencyOption,
  V1CurrencyUSD,
} from 'models/v1/currencyOption'

import { CurrencyMetadata, CURRENCY_METADATA } from 'constants/currency'

export const V1_CURRENCY_ETH: V1CurrencyETH = 0
export const V1_CURRENCY_USD: V1CurrencyUSD = 1

export const V1_CURRENCY_METADATA: Record<V1CurrencyOption, CurrencyMetadata> =
  {
    [V1_CURRENCY_ETH]: CURRENCY_METADATA.ETH,
    [V1_CURRENCY_USD]: CURRENCY_METADATA.USD,
  }

export const V1_CURRENCY_CONTEXT = {
  currencyMetadata: V1_CURRENCY_METADATA,
  currencies: { ETH: V1_CURRENCY_ETH, USD: V1_CURRENCY_USD },
}
