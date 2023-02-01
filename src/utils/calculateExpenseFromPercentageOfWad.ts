import { BigNumber } from '@ethersproject/bignumber'
import { fromWad } from 'utils/format/formatNumber'

export const calculateExpenseFromPercentageOfWad = ({
  percentage,
  wad,
}: {
  percentage: number
  wad: BigNumber
}) => {
  return parseFloat(fromWad(wad)) * (percentage / 100)
}
