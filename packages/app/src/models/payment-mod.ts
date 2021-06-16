export interface PaymentMod {
  beneficiary: string
  percent: number
  preferUnstaked: boolean
  projectId: number
  note: string
}

export interface ModRef {
  address?: string
  amount?: number
}
