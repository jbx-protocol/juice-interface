import { BigNumber } from '@ethersproject/bignumber'

export interface Budget {
  name: string
  id: BigNumber
  number: BigNumber
  project: string
  previous: BigNumber
  link: string
  want: string
  target: BigNumber
  total: BigNumber
  start: BigNumber
  duration: BigNumber
  tapped: BigNumber
  p: BigNumber
  b: BigNumber
  bAddress: string
  hasMintedReserves: boolean
  weight: BigNumber
  discountRate: BigNumber
}
