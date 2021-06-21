// export interface PaymentMod {
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
  note?: string
}
