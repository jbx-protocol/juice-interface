// export interface PaymentMod {
import { BigNumber } from '@ethersproject/bignumber'
//   beneficiary: string
//   percent: number
//   preferUnstaked: boolean
//   projectId: number
//   note: string
// }

export interface ModRef {
  beneficiary?: string
  percent: number
  preferUnstaked?: boolean
  lockedUntil?: number
  projectId?: BigNumber
}
