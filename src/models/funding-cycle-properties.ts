import { BigNumber } from '@ethersproject/bignumber'

export interface FCProperties {
  target: BigNumber
  currency: BigNumber
  duration: BigNumber
  discountRate: BigNumber
  cycleLimit: BigNumber
  ballot: string
}
