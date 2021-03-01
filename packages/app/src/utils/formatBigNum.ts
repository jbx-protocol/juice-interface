import { BigNumber } from '@ethersproject/bignumber'

export const formatBigNum = (num?: BigNumber) => {
  if (!num) return

  const str = num?.toString()

  if (!str.length) return

  let output = ''
  let charPosition = 0

  for (let i = str.length - 1; i >= 0; i--) {
    output =
      charPosition > 0 && charPosition % 3 === 0
        ? str[i] + ',' + output
        : str[i] + output
    charPosition++
  }

  return output
}
