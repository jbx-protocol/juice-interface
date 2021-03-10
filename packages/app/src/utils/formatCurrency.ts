import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'

// "wad" ==> 1/1e18

// const decimalSeparator = '.'

// const separateThousands = (str?: string, separator = ',') => {
//   if (!str?.trim().length) return

//   let output = ''
//   let charPosition = 0

//   for (let i = str.length - 1; i >= 0; i--) {
//     output =
//       charPosition > 0 && charPosition % 3 === 0
//         ? str[i] + separator + output
//         : str[i] + output
//     charPosition++
//   }

//   return output
// }

// const formattedNum = (num?: number | string) => {
//   if (num === undefined) return

//   const str = num?.toString()

//   if (!str.length) return

//   let output = ''
//   let charPosition = 0

//   if (str.includes(decimalSeparator)) {
//     const segments = str.split(decimalSeparator)
//     return [separateThousands(segments[0]), segments[1]].join(decimalSeparator)
//   }

//   return separateThousands(str)
// }

export const formatWad = (amt?: BigNumberish) =>
  amt !== undefined && amt !== null ? formatEther(amt) : undefined
export const parseWad = (amt?: string) => (amt ? parseEther(amt) : undefined)

export class CurrencyUtils {
  // Define non-fractional conversion units
  usdPerEth: number | undefined = undefined
  weiPerUsd: number | undefined = undefined

  constructor(usdPerEth: number | undefined) {
    if (usdPerEth === undefined) return

    this.usdPerEth = usdPerEth
    this.weiPerUsd = Math.round((1 / usdPerEth) * 1e18)
  }

  weiToUsd = (wei: BigNumberish | undefined) => {
    if (!wei || this.weiPerUsd === undefined) return

    try {
      return BigNumber.from(wei).div(this.weiPerUsd)
    } catch (e) {
      console.log("Couldn't convert wei amount", wei.toString(), 'to USD', e)
    }
  }

  usdToWei = (usd: number | string | undefined, precision = 8) => {
    if (usd === undefined || this.usdPerEth === undefined) return
    if (usd === '') return BigNumber.from(0)

    try {
      return parseEther(
        (
          (typeof usd === 'string' ? parseFloat(usd) : usd) / this.usdPerEth
        ).toFixed(precision),
      )
    } catch (e) {
      console.log("Couldn't convert USD amount", usd.toString(), 'to wei', e)
    }
  }
}

export const fracDiv = (quotient: string, dividend: string) => {
  return parseFloat(quotient) / parseFloat(dividend)
}
