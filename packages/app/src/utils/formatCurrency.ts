import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { CurrencyOption } from 'models/currency-option'

import { parseWad } from './formatNumber'

export class CurrencyUtils {
  // Define non-fractional conversion units
  usdPerEth: number | undefined = undefined
  weiPerUsd: number | undefined = undefined

  constructor(usdPerEth: number | undefined) {
    if (!usdPerEth) {
      console.info(
        'Failed to construct CurrencyUtils, received a usdPerEth value of',
        usdPerEth,
      )
      return
    }

    this.usdPerEth = usdPerEth
    this.weiPerUsd = Math.round((1 / usdPerEth) * 1e18)
  }

  weiToUsd = (wei: BigNumberish | undefined) => {
    if (!wei || !this.weiPerUsd) return BigNumber.from(0)

    try {
      return BigNumber.from(wei).div(this.weiPerUsd)
    } catch (e) {
      console.log("Couldn't convert wei amount", wei.toString(), 'to USD', e)
    }
  }

  usdToWei = (amount: number | string | undefined, precision = 8) => {
    if (!amount || !this.usdPerEth) return BigNumber.from(0)

    try {
      return parseWad(
        (
          (typeof amount === 'string' ? parseFloat(amount) : amount) /
          this.usdPerEth
        ).toFixed(precision),
      )
    } catch (e) {
      console.log("Couldn't convert USD amount", amount.toString(), 'to wei', e)
    }
  }

  wadToCurrency = (
    amount: BigNumberish | undefined,
    targetCurrency: CurrencyOption | undefined,
    sourceCurrency: CurrencyOption | undefined,
  ) => {
    if (targetCurrency === undefined || sourceCurrency === undefined) return
    if (targetCurrency === sourceCurrency) return BigNumber.from(amount)
    if (targetCurrency === 1) return parseWad(this.weiToUsd(amount)?.toString())
    if (targetCurrency === 0 && this.usdPerEth !== undefined)
      return BigNumber.from(amount).div(this.usdPerEth)
  }
}
