import { BigNumber } from '@ethersproject/bignumber'

export interface Budget {
  id: BigNumber
  number: BigNumber
  owner: string
  previous: BigNumber
  link: string
  want: string
  target: BigNumber
  total: BigNumber
  start: BigNumber
  duration: BigNumber
  tapped: BigNumber
  o: BigNumber
  b: BigNumber
  bAddress: string
  hasMintedReserves: boolean
  weight: BigNumber
  discountRate: BigNumber
}
