import { CURRENCY_METADATA, CurrencyMetadata, CurrencyName } from "constants/currency"
import { V4CurrencyETH, V4CurrencyOption, V4CurrencySEP, V4CurrencyUSD } from "../models/v4CurrencyOption"

export const V4_CURRENCY_ETH: V4CurrencyETH = 1
export const V4_CURRENCY_USD: V4CurrencyUSD = 2
export const V4_CURRENCY_SEP: V4CurrencySEP = 61166


export const V4_CURRENCY_METADATA: Record<
  V4CurrencyOption,
  CurrencyMetadata
> = {
  [V4_CURRENCY_ETH]: CURRENCY_METADATA.ETH,
  [V4_CURRENCY_USD]: CURRENCY_METADATA.USD,
  [V4_CURRENCY_SEP]: CURRENCY_METADATA.SepETH,
}

export const V4CurrencyName = (
  currency?: V4CurrencyOption,
): CurrencyName | undefined =>
  currency !== undefined ? V4_CURRENCY_METADATA[currency]?.name : undefined

export const getV4CurrencyOption = (
  currencyName: CurrencyName,
): V4CurrencyOption =>
  currencyName === 'ETH' ? V4_CURRENCY_ETH : V4_CURRENCY_USD
