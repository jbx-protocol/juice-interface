import { BigNumber } from '@ethersproject/bignumber'

export interface Budget {
  id: BigNumber
  project: string
  number: BigNumber
  previous: BigNumber
  next: BigNumber
  name: string
  link: string
  target: BigNumber
  currency: BigNumber // 0 ETH, 1 USD
  total: BigNumber
  start: BigNumber
  duration: BigNumber
  tappedTarget: BigNumber
  tappedTotal: BigNumber
  p: BigNumber
  b: BigNumber
  bAddress: string
  weight: BigNumber
  discountRate: BigNumber
  configured: BigNumber
}
