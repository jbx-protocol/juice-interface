import { CurrencyName } from 'constants/currency'
import round from 'lodash/round'
import { BigintIsh } from 'utils/bigNumbers'
import { parseWad } from './formatNumber'

export class CurrencyUtils {
  // Define non-fractional conversion units
  usdPerEth: number | undefined = undefined
  weiPerUsd: number | undefined = undefined

  constructor(usdPerEth: number | undefined) {
    if (!usdPerEth) {
      return
    }

    this.usdPerEth = usdPerEth
    this.weiPerUsd = Math.round((1 / usdPerEth) * 1e18)
  }

  weiToUsd = (wei: BigintIsh | undefined) => {
    if (!wei || !this.weiPerUsd) return BigInt(0)

    try {
      return BigInt(wei) / BigInt(this.weiPerUsd)
    } catch (e) {
      console.error("Couldn't convert wei amount", wei.toString(), 'to USD', e)
    }
  }

  usdToWei = (amount: number | string | undefined, precision = 8) => {
    if (!amount || !this.usdPerEth) return BigInt(0)

    try {
      return parseWad(
        (
          (typeof amount === 'string' ? parseFloat(amount) : amount) /
          this.usdPerEth
        ).toFixed(precision),
      )
    } catch (e) {
      console.error(
        "Couldn't convert USD amount",
        amount.toString(),
        'to wei',
        e,
      )
      return BigInt(0)
    }
  }

  wadToCurrency = (
    amount: BigintIsh | undefined,
    targetCurrency: CurrencyName | undefined,
    sourceCurrency: CurrencyName | undefined,
  ) => {
    if (targetCurrency === undefined || sourceCurrency === undefined) return
    if (targetCurrency === sourceCurrency) return BigInt(amount ?? 0)
    if (targetCurrency === 'USD')
      return parseWad(this.weiToUsd(amount)?.toString())
    if (targetCurrency === 'ETH' && this.usdPerEth !== undefined)
      return (BigInt(amount ?? 0) / BigInt(round(this.usdPerEth * 100))) * 100n
  }
}
